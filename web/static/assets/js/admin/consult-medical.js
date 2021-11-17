//--------------------
// Consultar
//--------------------

$.ajax({
  url: "https://flaskapideploy.herokuapp.com/medical/list",
  method: "get",
  success: function (data) {
    var html = "";
    counter = 0;
    for (var i in data) {
      counter += 1;
      html +=
        "<tr><td><input class='sr-only' id='action' value='" +
        data[i]["_id"]["$oid"] +
        "'><a href='#' class='fw-bold'>'" +
        data[i]["crm"] +
        "'</a><td><span class='fw-normal'>'" +
        data[i]["email"] +
        "'</span></td><td><span class='fw-normal'>'" +
        data[i]["nome"] +
        "'</td><td><span class='fw-bold text-warning'>'" +
        data[i]["status"] +
        "'</td><td><a class='dropdown-item' href='#'><span onclick='editar()' class='fa fa-pencil-square-o me-2'></span>Editar</a><a class='dropdown-item text-danger rounded-bottom' onclick='excluir()' href='#'><span class='fa fa-trash me-2'></span>Remover</a><a class='dropdown-item text-info rounded-bottom'  onclick='visualizar()' href='#'><span class='fa fa-eye me-2'></span>Visualizar</a></td></tr>";
    }
    $("#exibir").html(html);
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
