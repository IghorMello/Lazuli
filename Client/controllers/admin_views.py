import os
import json
import string
import pathlib
import functools

from flask import Flask, flash, redirect, request, session, render_template, jsonify, url_for, abort, Blueprint
from datetime import timedelta
from decouple import config
from flask_mail import Mail, Message
from controllers.auth_views import login_required

admin_views = Blueprint('admin', __name__)

#------------------------------------------------------------------------#
# Admin - Consultar responsável médico
#------------------------------------------------------------------------#

@admin_views.route('/admin/consult-medical', methods=['GET', 'POST'])
@login_required
def admin_consult_medical():
  current_user=session['current_user']
  type_user=current_user['type_user']
  if type_user != 'admin':
    return redirect(url_for('auth.login'))
  else:
    email_current_user=current_user['email']
    return render_template('admin/consult-medical.html', current=email_current_user)

#------------------------------------------------------------------------#
# Admin - Consultar profissional de TI
#------------------------------------------------------------------------#

@admin_views.route('/admin/consult-employee', methods=['GET', 'POST'])
@login_required
def admin_consult_employee():
  current_user=session['current_user']
  type_user=current_user['type_user']
  if type_user != 'admin':
    return redirect(url_for('auth.login'))
  else:
    email_current_user=current_user['email']
    return render_template('admin/consult-employee.html', current=email_current_user)

#------------------------------------------------------------------------#
# Página de cadastro do responsável médico
#------------------------------------------------------------------------#

@admin_views.route('/admin/register-medical', methods=['GET', 'POST'])
def admin_register():
  current_user=session['current_user']
  type_user=current_user['type_user']
  if type_user != 'admin':
    return redirect(url_for('auth.login'))
  else:
    email_current_user=current_user['email']
    return render_template('admin/register-medical.html', current=email_current_user)

#------------------------------------------------------------------------
# Responsável médico - Cadastrar funcionário
#------------------------------------------------------------------------

@admin_views.route('/admin/register-employee', methods=['GET', 'POST'])
@login_required
def admin_register_employee():
  current=session['current_user']
  type_user=current['type_user']
  if type_user != 'admin':
    return redirect(url_for('auth.login'))
  else:
    current_user=current['email']
    return render_template('admin/register-employee.html',  current=current_user, all_data=current)
