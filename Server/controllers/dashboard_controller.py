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
from models.error import not_found

dashboard_views = Blueprint('dashboard', __name__)

dashboard = Flask(__name__)

dashboard.config['MONGO_URI'] = config('MONGO_URI')
mongo = PyMongo(dashboard)

#---------------------------------------
# Dashboard do administrador
#---------------------------------------

@dashboard_views.route('/dashboard', methods=['POST', 'GET'])
def dashboard_medical():
  responsible_medical_data = []
  response = ""

  # Obter dados do ID do responsável médico atual
  medical_user_id = mongo.db.medical.find_one({'_id': ObjectId(session['userId'])})
  response_medical = json_util.dumps(medical_user_id)
  data_medical = json.loads(response_medical)
  responsible_medical_id = data_medical['_id']['$oid']
  print('\n\nID obtido\n', responsible_medical_id)

  # Obter dados do ID dos responsáveis médicos que cadastraram
  # os profissionais de TI
  user_employee = mongo.db.employees.find()
  response_employee = json_util.dumps(user_employee)
  
  # Verifica todos os profissionais de TI
  # cadastrados
  for i in response_employee:
    data_employee = json.loads(response_employee)
    responsible_medical = data_employee[0]['responsible']
    print('\n\nId do responsável médico obtido', responsible_medical)

    # Verificar se o id do responsável médico atual
    # e se o id do responsável médico que cadastrou o profissional
    # de TI forem iguais
    if responsible_medical == responsible_medical_id: 
      user_id = mongo.db.employee.find_one({'_id': ObjectId(responsible_medical)})
      response = json_util.dumps(employee)
      responsible_medical_data.append(response)
      print('\nTodos os dados obtidos', responsible_medical_data)
      return Response(responsible_medical_data, mimetype='application/json')

    else: # Do contrário será retornado tela de erro 
      return response
  return not_found()