//--------------------
// Consultar
//--------------------

localid = localStorage.getItem("localid");

$.ajax({
  url: "https://flaskapideploy.herokuapp.com/employees",
  method: "get",
  success: function (data) {
    var html = "";
    for (var i in data) {
      console.log(data[i]["_id"]["$oid"])
      html +=
        "<tr><td><input class='sr-only' id='action' value='" +
        data[i]["_id"]["$oid"] +
        "'><a href='#' class='fw-bold'>'"
        + data[i]["codigo_usuario"] +
        "'</a><td><span class='fw-normal'>'"
        + data[i]["email"] +
        "'</span></td><td><span class='fw-normal'>'" +
        data[i]["nome"] +
        "'</td><td><span class='fw-bold text-warning'>'"
        + data[i]["status"] +
        "'</td><td><a class='dropdown-item  rounded-bottom' onclick='editar()' href='#'><span class='fa fa-pencil-square-o me-2'></span>Edit</a><a class='dropdown-item text-danger rounded-bottom' onclick='excluir()' href='#'><span class='fa fa-trash me-2'></span>Delete</a><a class='dropdown-item text-info rounded-bottom' onclick='visualizar()' href='#'><span class='fa fa-eye me-2'></span>Consult</a></td></tr>";
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

function visualizar() {
  $.ajax({
    url: "https://flaskapideploy.herokuapp.com/employees/6197be9a6c1c2520b08c4374",
    method: "get",
    success: function (data) {
      var postData = data;
      $.post("/postmethod-employee", {
        javascript_data: JSON.stringify(postData),
      })
        .done(function () {
          window.location.assign("/employees/consult/6197be9a6c1c2520b08c4374")
        });
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
}

function excluir() {
  idData = $('#action').val()
  Swal.fire({
    html: '<div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h4 class="modal-title">Tem certeza que deseja deletar?</h4><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div><div class="modal-footer"><button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button><button type="button" class="btn btn-success" onclick="deletar6197be9a6c1c2520b08c4374()" style="color: #fff">Delete</button></div></div></div></div>', 
    showConfirmButton: false,
  })
}

function deletar6197be9a6c1c2520b08c4374() {
  $.ajax({
    url: "https://flaskapideploy.herokuapp.com/employees/6197be9a6c1c2520b08c4374",
    method: "delete",
    success: function (data) {
      Swal.fire({
        icon: "success",
        text: "Profissional de TI deletado com sucesso",
        showConfirmButton: false,
        timer: 1500,
      });
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
}

function editar() {
  $.ajax({
    url: "https://flaskapideploy.herokuapp.com/employees/6197be9a6c1c2520b08c4374",
    method: "get",
    success: function (data) {
      var postData = data;
      $.post("/postmethod-employee", {
        javascript_data: JSON.stringify(postData),
      })
        .done(function () {
          window.location.assign("/employees/edit/6197be9a6c1c2520b08c4374")
        });
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
}