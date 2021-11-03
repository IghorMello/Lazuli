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

app = Flask(__name__)

# Chave da aplicação Flask

app.secret_key = config('SECRET_KEY')

# Configurações do servidor de email

app.config['MAIL_SERVER']='smtp.mailtrap.io'
app.config['MAIL_PORT'] = 2525
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = config('SMTP_USERNAME')
app.config['MAIL_PASSWORD'] = config('SMTP_PASSWORD')
app.config['MAIL_ASCII_ATTACHMENTS'] = True

# Iniciando o servidor de email

mail = Mail(app)

#------------------------------------------------------------------------#
# Impedir acesso sem login
#------------------------------------------------------------------------#

def login_required(view):
    @functools.wraps(view)
    def wrauth_plataformaed_view(**kwargs):
        if not 'user_id' in session.keys():
            flash(f'Necessário realizar login para prosseguir!', 'info')
            return redirect('/')
        return view(**kwargs)
        flash('Erro ao realizar login', 'warning')
    return wrauth_plataformaed_view

# Página inicial

@app.route('/', methods=['GET', 'POST'])
def index():
  if request.method == 'POST':
    list_send_email = {}
    list_send_email['name'] = request.form['name']
    list_send_email['email'] = request.form['email'].replace(' ','').lower()
    list_send_email['subject'] = request.form['subject']
    list_send_email['message'] = request.form['message']
    send_email(list_send_email)
  return render_template('pages/index.html')

# Página de login do responsável médico

@app.route('/postmethod', methods=['GET', 'POST'])
def get_post_javascript_data():
  print('\n\n\nChegou')
  user_id = request.form['javascript_data']
  print('\n\n\nuser_id', user_id)
  session['user_id']=user_id
  print('\n\n\nDados', session['user_id'])
  return "deu certo"

@app.route('/resp', methods=['GET', 'POST'])
def resp_login():
  return render_template('home/login.html')

# Página de cadastro do responsável médico

@app.route('/resp/register', methods=['GET', 'POST'])
def resp_register():
  return render_template('home/register.html')

# Página de dashboard do responsável médico

@app.route('/resp/dashboard', methods=['GET', 'POST'])
# @login_required
def resp_dashboard():
  print(session['user_id'])
  return render_template('home/dashboard.html', current_user=session['user_id'])

# Página de cadastro do responsável médico

@app.route('/resp/register-employee', methods=['GET', 'POST'])
# @login_required
def resp_register_employee():
  return render_template('home/register-employee.html', current_user=session['user_id'])

# Página de admin

@app.route('/admin', methods=['GET', 'POST'])
def admin():
  return render_template('admin/login.html')

# Página de dashboard do admin

@app.route('/admin/dashboard', methods=['GET', 'POST'])
# @login_required
def admin_dashboard():
  return render_template('admin/dashboard.html')

# Página de consultas do admin

@app.route('/admin/consult/medical', methods=['GET', 'POST'])
# @login_required
def admin_consult_medical():
  return render_template('admin/consult-medical.html')

# Página de consultas do admin

@app.route('/admin/consult/employee', methods=['GET', 'POST'])
# @login_required
def admin_consult_employee():
  return render_template('admin/consult-employee.html')

# Enviar email

def send_email(result, charset='utf-8'):
    msg = Message("Extensão - Dúvida de {}!".format(result['email']), sender = 'lazuli@mailtrap.io', recipients = ['lazuli@mailtrap.io'])
    Mensagem = "Dúvida<br>Enviada por '{}'<br> Email: {}<br>Dúvida: {}<br>Mensagem: {}".format(result['nome'], result['email'], result['subject'], result['message'])
    msg.html = Mensagem.encode('ascii', 'xmlcharrefreplace')
    print('\n\n\nSaiu')
    mail.send(msg)

# Erro 404

@app.errorhandler(404)
def not_found_error(error):
    return render_template('errors/page-404.html'), 404

# Erro 403

@app.errorhandler(403)
def not_found_error(error):
    return render_template('errors/page-403.html'), 403 

# Erro 500

@app.errorhandler(500)
def not_found_error(error):
    return render_template('errors/page-500.html'), 500 

# Logout

@app.route('/sign_out')
def sign_out():
    session.pop('user_id')
    return redirect(url_for('resp_login'))

if __name__ == "__main__":
  app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))