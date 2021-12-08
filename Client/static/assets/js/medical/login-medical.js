$(function () {
  // Login do responsável médico
  var $loginForm = $("#login-form");
  $loginForm.on("submit", function (e) {
    var data = {
      email: $loginForm.find("#email_medical_login").val(),
      password: $loginForm.find("#password_medical_login").val(),
    };
    $.ajax({
      url: "http://localhost:8080/medical",
      type: "POST",
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(data),
      beforeSend: function () {
        $("#loader").removeClass("hide");
      },
      success: function (admin) {
        console.log(admin.localId);
        var postData = admin;
        console.log(postData);
        localid = localStorage.setItem("localid", admin.localId);
        Swal.fire({
          icon: "success",
          text: "Responsible doctor logged in successfully!",
          showConfirmButton: false,
          timer: 1000,
        });
        $.post("http://localhost:5000/postmethod-medical", {
          javascript_data: JSON.stringify(postData),
        }).done(function () {
          window.location.assign("/medical/consult-employee");
        });
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
