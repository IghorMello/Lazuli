
//--------------------
// Consultar
//--------------------

$.ajax({
  url: 'http://localhost:8080/employees',
  method: 'get',
  success: function (data) {
    var html = '';
    var count = data
    var total = Object.keys(count).length;
    for (var i = 0; i <= total; i++) {
      console.log(data[0]['_id']['$oid'])
      html += "<tr><th>'" + data[0]['_id']['$oid'] + "'</th><th>'" + data[0]['nome'] + "'</th><th>'" + data[0]['email'] + "'</th><th>'" + data[0]['codigo_usuario'] + "'</th></tr>"
    }
    $('#exibir').html(html)
  },
  error: function (error) {
    console.error(error);
    alert(error.responseJSON.message)
  }
});