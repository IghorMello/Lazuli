$(function () {

  // Cadastrar novo responsável médico

  var
    $addUserForm = $("#add-user-form"),
    $addUserSuccess = $("#add-user-success");

  $addUserForm.on("submit", function (e) {
    var data = {
      nome: $addUserForm.find("#nome").val(),
      email: $addUserForm.find("#email_organizacional").val(),
      crm: $addUserForm.find("#crm").val(),
    };

    console.log(data);

    $.ajax({
      url: "http://localhost:8080/register-medical",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "POST",
      data: JSON.stringify(data),
      success: function (resp) {
        console.log(resp);
        $addUserForm.hide();
        $addUserSuccess.show();
        alert('Cadastro realizado com sucesso: ', resp)
      },
      error: function (error) {
        console.error(error);
        alert(error.responseJSON.message)
      }
    });
    e.preventDefault();
  });

  // Login do responsável médico

  var
    $loginForm = $("#login-form"),
    $loginSuccess = $("#login-success");

  $loginForm.on("submit", function (e) {
    var data = {
      email: $loginForm.find("#email").val(),
      crm: $loginForm.find("#crm_login").val(),
    };

    console.log(data);

    $.ajax({
      url: "http://localhost:8080/admin",
      type: "POST",
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(data),
      success: function (resp) {
        console.log(resp);
        $loginForm.hide();
        $loginSuccess.show();
        alert('Login realizado com sucesso: ', resp)
      },
      error: function (error) {
        console.error(error);
        alert(error.responseJSON.message)
      }
    });
    e.preventDefault();
  });

  // Cadastrar funcionário

  var
    $addUserForm = $("#add-user-form"),
    $addUserSuccess = $("#add-user-success");

  $addUserForm.on("submit", function (e) {
    var data = {
      nome: $addUserForm.find("#nome").val(),
      sexo: $addUserForm.find("#sexo").val(),
      email: $addUserForm.find("#email").val(),
      horario: $addUserForm.find("#horario").val(),
      endereco: $addUserForm.find("#endereco").val(),
      telefone: $addUserForm.find("#telefone").val(),
      deficiencia: $addUserForm.find("#deficiencia").val(),
      tipo_sanguineo: $addUserForm.find("#tipo_sanguineo").val(),
      data_nascimento: $addUserForm.find("#data_nascimento").val(),
      disturbio_detectado: $addUserForm.find("#disturbio_detectado").val(),
      acompanhamento_medico: $addUserForm.find("#acompanhamento_medico").val(),
      uso_medicacao_controlada: $addUserForm.find("#uso_medicacao_controlada").val(),
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
        alert('Código do usuário é: ', resp.codigo_usuario)
      },
      error: function (error) {
        console.error(error);
        alert(error.responseJSON.message)
      }
    });
    e.preventDefault();
  });

  // Login do funcionário

  var
    $loginForm = $("#login-form"),
    $loginSuccess = $("#login-success");

  $loginForm.on("submit", function (e) {
    var data = {
      codigo_usuario: $loginForm.find("#code").val(),
    };

    console.log(data);

    $.ajax({
      url: "http://localhost:8080/",
      type: "POST",
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(data),
      success: function (resp) {
        console.log(resp);
        $loginForm.hide();
        $loginSuccess.show();
        alert('Login realizado com sucesso: ', resp)
      },
      error: function (error) {
        console.error(error);
        alert(error.responseJSON.message)
      }
    });
    e.preventDefault();
  });
});