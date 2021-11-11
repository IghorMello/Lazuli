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
  user_id = request.form['javascript_data']
  session['user_id']=user_id
  return redirect(url_for('admin_dashboard'))


@app.route('/getmethod', methods=['GET', 'POST'])
def get_javascript_data():
  print('\n\n\nCheguei')
  current_user = []
  current = request.form['javascript_data']
  print('\n\n\ncurrent', current)

  objeto = json.loads(current)
  print('\n\n', objeto)
  result={}
  result['localid'] = objeto['_id']['$oid']
  result['email'] = objeto['email']
  result['nome'] = objeto['nome']
  result['crm'] = objeto['crm']
  print(result)
  session['current_user']=result
  return "deu certo"

# Página de login do responsável médico

@app.route('/admin', methods=['GET', 'POST'])
def admin_login():
  return render_template('admin/login.html')

# Página de cadastro do responsável médico

@app.route('/admin/register', methods=['GET', 'POST'])
def admin_register():
  return render_template('admin/register.html')

# Página de dashboard do responsável médico

@app.route('/admin/dashboard', methods=['GET', 'POST'])
@login_required
def admin_dashboard():
  print(session['user_id'])
  current=session['current_user']
  current_user=current['email']
  return render_template('admin/dashboard.html', current_user=current_user)

# Página do perfil do responsável médico

@app.route('/admin/dashboard/settings', methods=['GET', 'POST'])
@login_required
def admin_dashboard_profile():
  current=session['current_user']
  current_user=current['email']
  return render_template('admin/profile.html', current_user=current_user, all_data=current)

# Página de cadastro do responsável médico

@app.route('/admin/register-employee', methods=['GET', 'POST'])
@login_required
def admin_register_employee():
  return render_template('admin/register-employee.html')

# Página de consulta do responsável médico

@app.route('/admin/consult-employee', methods=['GET', 'POST'])
@login_required
def admin_consult_employee():
  return render_template('admin/consult-employee.html')

# Página para visualizar mais sobre os funcionários do responsável médico

@app.route('/admin/consult/<id>', methods=['GET', 'POST'])
@login_required
def admin_consult_id_employee(id):
  all_data=session['current_user']
  return render_template('admin/consult.html',all_data=all_data)

# Página para editar os funcionários do responsável médico

@app.route('/admin/edit/<id>', methods=['GET', 'POST'])
@login_required
def admin_consult_edit_employee(id):
  all_data=session['current_user']
  return render_template('admin/edit.html', all_data=all_data)

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

@app.route('/logout')
def sign_out():
    session.pop('user_id')
    flash("Logout realizado com sucesso!", 'success')
    return redirect(url_for('admin_login'))

if __name__ == "__main__":
  app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))