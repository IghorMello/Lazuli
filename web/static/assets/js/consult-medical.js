
// //-----------------------------
// // Consultar responsável médico
// //-----------------------------

// $.ajax({
//   url: 'https://flaskapideploy.herokuapp.com/medical/' + localStorage.getItem('userId'),
//   method: 'get',
//   success: function (data) {
//     console.log(data)
//     $.post("/getmethod", {
//       javascript_data: JSON.stringify(data)
//     });
//   },
//   error: function (error) {
//     console.error(error);
//     alert(error.responseJSON.message)
//   }
// });