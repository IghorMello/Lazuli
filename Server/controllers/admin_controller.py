import random
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

admin_views = Blueprint('admin', __name__)

admin = Flask(__name__)

admin.config['MONGO_URI'] = config('MONGO_URI')
mongo = PyMongo(admin)

#---------------------------------------
# Fazer login do administrador
#---------------------------------------

@admin_views.route('/admin', methods=['POST'])
def login_admin():
  # Obter dados do mongo do Administrador
  admindata = mongo.db.admindata
  admindata_search = mongo.db.admindata.find()

  # Obter data atual
  date = datetime.now()
  time = date.strftime('%H:%M')
  data = date.strftime('%d/%m/%Y') 

  # Obter dados
  email = request.json['email']
  password = request.json['password']
  email_found = admindata.find_one({"email": email})
  password_found = admindata.find_one({"password": password})

  # Se o email e a senha estiverem cadastrados
  if email_found and password_found:
    for data_verify in admindata_search:
      if password == data_verify['password']:
        new_data = data_verify

    # Obtendo o id da seção
    clean_objId = new_data['_id']
    local_id = str(clean_objId)

    # Obtendo seção atual
    session['userId']=local_id
    print('\nSessão atual', session['userId'])

    result = {}
    result['email'] = request.json['email']
    result['localId'] = session['userId']
    result['password'] = request.json['password']
    result['type_user'] = "admin"
    result['data'] = data
    result['time'] = time
  response = json_util.dumps(result)
  return Response(response, mimetype='application/json')

#---------------------------------------
# Cadastrar admin
#---------------------------------------

@admin_views.route('/register/admin', methods=['POST'])
def register_admin():
  status = 1
  date = datetime.now()
  createdAt = date.strftime('%d/%m/%Y %H:%M') 
  password = request.json['password']
  nome = request.json['nome'] 
  email = request.json['email']

  # Listar dados do admin
  admindata_data = mongo.db.admindata
  email_found = admindata_data.find_one({"email": email})

  # Se o e-mail já existe
  if email_found:
    response = jsonify({'message': 'Email já existente'})
    response.status_code = 200
    return response

  elif password and nome and email: # Do contrário
    # Realiza o cadastro
    id = mongo.db.admindata.insert({ 
      "email": email,
      "nome": nome,
      "type_user": "admin",
      "status": 1,
      "password": password,
    })

    # Retorna a lista de dados 
    response = jsonify({
      '_id': str(id),
      "password": password,
      "type_user": "admin",
      "status": 1,
      "nome": nome,
      "email": email,
      "createdAt": createdAt,
    })
    session['localIdAdmin'] = str(id)
    print('\n\nDados obtidos\n\n', session['localIdAdmin'])

    # Retorna status positivo
    response.status_code = 201
    return response

  else: # Do contrário será retornado tela de erro 
    return not_found()

#---------------------------------------
# Deletar administrador
#---------------------------------------

@admin_views.route('/admin/<id>', methods=['DELETE'])
def delete_admin(id):
  mongo.db.admindata.delete_one({'_id': ObjectId(id)})
  response = jsonify({'message': 'Administrador com código ' + id + ' foi deletado com sucesso'})
  response.status_code = 200
  return response

#---------------------------------------
# Listar administrador
#---------------------------------------

@admin_views.route('/admin/list', methods=['GET'])
def get_all_admin():
  admin = mongo.db.admindata.find()
  response = json_util.dumps(admin)
  return Response(response, mimetype='application/json')

#---------------------------------------
# Cadastrar responsável médico
#---------------------------------------

@admin_views.route('/admin/register-medical', methods=['POST'])
def register_medical():
  status = 1
  date = datetime.now()
  createdAt = date.strftime('%d/%m/%Y %H:%M') 
  crm = request.json['crm']
  nome = request.json['nome'] 
  email = request.json['email']

  # Listar dados do responsável médico
  medical_data = mongo.db.medical
  email_found = medical_data.find_one({"email": email})

  # Se o e-mail já existe
  if email_found:
    response = jsonify({'message': 'Email já existente'})
    response.status_code = 200
    return response

  elif crm and nome and email: # Do contrário
    # Realiza o cadastro
    id = mongo.db.medical.insert({ 
      "email": email,
      "type_user": "responsavel_medico",
      "nome": nome,
      "status": 1,
      "crm": crm,
    })

    # Retorna a lista de dados 
    response = jsonify({
      '_id': str(id),
      "crm": crm,
      "status": 1,
      "type_user": "responsavel_medico",
      "nome": nome,
      "email": email,
      "createdAt": createdAt,
    })

    # Retorna status positivo
    response.status_code = 201
    return response

  else: # Do contrário será retornado tela de erro 
    return not_found()