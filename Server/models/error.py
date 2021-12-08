import os

from decouple import config
from flask import Flask, flash, jsonify, request, Response, session, Blueprint, render_template

error = Flask(__name__)

#---------------------------------------
# Tela de erro
#---------------------------------------

@error.errorhandler(404)
def not_found(error=None):
    message = {
        'message': 'Recurso não encontrado ' + request.url,
        'status': 404
    }
    response = jsonify(message)
    response.status_code = 404
    return response