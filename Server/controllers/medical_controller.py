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

medical_views = Blueprint('medical', __name__)

medical = Flask(__name__)

medical.config['MONGO_URI'] = config('MONGO_URI')
mongo = PyMongo(medical)

#---------------------------------------
# Atualizar responsável médico
#---------------------------------------

@medical_views.route('/medical/<_id>', methods=['PUT'])
def update_medical(_id):
  crm = request.json['crm']
  nome = request.json['nome'] 
  email = request.json['email']

  # Se o CRM, Nome, email já estiverem cadastrados
  if crm and nome and email and _id:
    mongo.db.medical.update_one(
      { '_id': ObjectId(_id['$oid']) if '$oid' in _id else ObjectId(_id) }, 
      { '$set': { 
        "crm": crm, 
        "nome": nome,
        'email': email
      }}
    )
    response = jsonify({'message': 'Responsável médico ' + nome + ", com código " + _id + ' foi atualizado com sucesso'})
    response.status_code = 200
    return response 
  else: 
    return not_found()

#---------------------------------------
# Fazer login do responsável médico
#---------------------------------------

@medical_views.route('/medical', methods=['POST'])
def login_medical():
  medical = mongo.db.medical
  data_search = mongo.db.medical.find()

  # Obter data atual
  date = datetime.now()
  time = date.strftime('%H:%M')
  data = date.strftime('%d/%m/%Y') 
  
  # Obter dados
  email = request.json['email']
  crm = request.json['crm']
  email_found = medical.find_one({"email": email})
  crm_found = medical.find_one({"crm": crm})
  
  # Se o email e o CRM estiverem cadastrados
  if email_found and crm_found:
    for data_verify in data_search:
      if crm == data_verify['crm']:
        new_data = data_verify
    
    # Obtendo o id da seção
    clean_objId = new_data['_id']

    # Obtendo seção atual
    session['userId'] = str(clean_objId)
    
    result = {}
    result['email'] = request.json['email']
    result['localId'] = session['userId']
    result['crm'] = request.json['crm']
    result['data'] = data
    result['type_user'] = "responsavel_medico"
    result['time'] = time
  response = json_util.dumps(result)
  return Response(response, mimetype='application/json')

#---------------------------------------
# Cadastrar funcionário
#---------------------------------------

@medical_views.route('/medical/register-employee', methods=['POST'])
def register_medical_file():
  status = 1
  date = datetime.now()
  nome = request.json['nome'] 
  sexo = request.json['sexo']
  email = request.json['email']
  responsavel = session['userId']
  horario = request.json['horario']
  endereco = request.json['endereco']
  telefone = request.json['telefone']
  deficiencia = request.json['deficiencia']
  tipo_sanguineo = request.json['tipo_sanguineo']
  data_nascimento = request.json['data_nascimento']
  disturbio_detectado =  request.json['disturbio_detectado']
  acompanhamento_medico = request.json['acompanhamento_medico']
  uso_medicacao_controlada = request.json['uso_medicacao_controlada']
  
  # Criando o código do usuário
  letters = string.ascii_lowercase
  createdAt = date.strftime('%d/%m/%Y %H:%M') 
  codigo_usuario = ''.join(random.choice(letters) for i in range(10))

  # Listando os dados do funcionário
  employees_data = mongo.db.employees
  email_found = employees_data.find_one({"email": email})

  # Se o e-mail já é existente
  if email_found:
    response = jsonify({'message': 'Email já existente'})
    response.status_code = 200
    return response

  elif nome and sexo and email and data_nascimento and endereco and telefone and tipo_sanguineo and deficiencia and horario and disturbio_detectado and acompanhamento_medico and uso_medicacao_controlada and codigo_usuario:
    id = mongo.db.employees.insert({ 
      "nome": nome,
      "sexo": sexo, 
      "email": email,
      "status": status,
      "horario": horario,
      "telefone": telefone,
      "endereco": endereco,
      "createdAt": createdAt,
      'responsavel':responsavel,
      "type_user": "funcionario",
      "deficiencia": deficiencia,
      "codigo_usuario": codigo_usuario,
      "tipo_sanguineo": tipo_sanguineo,
      "data_nascimento": data_nascimento,
      "disturbio_detectado": disturbio_detectado,
      "acompanhamento_medico": acompanhamento_medico,
      "uso_medicacao_controlada": uso_medicacao_controlada,
    })
    response = jsonify({
      '_id': str(id),
      "nome": nome,
      "sexo": sexo, 
      "email": email,
      "status": status,
      "horario": horario,
      "telefone": telefone,
      "endereco": endereco,
      "createdAt": createdAt,
      'responsavel':responsavel,
      "type_user": "funcionario",
      "deficiencia": deficiencia,
      "codigo_usuario": codigo_usuario,
      "tipo_sanguineo": tipo_sanguineo,
      "data_nascimento": data_nascimento,
      "disturbio_detectado": disturbio_detectado,
      "acompanhamento_medico": acompanhamento_medico,
      "uso_medicacao_controlada": uso_medicacao_controlada,
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