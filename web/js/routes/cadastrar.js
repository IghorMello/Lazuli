$(function () {

  //-----------------------
  // Cadastrar funcionário
  //-----------------------

  var
    $addUserForm = $("#add-user-form"),
    $addUserSuccess = $("#add-user-success");

  $addUserForm.on("submit", function (e) {
    var data = {
      nome: $addUserForm.find("#nome_user_register").val(),
      sexo: $addUserForm.find("#sexo_user_register").val(),
      email: $addUserForm.find("#email_user_register").val(),
      horario: $addUserForm.find("#horario_user_register").val(),
      endereco: $addUserForm.find("#endereco_user_register").val(),
      telefone: $addUserForm.find("#telefone_user_register").val(),
      deficiencia: $addUserForm.find("#deficiencia_user_register").val(),
      tipo_sanguineo: $addUserForm.find("#tipo_sanguineo_user_register").val(),
      data_nascimento: $addUserForm.find("#data_nascimento_user_register").val(),
      disturbio_detectado: $addUserForm.find("#disturbio_detectado_user_register").val(),
      acompanhamento_medico: $addUserForm.find("#acompanhamento_medico_user_register").val(),
      uso_medicacao_controlada: $addUserForm.find("#uso_medicacao_controlada_user_register").val(),
    };

    console.log(data);

    $.ajax({
      url: "http://localhost:8080/register-medical-file",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "POST",
      data: JSON.stringify(data),
      success: function (resp) {
        console.log(resp);
        $addUserForm.hide();
        $addUserSuccess.show();
      },
      error: function (error) {
        console.error(error);
        alert(error.responseJSON.message)
      }
    });
    e.preventDefault();
  });
})