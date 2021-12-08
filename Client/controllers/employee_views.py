import os
import json
import string
import pathlib
import functools

from flask import Flask, flash, redirect, request, session, render_template, jsonify, url_for, abort, Blueprint
from datetime import timedelta
from decouple import config
from controllers.auth_views import login_required

employee_views = Blueprint('employee', __name__)

#-----------------#
# Deletar
#-----------------#

@employee_views.route('/employees/delete/<id>', methods=['DELETE'])
@login_required
def delete_employees(id):
    current=session['current_user']
    type_user=current['type_user']
    if type_user != 'medical':
      return redirect(url_for('auth.login'))
    else:
      current_user=current['email']
      return render_template('medical/consult-employee.html', current=current_user)

#-----------------#
# Consultar
#-----------------#

@employee_views.route('/employees/consult/<id>', methods=['GET'])
@login_required
def consult_employees(id):
    current=session['current_user']
    type_user=current['type_user']
    if type_user != 'medical':
      return redirect(url_for('auth.login'))
    else:
      current_user=current['email']
      all_data=session['all_data']
      return render_template('medical/view-employee.html', all_data=all_data, current=current_user)

#-----------------#
# Editar
#-----------------#

@employee_views.route('/employees/edit/<id>', methods=['GET', 'PUT'])
@login_required
def edit_employees(id):
    current=session['current_user']
    type_user=current['type_user']
    if type_user != 'medical':
      return redirect(url_for('auth.login'))
    else:
      current_user=current['email']
      all_data=session['all_data']
      return render_template('medical/edit-employee.html', all_data=all_data, current=current_user)