function edit_data() {
  localid=$("#localid").val()
  console.log(localid)
  $.ajax({
    url: "https://flaskapideploy.herokuapp.com/employees/"+localid,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    type: "PUT",
    data: JSON.stringify(data),
    success: function (admin) {
      console.log(admin);
      Swal.fire({
        icon: "success",
        text: "Profissional de TI foi atualizado com sucesso!",
        showConfirmButton: false,
        timer: 1000,
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
}