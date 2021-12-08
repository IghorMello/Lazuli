import os
import json
import string
import pathlib
import functools

from flask import Flask, flash, redirect, request, session, render_template, jsonify, url_for, abort, Blueprint
from datetime import timedelta
from decouple import config

base_views = Blueprint('base', __name__)

#------------------------------------------------------------------------#
# Página inicial
#------------------------------------------------------------------------#

@base_views.route('/', methods=['GET', 'POST'])
def index():
  if request.method == 'POST':
    list_send_email = {}
    list_send_email['name'] = request.form['name']
    list_send_email['email'] = request.form['email'].replace(' ','').lower()
    list_send_email['subject'] = request.form['subject']
    list_send_email['message'] = request.form['message']
    flash("E-mail enviado com sucesso", "success")
    send_email(list_send_email)
  return render_template('pages/index.html')

#------------------------------------------------------------------------#
# Logout
#------------------------------------------------------------------------#

@base_views.route('/logout')
def sign_out():
    flash("Logout realizado com sucesso!", 'success')
    session.pop('user_id')
    return redirect(url_for('auth.login'))

#------------------------------------------------------------------------#
# Obter dados especifícos
#------------------------------------------------------------------------#

@base_views.route('/postmethod-medical', methods=['GET', 'POST'])
def post_javascript_data_medical():
  object_json_return = request.form.get('javascript_data')
  print('\n\nObter dados completos\n\n\n', object_json_return)
  data_medical = json.loads(object_json_return)
  print(data_medical['email'])
  session['user_id']=data_medical['localId']
  result={}
  result['localid'] = data_medical['localId']
  result['email'] = data_medical['email']
  result['type_user']= data_medical['type_user']
  session['current_user']=result
  current_user = session['current_user']
  return redirect(url_for('medical.medical_consult_employee'))

@base_views.route('/postmethod-admin', methods=['GET', 'POST'])
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
  return redirect(url_for('admin_consult_medical'))