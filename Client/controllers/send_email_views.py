# Testando

import os
import json
import string
import pathlib
import functools
from flask import Flask, flash, redirect, request, session, render_template, jsonify, url_for, abort, Blueprint
from datetime import timedelta
from decouple import config
from flask_mail import Mail, Message

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

#------------------------------------------------------------------------
# Enviar email
#------------------------------------------------------------------------

def send_email(result, charset='utf-8'):
    msg = Message("{} - Dúvida na plataforma!".format(result['email']), sender = 'lazuli@mailtrap.io', recipients = ['lazuli@mailtrap.io'])
    Mensagem = "Nome: {}<br>E-mail: {}<br>Mensagem: {}<br>Assunto: {}".format(result['name'], result['email'], result['message'], result['subject'])
    msg.html = Mensagem.encode('ascii', 'xmlcharrefreplace')
    flash("E-mail enviado com sucesso", "success")
    mail.send(msg)