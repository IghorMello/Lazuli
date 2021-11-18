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

#------------------------------------------------------------------------#
# Página inicial
#------------------------------------------------------------------------#

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

#------------------------------------------------------------------------#
# Obter dados especifícos
#------------------------------------------------------------------------#

@app.route('/postmethod-medical', methods=['GET', 'POST'])
def post_javascript_data_medical():
  current = request.form['javascript_data']
  objeto = json.loads(current)
  session['user_id']=objeto['localId']
  result={}
  result['localid'] = objeto['localId']
  result['email'] = objeto['email']
  result['crm'] = objeto['crm']
  result['type_user']= objeto['type_user']
  session['current_user']=result
  current_user = session['current_user']
  return "settings"

@app.route('/postmethod-admin', methods=['GET', 'POST'])
def post_javascript_data_admin():
  current = request.form['javascript_data']
  objeto = json.loads(current)
  session['user_id']=objeto['localId']
  result={}
  result['localid'] = objeto['localId']
  result['email'] = objeto['email']
  result['type_user']= objeto['type_user']
  session['current_user']=result
  current_user = session['current_user']
  return "settings"

#------------------------------------------------------------------------#
# Página de login
#------------------------------------------------------------------------#

@app.route('/login', methods=['GET', 'POST'])
def login():
  return render_template('pages/login-medical.html')

#------------------------------------------------------------------------#
# Página de login do administrador
#------------------------------------------------------------------------#

@app.route('/admin', methods=['GET', 'POST'])
def login_admin():
  return render_template('pages/login-admin.html')

#------------------------------------------------------------------------#
#---------------- Página do Administrador
#------------------------------------------------------------------------#

#------------------------------------------------------------------------#
# Admin - Consultar responsável médico
#------------------------------------------------------------------------#

@app.route('/admin/consult-medical', methods=['GET', 'POST'])
@login_required
def admin_consult_medical():
  current_user=session['current_user']
  type_user=current_user['type_user']
  if type_user != 'admin':
    return redirect(url_for('login'))
  else:
    email_current_user=current_user['email']
    return render_template('admin/consult-medical.html', current=email_current_user)

#------------------------------------------------------------------------#
# Admin - Consultar profissional de TI
#------------------------------------------------------------------------#

@app.route('/admin/consult-employee', methods=['GET', 'POST'])
@login_required
def admin_consult_employee():
  current_user=session['current_user']
  type_user=current_user['type_user']
  if type_user != 'admin':
    return redirect(url_for('login'))
  else:
    email_current_user=current_user['email']
    return render_template('admin/consult-employee.html', current=email_current_user)

#------------------------------------------------------------------------#
# Página de cadastro do responsável médico
#------------------------------------------------------------------------#

@app.route('/admin/register-medical', methods=['GET', 'POST'])
def admin_register():
  current_user=session['current_user']
  type_user=current_user['type_user']
  if type_user != 'admin':
    return redirect(url_for('login'))
  else:
    email_current_user=current_user['email']
    return render_template('admin/register-medical.html', current=email_current_user)

#------------------------------------------------------------------------
# Responsável médico - Cadastrar funcionário
#------------------------------------------------------------------------

@app.route('/admin/register-employee', methods=['GET', 'POST'])
@login_required
def admin_register_employee():
  current=session['current_user']
  type_user=current_user['type_user']
  if type_user != 'responsavel_medico':
    return redirect(url_for('login'))
  else:
    current_user=current['email']
    return render_template('medical/register-employee.html',  current=current_user, all_data=current)

#------------------------------------------------------------------------
#---------------- Página do responsável médico
#------------------------------------------------------------------------

#------------------------------------------------------------------------
# Responsável médico - Editar Perfil
#------------------------------------------------------------------------

@app.route('/medical/settings', methods=['GET', 'POST'])
@login_required
def medical_dashboard_profile():
  current=session['current_user']
  type_user=current_user['type_user']
  if type_user != 'responsavel_medico':
    return redirect(url_for('login'))
  else:
    current_user=current['email']
    return render_template('medical/profile.html', current=current_user, all_data=current)

#------------------------------------------------------------------------
# Responsável médico - Cadastrar funcionário
#------------------------------------------------------------------------

@app.route('/medical/register-employee', methods=['GET', 'POST'])
@login_required
def medical_register_employee():
  current=session['current_user']
  type_user=current_user['type_user']
  if type_user != 'responsavel_medico':
    return redirect(url_for('login'))
  else:
    current_user=current['email']
    return render_template('medical/register-employee.html',  current=current_user, all_data=current)

#------------------------------------------------------------------------
# Responsável Médico - Consultar funcionário
#------------------------------------------------------------------------

@app.route('/medical/consult-employee', methods=['GET', 'POST'])
@login_required
def medical_consult_employee():
    current=session['current_user']
    type_user=current['type_user']
    if type_user != 'responsavel_medico':
      return redirect(url_for('login'))
    else:
      current_user=current['email']
      return render_template('medical/consult-employee.html', current=current_user)

#------------------------------------------------------------------------
# Erro 404
#------------------------------------------------------------------------

@app.errorhandler(404)
def not_found_error(error):
    return render_template('errors/page-404.html'), 404

#------------------------------------------------------------------------
# Erro 403
#------------------------------------------------------------------------

@app.errorhandler(403)
def not_found_error(error):
    return render_template('errors/page-403.html'), 403 

#------------------------------------------------------------------------
# Erro 500
#------------------------------------------------------------------------

@app.errorhandler(500)
def not_found_error(error):
    return render_template('errors/page-500.html'), 500 

#------------------------------------------------------------------------
# Enviar email
#------------------------------------------------------------------------

def send_email(result, charset='utf-8'):
    msg = Message("{} - Dúvida na plataforma!".format(result['email']), sender = 'lazuli@mailtrap.io', recipients = ['lazuli@mailtrap.io'])
    Mensagem = "Nome: {}<br>E-mail: {}<br>Mensagem: {}<br>Assunto: {}".format(result['name'], result['email'], result['message'], result['subject'])
    msg.html = Mensagem.encode('ascii', 'xmlcharrefreplace')
    mail.send(msg)

#------------------------------------------------------------------------
# Logout
#------------------------------------------------------------------------

@app.route('/logout')
def sign_out():
    session.pop('user_id')
    flash("Logout realizado com sucesso!", 'success')
    return redirect(url_for('login'))

if __name__ == "__main__":
  app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))