document
.getElementById("code_user")
.addEventListener("focus", function () {
  document.getElementById("label--password").classList.add("transform");
});

document
.getElementById("code_user")
.addEventListener("blur", function () {
  if (document.getElementById("code_user").value === "")
    document
      .getElementById("label--password")
      .classList.remove("transform");
});
