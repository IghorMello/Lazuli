$(function () {
  // Atualizar responsável médico
  var $addUserForm = $("#add-user-form");
  localid=localStorage.getItem("localid");
  $addUserForm.on("submit", function (e) {
    var data = {
      nome: $addUserForm.find("#nome_register_admin").val(),
      email: $addUserForm.find("#email_register_admin").val(),
      crm: $addUserForm.find("#crm_register_admin").val(),
    };
    $.ajax({
      url: "https://flaskapideploy.herokuapp.com/medical/"+localid,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "PUT",
      data: JSON.stringify(data),
      success: function (admin) {
        console.log(admin);
        Swal.fire({
          icon: "success",
          text: "Perfil do responsável médico foi atualizado com sucesso!",
          showConfirmButton: false,
          timer: 800,
        });
        window.location.assign("/medical/consult-employee")
      },
      error: function (error) {
        console.error(error);
        Swal.fire({
          icon: "warning",
          text: "Dados inválidos",
          showConfirmButton: false,
          timer: 1500,
        });
      },
    });
    e.preventDefault();
  });
});
