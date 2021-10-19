//--------------------
// Consultar
//--------------------

var postData = '616ce9d761cfe9d71f8ad20b'

$.ajax({
  url: "http://localhost:8080/employees/" + postData,
  method: 'get',
  success: function (data) {
    var html = "<label for='nome_user_register' class='input-label'>Nome</label><input type='text' value='" + data['nome'] + "'name='nome' id='nome_user_register' class='input-field' required><label for='sexo_user_register' class='input-label'>sexo</label><input type='text' value='" + data['sexo'] + "' name='sexo' id='sexo_user_register' class='input-field' required><label for='email_user_register' class='input-label'>email</label><input type='email' value='" + data['email'] + "' name='email' id='email_user_register' class='input-field' required><label for='horario_user_register' class='input-label'>horario</label><input type='text' value='" + data['horario'] + "' name='horario' id='horario_user_register' class='input-field' required><label for='endereco_user_register' class='input-label'>endereco</label><input type='text' value='" + data['endereco'] + "' name='endereco' id='endereco_user_register' class='input-field' required><label for='telefone_user_register' class='input-label'>telefone</label><input type='text' value='" + data['telefone'] + "' name='telefone' id='telefone_user_register' class='input-field' required><label for='deficiencia_user_register' class='input-label'>deficiencia</label><input type='text' value='" + data['deficiencia'] + "' name='deficiencia' id='deficiencia_user_register' class='input-field' required><label for='tipo_sanguineo_user_register' class='input-label'>tipo_sanguineo</label><input type='text' value='" + data['tipo_sanguineo'] + "' name='tipo_sanguineo' id='tipo_sanguineo_user_register' class='input-field' required><label for='data_nascimento_user_register' class='input-label'>data_nascimento</label><input type='text' value='" + data['data_nascimento'] + "' name='data_nascimento' id='data_nascimento_user_register' class='input-field' required><label for='disturbio_detectado_user_register' class='input-label'>disturbio_detectado</label><input type='text' value='" + data['disturbio_detectado'] + "' name='disturbio_detectado' id='disturbio_detectado_user_register' class='input-field' required><label for='acompanhamento_medico_user_register' class='input-label'>acompanhamento_medico</label><input type='text' value='" + data['acompanhamento_medico'] + "' name='acompanhamento_medico' id='acompanhamento_medico_user_register' class='input-field' required><label for='uso_medicacao_controlada_user_register' class='input-label'>uso_medicacao_controlada</label><input type='text' value='" + data['uso_medicacao_controlada'] + "'name='uso_medicacao_controlada' id='uso_medicacao_controlada_user_register' class='input-field' required>"
    $('#add-user-form').html(html)
  },
  error: function (error) {
    console.error(error);
    alert(error.responseJSON.message)
  }
});