import random
import bcrypt
import string
import json
import os

from bson import ObjectId
from bson import json_util
from decouple import config
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from datetime import date, datetime
from flask import Flask, flash, jsonify, request, Response, session, Blueprint, render_template
from models.error import not_found

medical_views = Blueprint('medical', __name__)

medical = Flask(__name__)

medical.config['MONGO_URI'] = config('MONGO_URI')
mongo = PyMongo(medical)

#---------------------------------------
# Atualizar responsável médico
#---------------------------------------

@medical_views.route('/medical/<_id>', methods=['PUT'])
def update_medical(_id):
  password = request.json['password']
  email = request.json['email']
  name = request.json['name'] 

  # Se a senha, nome, email já estiverem cadastrados
  if password and name and email and _id:
    mongo.db.medical.update_one(
      { '_id': ObjectId(_id['$oid']) if '$oid' in _id else ObjectId(_id) }, 
      { '$set': { 
        "password": password,
        "name": name,
        'email': email
      }}
    )
    response = jsonify({'message': 'Medical officer ' + name + ", with code " + _id + ' has been updated successfully'})
    response.status_code = 200
    return response 

  else: 
    return not_found()

#---------------------------------------
# Fazer login do responsável médico
#---------------------------------------

@medical_views.route('/medical', methods=['POST'])
def login_medical():
  # Obter dados do responsável médico
  medical = mongo.db.medical
  data_search = mongo.db.medical.find()

  # Obter data atual
  date = datetime.now()
  time = date.strftime('%H:%M')
  data = date.strftime('%d/%m/%Y') 
  
  # Obter dados
  email = request.json['email']
  password = request.json['password']
  email_found = medical.find_one({"email": email})
  
  # Se o email e senha estiverem cadastrados
  if email_found:
    password_check = email_found['password']

    if bcrypt.checkpw(password.encode('utf-8'), password_check):
      for data_verify in data_search:
        local_id_data = data_verify
    
      # Obtendo o id da seção
      clean_obj_id = local_id_data['_id']

      # Obtendo seção atual
      session['userId'] = str(clean_obj_id)
      
      result = {}
      result['email'] = request.json['email']
      result['localId'] = session['userId']
      result['password'] = password_check
      result['type_user'] = "medical"
      result['data'] = data
      result['time'] = time
      response = json_util.dumps(result)
      return Response(response, mimetype='application/json')

    else: # Do contrário será retornado tela de erro 
      return not_found()
  return not_found()

#---------------------------------------
# Cadastrar funcionário
#---------------------------------------

@medical_views.route('/medical/register-employee', methods=['POST'])
def register_medical_file():
  status = 1
  
  # Dados para cadastro do profissional de TI
  date = datetime.now()
  name = request.json['name'] 
  email = request.json['email']
  phone = request.json['phone']
  gender = request.json['gender']
  responsible = session['userId']
  address = request.json['address']
  work_time = request.json['work_time']
  blood_type = request.json['blood_type']
  birth_date = request.json['birth_date']
  disorder_detected =  request.json['disorder_detected']
  medical_follow_up = request.json['medical_follow_up']
  use_controlled_medication = request.json['use_controlled_medication']
  
  # Criando o código do usuário
  letters = string.ascii_lowercase
  created_at = date.strftime('%d/%m/%Y %H:%M') 
  user_code = ''.join(random.choice(letters) for i in range(10))

  # Listando os dados do funcionário
  employees_data = mongo.db.employees
  email_found = employees_data.find_one({"email": email})

  # Se o e-mail já é existente
  if email_found:
    response = jsonify({'message': 'Email já existente'})
    response.status_code = 200
    return response

  elif name and email and phone and gender and address and work_time and blood_type and birth_date and disorder_detected and medical_follow_up and use_controlled_medication:
    id = mongo.db.employees.insert({ 
      "name":  name,
      "email": email,
      "phone": phone,
      "gender": gender,
      "address": address,
      "user_code": user_code,
      "work_time": work_time,
      "type_user": "employee",
      "blood_type": blood_type,
      "created_at": created_at,
      "birth_date": birth_date,
      "responsible": responsible, 
      "disorder_detected": disorder_detected,
      "medical_follow_up": medical_follow_up,
      "use_controlled_medication": use_controlled_medication,
    })
    response = jsonify({
      '_id': str(id),
      "name":  name,
      "email": email,
      "phone": phone,
      "gender": gender,
      "address": address,
      "user_code": user_code,
      "work_time": work_time,
      "type_user": "employee",
      "blood_type": blood_type,
      "created_at": created_at,
      "birth_date": birth_date,
      "responsible": responsible, 
      "disorder_detected": disorder_detected,
      "medical_follow_up": medical_follow_up,
      "use_controlled_medication": use_controlled_medication,
    })
    response.status_code = 201
    return response

  else:
    return not_found()

#---------------------------------------
# Listar responsável médico
#---------------------------------------

@medical_views.route('/medical/list', methods=['GET'])
def get_all_medical():
  medical = mongo.db.medical.find()
  response = json_util.dumps(medical)
  return Response(response, mimetype='application/json')

#---------------------------------------
# Listar responsável médico específico
#---------------------------------------

@medical_views.route('/medical/<id>', methods=['GET'])
def get_medical(id):
  medical = mongo.db.medical.find_one({'_id': ObjectId(id), })
  response = json_util.dumps(medical)
  return Response(response, mimetype="application/json")

#---------------------------------------
# Deletar usuário
#---------------------------------------

@medical_views.route('/medical/<id>', methods=['DELETE'])
def delete_medical(id):
  mongo.db.medical.delete_one({'_id': ObjectId(id)})
  response = jsonify({'message': 'Usuário com código ' + id + ' foi deletado com sucesso'})
  response.status_code = 200
  return response