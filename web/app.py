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

@app.route('/postmethod', methods=['GET', 'POST'])
def post_javascript_data():
  current = request.form['javascript_data']
  objeto = json.loads(current)
  session['user_id']=objeto['localId']
  result={}
  result['localid'] = objeto['localId']
  result['email'] = objeto['email']
  result['crm'] = objeto['crm']
  session['current_user']=result
  current_user = session['current_user']
  return "deu certo"

# Página de login do administrador

@app.route('/admin', methods=['GET', 'POST'])
def admin_login():
  return render_template('admin/login.html')

# Página de login do responsável médico

@app.route('/medical', methods=['GET', 'POST'])
def medical_login():
  return render_template('medical/login.html')

# Página de cadastro do responsável médico

@app.route('/admin/register-medical', methods=['GET', 'POST'])
def admin_register():
  return render_template('admin/register-medical.html')

# Página inicial do administrador

@app.route('/admin/consult', methods=['GET', 'POST'])
@login_required
def admin_consult_medical():
  current_user=session['current_user']
  email_current_user=current_user['email']
  return render_template('admin/consult.html', current_user=email_current_user)

# Página do perfil do responsável médico

@app.route('/medical/dashboard/settings', methods=['GET', 'POST'])
@login_required
def medical_dashboard_profile():
  current=session['current_user']
  current_user=current['email']
  return render_template('medical/profile.html', current=current_user, all_data=current)

# Página de cadastro do responsável médico

@app.route('/medical/register-employee', methods=['GET', 'POST'])
@login_required
def medical_register_employee():
  current=session['current_user']
  current_user=current['email']
  return render_template('medical/register-employee.html',  current=current_user, all_data=current)

# Página de consulta do responsável médico

@app.route('/medical/consult-employee', methods=['GET', 'POST'])
@login_required
def medical_consult_employee():
  current=session['current_user']
  current_user=current['email']
  return render_template('medical/consult-employee.html', current=current_user)

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

# Enviar email

def send_email(result, charset='utf-8'):
    msg = Message("{} - Dúvida na plataforma!".format(result['email']), sender = 'lazuli@mailtrap.io', recipients = ['lazuli@mailtrap.io'])
    Mensagem = "Nome: {}<br>E-mail: {}<br>Mensagem: {}<br>Assunto: {}".format(result['name'], result['email'], result['message'], result['subject'])
    msg.html = Mensagem.encode('ascii', 'xmlcharrefreplace')
    mail.send(msg)

# Logout

@app.route('/logout')
def sign_out():
    session.pop('user_id')
    flash("Logout realizado com sucesso!", 'success')
    return redirect(url_for('admin_login'))

if __name__ == "__main__":
  app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))