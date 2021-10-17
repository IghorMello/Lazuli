$(function () {
  // Cadastrar novo usuário
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
      },
      error: function (error) {
        console.error(error);
        alert(error.responseJSON.message)
      }
    });
    e.preventDefault();
  });

  // Login do usuário

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
      },
      error: function (error) {
        console.error(error);
        alert(error.responseJSON.message)
      }
    });
    e.preventDefault();
  });
});