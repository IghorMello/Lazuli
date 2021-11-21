//--------------------
// Consultar
//--------------------

$.ajax({
  url: "https://flaskapideploy.herokuapp.com/employees/6197be9a6c1c2520b08c4374",
  method: "get",
  success: function (data) {
    console.log(data)
  },
  error: function (error) {
    console.error(error);
    Swal.fire({
      icon: "warning",
      text: "Error",
      showConfirmButton: false,
      timer: 1500,
    });
  },
});