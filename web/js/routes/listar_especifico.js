
//--------------------
// Consultar
//--------------------

// var postData = document.getElementById("title_property_list").val();
var postData = '616c71725e0410f0bd4c1697'

$.ajax({
  url: "http://localhost:8080/employees/" + postData,
  method: 'get',
  success: function (data) {
    var html = "<tr><th>'" + data['_id']['$oid'] + "'</th><th>'" + data['nome'] + "'</th><th>'" + data['email'] + "'</th><th>'" + data['codigo_usuario'] + "'</th></tr>"
    $('#exibir').html(html)
  },
  error: function (error) {
    console.error(error);
    alert(error.responseJSON.message)
  }
});