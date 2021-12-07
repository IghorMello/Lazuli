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
from flask_mail import Mail, Message
from flask import Flask, flash, jsonify, request, Response, session, Blueprint, render_template
from flask_pymongo import PyMongo

send_email_views = Blueprint('send_email', __name__)

send_email = Flask(__name__)

# Configurações do servidor de email

send_email.config['MAIL_SERVER']='smtp.mailtrap.io'
send_email.config['MAIL_PORT'] = 2525
send_email.config['MAIL_USE_TLS'] = True
send_email.config['MAIL_USE_SSL'] = False
send_email.config['MAIL_USERNAME'] = config('SMTP_USERNAME')
send_email.config['MAIL_PASSWORD'] = config('SMTP_PASSWORD')
send_email.config['MAIL_ASCII_ATTACHMENTS'] = True

# Iniciando o servidor de email

mail = Mail(send_email)

# MongoDB

send_email.config['MONGO_URI'] = config('MONGO_URI')
mongo = PyMongo(send_email)

#---------------------------------------
# Enviar email
#---------------------------------------

def send_email_employees(result, charset='utf-8'):
    msg = Message("Programador {} habilitou a extensão as {}!".format(result['email'], result['time']), sender = 'lazuli@mailtrap.io', recipients = ['lazuli@mailtrap.io'])
    Mensagem = "Boa tarde.<br>O programador com email '{}' habilitou a extensão as {}, do dia {}".format(result['email'], result['time'], result['data'])
    msg.html = Mensagem.encode('ascii', 'xmlcharrefreplace')
    mail.send(msg)

#---------------------------------------
# Enviar email quando desinstalar
#---------------------------------------

@send_email_views.route('/send-email-forced-finish', methods=['GET'])
def send_email_forced_finish(charset='utf-8'):
    # Buscando dados do usuário
    employees = mongo.db.employees
    user = mongo.db.employees.find_one({'_id': ObjectId(session['userId'])})
    response = json_util.dumps(user)
    dados = json.loads(response)

    # Enviando email
    msg = Message("Programador {} desabilitou a extensão!".format(dados[0]['email']), sender = 'lazuli@mailtrap.io', recipients = ['lazuli@mailtrap.io'])
    Mensagem = "Boa tarde.<br>O programador {} desabilitou a extensão {}".format(dados[0]['email'], datetime.today())
    msg.html = Mensagem.encode('ascii', 'xmlcharrefreplace')