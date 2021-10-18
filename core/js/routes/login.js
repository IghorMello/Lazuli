$(function () {

  //----------------------------
  // Login do funcionário
  //----------------------------

  var
    $loginForm = $("#login-form"),
    $loginSuccess = $("#login-success");

  $loginForm.on("submit", function (e) {
    var data = {
      codigo_usuario: $loginForm.find("#code_user").val(),
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
        var html = "<span> Funcionário foi cadastrado, seu código de acesso é '" + data['codigo_usuario'] + "'</span>"
        $('#login-success').html(html)
      },
      error: function (error) {
        console.error(error);
        alert(error.responseJSON.message)
      }
    });
    e.preventDefault();
  });
});