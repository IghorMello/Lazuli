
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
    for (var i in data) {
      console.log(data[i]['_id']['$oid'])
      html += "<tr><th>'" + data[i]['_id']['$oid'] + "'</th><th>'" + data[i]['nome'] + "'</th><th>'" + data[i]['email'] + "'</th><th>'" + data[i]['codigo_usuario'] + "'</th></tr>"
    }
    $('#exibir').html(html)
  },
  error: function (error) {
    console.error(error);
    alert(error.responseJSON.message)
  }
});