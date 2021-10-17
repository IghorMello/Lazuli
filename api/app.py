import random
import string
import json
import os

from datetime import date, datetime
from bson import ObjectId
from flask import Flask, flash, jsonify, request, Response, session
from flask_pymongo import PyMongo
from bson import json_util
from bson.objectid import ObjectId
from decouple import config
from werkzeug.security import generate_password_hash, check_password_hash
from flask_mail import Mail, Message
from flask_cors import CORS

app = Flask(__name__)

# Chave da aplicação Flask

app.secret_key = config('SECRET_KEY')

# Habilitando o CORS
CORS(app)

# Configurações do Mongo

app.config['MONGO_URI'] = config('MONGO_URI')

# Configurações do servidor de email

app.config['MAIL_SERVER']='smtp.mailtrap.io'
app.config['MAIL_PORT'] = 2525
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = config('SMTP_USERNAME')
app.config['MAIL_PASSWORD'] = config('SMTP_PASSWORD')
app.config['MAIL_ASCII_ATTACHMENTS'] = True

# Iniciando o banco de dados do mongo

mongo = PyMongo(app)

# Iniciando o servidor de email

mail = Mail(app)

#-----------------------------
# Cadastrar responsável médico
#-----------------------------

@app.route('/register-medical', methods=['POST'])
def register_medical():
  status = 1
  date = datetime.now()
  crm = request.json['crm']
  nome = request.json['nome'] 
  email = request.json['email']

  letters = string.ascii_lowercase
  createdAt = date.strftime('%d/%m/%Y %H:%M') 
  codigo_usuario = ''.join(random.choice(letters) for i in range(10))

  medical_data = mongo.db.medical
  email_found = medical_data.find_one({"email": email})

  if email_found:
    response = jsonify({'message': 'Email já existente'})
    response.status_code = 200
    return response

  elif crm and nome and email and codigo_usuario:
    id = mongo.db.medical.insert({ 
      "email": email,
      "nome": nome,
      "status": 1,
      "crm": crm,
    })
    
    response = jsonify({
      '_id': str(id),
      "crm": crm,
      "status": 1,
      "nome": nome,
      "email": email,
      "createdAt": createdAt,
    })

    response.status_code = 201
    # response.headers.add('Access-Control-Allow-Origin', '*')
    return response

  else:
    return not_found()

#----------------------
# Cadastrar funcionário
#----------------------

@app.route('/register-medical-file', methods=['POST'])
def register_medical_file():
  status = 1
  date = datetime.now()
  nome = request.json['nome'] 
  sexo = request.json['sexo']
  email = request.json['email']
  horario = request.json['horario']
  endereco = request.json['endereco']
  telefone = request.json['telefone']
  deficiencia = request.json['deficiencia']
  tipo_sanguineo = request.json['tipo_sanguineo']
  data_nascimento = request.json['data_nascimento']
  disturbio_detectado =  request.json['disturbio_detectado']
  acompanhamento_medico = request.json['acompanhamento_medico']
  uso_medicacao_controlada = request.json['uso_medicacao_controlada']

  letters = string.ascii_lowercase
  createdAt = date.strftime('%d/%m/%Y %H:%M') 
  codigo_usuario = ''.join(random.choice(letters) for i in range(10))

  employees_data = mongo.db.employees
  email_found = employees_data.find_one({"email": email})

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
      "endereco": endereco,
      "telefone": telefone,
      "createdAt": createdAt,
      "deficiencia": deficiencia,
      "codigo_usuario": codigo_usuario,
      "tipo_sanguineo": tipo_sanguineo,
      "data_nascimento": data_nascimento,
      "disturbio_detectado": disturbio_detectado,
      "acompanhamento_medico": acompanhamento_medico,
      "uso_medicacao_controlada": uso_medicacao_controlada,
    })

    response.status_code = 201
    # response.headers.add('Access-Control-Allow-Origin', '*')
    return jsonify(response)

  else:
    return not_found()

#---------------------------
# Fazer login do funcionário
#---------------------------

@app.route('/', methods=['POST'])
def login():
  employees = mongo.db.employees
  data_search = mongo.db.employees.find()

  date = datetime.now()
  time = date.strftime('%H:%M')
  data = date.strftime('%d/%m/%Y') 

  codigo_usuario = request.json['codigo_usuario']
  code_found = employees.find_one({"codigo_usuario": codigo_usuario})

  if code_found:
    result = {}

    for data_verify in data_search:
      if codigo_usuario == data_verify['codigo_usuario']:
        new_data = data_verify
    
    clean_objId = new_data['_id']
    local_id = str(clean_objId)

    # Obtendo seção atual
    session['userId']=local_id
    print('\nSessão atual', session['userId'])

    # Dados a serem enviados por email
    result['codigo_usuario']=codigo_usuario
    result['email']=new_data['email']
    result['nome']=new_data['nome']
    result['id']=local_id
    result['time']=time
    result['data']=data

    print('Dados para serem enviados por email', result)
    send_email_employees(result)
  
    response = json_util.dumps(result)
    # response.headers.add('Access-Control-Allow-Origin', '*')
    return Response(response, mimetype='application/json')

#----------------------------------
# Fazer login do responsável médico
#----------------------------------

@app.route('/admin', methods=['POST'])
def login_admin():
  medical = mongo.db.medical
  data_search = mongo.db.medical.find()

  date = datetime.now()
  time = date.strftime('%H:%M')
  data = date.strftime('%d/%m/%Y') 

  email = request.json['email']
  crm = request.json['crm']
  email_found = medical.find_one({"email": email})
  crm_found = medical.find_one({"crm": crm})

  if email_found and crm_found:
    for data_verify in data_search:
      if crm == data_verify['crm']:
        new_data = data_verify

    clean_objId = new_data['_id']
    local_id = str(clean_objId)

    # Obtendo seção atual
    session['userId']=local_id
    print('\nSessão atual', session['userId'])

    result = {}
    result['email'] = request.json['email']
    result['localId'] = session['userId']
    result['crm'] = request.json['crm']
    result['data'] = data
    result['time'] = time

  response = json_util.dumps(result)
  # response.headers.add('Access-Control-Allow-Origin', '*')
  return Response(response, mimetype='application/json')

#--------------------------
# Listar responsável médico
#--------------------------

@app.route('/medical', methods=['GET'])
def get_all_medical():
  medical = mongo.db.medical.find()
  response = json_util.dumps(medical)
  # response.headers.add('Access-Control-Allow-Origin', '*')
  return Response(response, mimetype='application/json')

#---------------
# Listar usuário
#---------------

@app.route('/employees',methods=['GET'])
def get_all_employees():
  employees = mongo.db.employees.find()
  response = json_util.dumps(employees)
  # response.headers.add('Access-Control-Allow-Origin', '*')
  return Response(response, mimetype='application/json')

# Listar usuário específico

@app.route('/employees/<id>', methods=['GET'])
def get_employees(id):
  user = mongo.db.employees.find_one({'_id': ObjectId(id), })
  print(id)
  response = json_util.dumps(user)
  # response.headers.add('Access-Control-Allow-Origin', '*')
  return Response(response, mimetype="application/json")

# Deletar usuário

@app.route('/employees/<id>', methods=['DELETE'])
def delete_employees(id):
  mongo.db.employees.delete_one({'_id': ObjectId(id)})
  response = jsonify({'message': 'User' + id + ' Deletado com sucesso'})
  response.status_code = 200
  # response.headers.add('Access-Control-Allow-Origin', '*')
  return response

# Atualizar usuário

@app.route('/employees/<_id>', methods=['PUT'])
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
 
    response = jsonify({'message': 'Funcionário ' + nome + ", com código " + _id + ' foi atualizado com sucesso'})
    response.status_code = 200
    # response.headers.add('Access-Control-Allow-Origin', '*')
    return response 

  else: 
    return not_found()

# Enviar email

def send_email_employees(result, charset='utf-8'):
    print('chegou')
    msg = Message("Programador com ID {} habilitou a extensão as {}!".format(result['email'], result['time']), sender = 'lazuli@mailtrap.io', recipients = ['lazuli@mailtrap.io'])
    Mensagem = "Boa tarde.<br>O programador com email '{}' habilitou a extensão as {}, do dia {}".format(result['email'], result['time'], result['data'])
    msg.html = Mensagem.encode('ascii', 'xmlcharrefreplace')
    print('\n\n\nSaiu')
    mail.send(msg)

# Tela de erro

@app.errorhandler(404)
def not_found(error=None):
    message = {
        'message': 'Resource Not Found ' + request.url,
        'status': 404
    }
    response = jsonify(message)
    response.status_code = 404
    # response.headers.add('Access-Control-Allow-Origin', '*')
    return response

if __name__ == "__main__":
  app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))