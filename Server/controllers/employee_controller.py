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
  employees = mongo.db.employees
  data_search = mongo.db.employees.find()

  # Obter data atual
  date = datetime.now()
  time = date.strftime('%H:%M')
  data = date.strftime('%d/%m/%Y') 

  # Verificar código de usuário
  codigo_usuario = request.json['codigo_usuario']
  code_found = employees.find_one({"codigo_usuario": codigo_usuario})

  # Se o código for existente
  if code_found:
    result = {}
    for data_verify in data_search:
      if codigo_usuario == data_verify['codigo_usuario']:
        new_data = data_verify

    # Obtendo seção atual
    clean_objId = new_data['_id']
    session['userId'] = str(clean_objId)

    # Dados a serem enviados por email
    result['codigo_usuario']=codigo_usuario
    result['email']=new_data['email']
    result['nome']=new_data['nome']
    result['type_user'] = "admin"
    result['id']=local_id
    result['time']=time
    result['data']=data
    print('Dados para serem enviados por email', result)

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
  nome = request.json['nome'] 
  sexo = request.json['sexo']
  email = request.json['email']
  horario = request.json['horario']
  endereco = request.json['endereco']
  telefone = request.json['telefone']
  deficiencia = request.json['deficiencia']
  tipo_sanguineo = request.json['tipo_sanguineo']
  data_nascimento = request.json['data_nascimento']
  disturbio_detectado = request.json['disturbio_detectado']
  acompanhamento_medico = request.json['acompanhamento_medico']
  uso_medicacao_controlada = request.json['uso_medicacao_controlada']

  # Se os dados estiverem existentes
  if nome and sexo and disturbio_detectado and data_nascimento and email and endereco and telefone and tipo_sanguineo and deficiencia and horario and acompanhamento_medico and uso_medicacao_controlada and _id:
    mongo.db.employees.update_one(
      { '_id': ObjectId(_id['$oid']) if '$oid' in _id else ObjectId(_id) }, 
      { '$set': { 
        "sexo": sexo, 
        "nome": nome,
        'email': email, 
        "horario": horario,
        "telefone": telefone,
        "endereco": endereco,
        "deficiencia": deficiencia,
        "tipo_sanguineo": tipo_sanguineo,
        "data_nascimento": data_nascimento,
        "disturbio_detectado": disturbio_detectado,
        "acompanhamento_medico": acompanhamento_medico,
        "uso_medicacao_controlada": uso_medicacao_controlada,
      }}
    )

    #  Retorna resposta
    response = jsonify({'message': 'Funcionário ' + nome + ", com código " + _id + ' foi atualizado com sucesso'})
    response.status_code = 200
    return response 

  else: # Do contrário, habilita tela de erro 
    return not_found()