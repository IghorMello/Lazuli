$(function () {
  // Login do responsável médico
  var $loginForm = $("#login-form");
  $loginForm.on("submit", function (e) {
    var data = {
      email: $loginForm.find("#email_medical_login").val(),
      crm: $loginForm.find("#crm_medical_login").val(),
    };
    $.ajax({
      url: "https://flaskapideploy.herokuapp.com/medical",
      type: "POST",
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(data),
      success: function (admin) {
        var postData = admin;
        console.log(postData);
        Swal.fire({
          icon: "success",
          text: "Responsável médico realizou login com sucesso!",
          showConfirmButton: false,
          timer: 1000,
        });
        $.post("/postmethod-medical", {
          javascript_data: JSON.stringify(postData),
        });
        window.location.replace("https://extensiontimind.herokuapp.com/medical/consult-employee");
      },
      error: function (error) {
        console.error(error);
        Swal.fire({
          icon: "warning",
          text: "Por favor, insira credenciais válidas",
          showConfirmButton: false,
          timer: 1000,
        });
      },
    });
    e.preventDefault();
  });
});
