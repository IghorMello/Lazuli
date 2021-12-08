import random
import string
import json
import os

from bson import ObjectId
from bson import json_util
from bson.json_util import dumps
from decouple import config
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from datetime import date, datetime
from flask import Flask, flash, jsonify, request, Response, session, Blueprint, render_template

employee_views = Blueprint('employee', __name__)

# MongoDB

employee = Flask(__name__)
employee.config['MONGO_URI'] = config('MONGO_URI')
mongo = PyMongo(employee)

#---------------------------------------
# Fazer login do funcionário
#---------------------------------------

@employee_views.route('/', methods=['POST'])
def login():
  # Mongo
  employees = mongo.db.employees
  data_search = mongo.db.employees.find()

  # Obter data atual
  date = datetime.now()
  time = date.strftime('%H:%M')
  data = date.strftime('%d/%m/%Y') 

  # Verificar código de usuário
  user_code = request.json['user_code']
  code_found = employees.find_one({"user_code": user_code})

  # Se o código for existente
  if code_found:
    result = {}

    for data_verify in data_search:
      if user_code == data_verify['user_code']:
        local_id_new_data = data_verify

    # Obtendo seção atual
    clean_obj_id = local_id_new_data['_id']
    session['userId'] = str(clean_obj_id)

    # Dados a serem enviados por email
    result['user_code'] = user_code
    result['email'] = local_id_new_data['email']
    result['name'] = local_id_new_data['name']
    result['type_user'] = "employee"
    result['id'] = local_id
    result['time'] = time
    result['data'] = data

    # Habilitar função de envio de e-mail
    send_email_employees(result)
    response = json_util.dumps(result)
    return Response(response, mimetype='application/json')

#---------------------------------------
# Listar usuário
#---------------------------------------

@employee_views.route('/employees',methods=['GET'])
def get_all_employees():
  employees = mongo.db.employees.find()
  response = json_util.dumps(employees)  
  return Response(response, mimetype='application/json')

#---------------------------------------
# Listar usuário específico
#---------------------------------------

@employee_views.route('/employees/<id>', methods=['GET'])
def get_employees(id):
  user = mongo.db.employees.find_one({'_id': ObjectId(id), })
  response = json_util.dumps(user)
  return Response(response, mimetype="application/json")

#---------------------------------------
# Deletar usuário
#---------------------------------------

@employee_views.route('/employees/<id>', methods=['DELETE'])
def delete_employees(id):
  mongo.db.employees.delete_one({'_id': ObjectId(id)})
  response = jsonify({'message': 'Usuário com id ' + id + ' foi deletado com sucesso'})
  response.status_code = 200
  return response

#---------------------------------------
# Atualizar usuário
#---------------------------------------

@employee_views.route('/employees/<_id>', methods=['PUT'])
def update_employees(_id):
  name = request.json['name']
  email = request.json['email']
  phone = request.json['phone']
  gender = request.json['gender']
  address = request.json['address']
  work_time = request.json['work_time']
  type_user = request.json['type_user']
  blood_type = request.json['blood_type']
  birth_date = request.json['birth_date']
  responsible = request.json['responsible'] 
  disorder_detected = request.json['disorder_detected']
  medical_follow_up = request.json['medical_follow_up']
  use_controlled_medication = request.json['use_controlled_medication']

  # Se os dados estiverem existentes
  if name and email and phone and gender and address and work_time and type_user and blood_type and birth_date and responsible and disorder_detected and medical_follow_up and use_controlled_medication and _id:
    mongo.db.employees.update_one(
      { '_id': ObjectId(_id['$oid']) if '$oid' in _id else ObjectId(_id) }, 
      { '$set': { 
        "name":  name,
        "email": email,
        "phone": phone,
        "gender": gender,
        "address": address,
        "work_time": work_time,
        "type_user": type_user,
        "blood_type": blood_type,
        "birth_date": birth_date,
        "responsible": responsible, 
        "disorder_detected": disorder_detected,
        "medical_follow_up": medical_follow_up,
        "use_controlled_medication": use_controlled_medication,
      }}
    )

    #  Retorna resposta
    response = jsonify({'message': 'IT professional ' + name + ", with code " + _id + ' has been updated successfully'})
    response.status_code = 200
    return response 

  else: # Do contrário, habilita tela de erro 
    return not_found()