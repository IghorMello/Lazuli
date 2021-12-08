import random
import string
import bcrypt
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

  # Se o email e a senha estiverem cadastrados
  if email_found:
    password_check = email_found['password']

    if bcrypt.checkpw(password.encode('utf-8'), password_check):
      for data_verify in admindata_search:
        local_id_data = data_verify

      # Obtendo o id da seção
      clean_obj_id = local_id_data['_id']
      session['userId'] = str(clean_obj_id)
      print('\nSessão atual', session['userId'])

      result = {}
      result['email'] = request.json['email']
      result['localId'] = session['userId']
      result['password'] = password_check
      result['type_user'] = "admin"
      result['data'] = data
      result['time'] = time
      response = json_util.dumps(result)

    else: # Do contrário será retornado tela de erro 
      return not_found()
  return Response(response, mimetype='application/json')

#---------------------------------------
# Cadastrar admin
#---------------------------------------

@admin_views.route('/register/admin', methods=['POST'])
def register_admin():
  status = 1
  date = datetime.now()
  created_at = date.strftime('%d/%m/%Y %H:%M') 
  password = request.json['password']
  name = request.json['name'] 
  email = request.json['email']

  # Listar dados do admin
  admin_data = mongo.db.admindata
  email_found = admin_data.find_one({"email": email})

  # Se o e-mail já existe
  if email_found:
    response = jsonify({'message': 'Existing Email'})
    response.status_code = 200
    return response

  elif password and name and email: # Do contrário
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    # Realiza o cadastro
    id = mongo.db.admindata.insert({ 
      "email": email,
      "name": name,
      "type_user": "admin",
      "status": 1,
      "password": hashed,
    })

    # Retorna a lista de dados 
    response = jsonify({
      '_id': str(id),
      "created_at": created_at,
      "type_user": "admin",
      "password": hashed,
      "email": email,
      "name": name,
      "status": 1,
    })
    session['localIdAdmin'] = str(id)
    print(session['localIdAdmin'])

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
  response = jsonify({'message': 'Admin with code ' + id + ' was successfully deleted'})
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
  created_at = date.strftime('%d/%m/%Y %H:%M') 
  password = request.json['password']
  name = request.json['name'] 
  email = request.json['email']

  # Listar dados do responsável médico
  email_found = medical_data.find_one({"email": email})
  medical_data = mongo.db.medical

  # Se o e-mail já existe
  if email_found:
    response = jsonify({'message': 'Existing Email'})
    response.status_code = 200
    return response

  elif password and name and email: # Do contrário
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    # Realiza o cadastro
    id = mongo.db.medical.insert({ 
      "status": 1,
      "name": name,
      "email": email,
      "password": hashed,
      "type_user": "medical",
    })

    # Retorna a lista de dados 
    response = jsonify({
      '_id': str(id),
      "status": 1,
      "name": name,
      "email": email,
      "password": hashed,
      "type_user": "medical",
      "created_at": created_at,
    })

    # Retorna status positivo
    response.status_code = 201
    return response

  else: # Do contrário será retornado tela de erro 
    return not_found()