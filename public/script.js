$(document).ready(function () {
  // Test for placeholder support
  $.support.placeholder = (function () {
    var i = document.createElement("input");
    return "placeholder" in i;
  })();

  // Hide labels by default if placeholders are supported
  if ($.support.placeholder) {
    $(".form-label").each(function () {
      $(this).addClass("js-hide-label");
    });

    // Code for adding/removing classes here
    $(".form-group")
      .find("input, textarea")
      .on("keyup blur focus", function (e) {
        // Cache our selectors
        var $this = $(this),
          $label = $this.parent().find("label");

        switch (e.type) {
          case "keyup":
            {
              $label.toggleClass("js-hide-label", $this.val() == "");
            }
            break;
          case "blur":
            {
              if ($this.val() == "") {
                $label.addClass("js-hide-label");
              } else {
                $label
                  .removeClass("js-hide-label")
                  .addClass("js-unhighlight-label");
              }
            }
            break;
          case "focus":
            {
              if ($this.val() !== "") {
                $label.removeClass("js-unhighlight-label");
              }
            }
            break;
          default:
            break;
        }
      });
  }
});

function calculateTotal(input) {
  var quantity = document.getElementById("data"+input.id[4]+"1");
  var unitPrice = document.getElementById("data"+input.id[4]+"2");
  var total = document.getElementById("data"+input.id[4]+"3");
  total.value = Number(quantity.value) * Number(unitPrice.value);
}

function addTable() {
  var fields = ["Item", "Quantity", "Unit Price", "Total"];
  var units = $("#fieldno").val();
  var myTableDiv = document.getElementById("receiptFields");
  myTableDiv.innerHTML = "";

  var table = document.createElement("TABLE");
  table.className = "tableBorder";
  //table.border = '1';

  var tableBody = document.createElement("TBODY");
  table.appendChild(tableBody);

  var tr = document.createElement("TR");
  tableBody.appendChild(tr);

  for (let i = 0; i < fields.length; i++) {
    var th = document.createElement("TH");
    th.width = "250";
    th.className = "tableField";
    th.appendChild(document.createTextNode(fields[i]));
    tr.appendChild(th);
  }

  fields = ["item", "quantity", "unitPrice", "total"];
  for (var i = 0; i < units; i++) {
    tr = document.createElement("TR");
    tableBody.appendChild(tr);

    for (var j = 0; j < 4; j++) {
      var td = document.createElement("TD");
      td.width = "250";
      td.className = "tableField";
      var tid = document.createElement("input");
      tid.name = fields[j];
      tid.id = "data" + i + j;
      if (j == 2 || j== 3){ 
        tid.type = "number";
        tid.step = "0.01";
        tid.min = "0";
        if (j == 2) { tid.addEventListener('keyup', function(){calculateTotal(this)}); }
        if (j == 3) { tid.readOnly = true; }
      }
      else if (j == 1) {
        tid.type = "number";
        tid.min = "0";
      }
      else {
        tid.type = "text";
      }
      tid.required = true;
      td.appendChild(tid);
      tr.appendChild(td);
    }
  }
  myTableDiv.appendChild(table);
}

/*
    function generateFields() {
        var units = $("#fieldno").val();
        for (var count = 0; count < units; count++) {
            $("<input/><br>").attr({
                type: 'text',
                name: 'text' + count,
                id: 'text' + count,
                value: '',
                class: 'txt'
            }).appendTo("#receiptFields");
        }
    }*/

function getReceiptData() {
  let id = Number(sessionStorage.getItem("id"));
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      if (xmlhttp.responseText) {
        var result = JSON.parse(xmlhttp.responseText);
        console.log(result);
        document.getElementById("invoiceNo").innerHTML = result[0].invoiceNo;
        document.getElementById("name").innerHTML = result[0].custName;
        document.getElementById("address").innerHTML = result[0].custAddr;
        document.getElementById("email").innerHTML = result[0].custMail;
        document.getElementById("receiptNo").innerHTML = result[0].receiptNo;
        document.getElementById("createdAt").innerHTML = new Date(
          result[0].invoiceCreated
        ).toLocaleDateString();
        document.getElementById("paidOn").innerHTML = new Date(
          result[0].paidOn
        ).toLocaleDateString();

        let table = document.getElementById("table");
        let tBody = document.createElement("tbody");
        let grandTotal = 0;

        for (let i = 0; i < result[0].purchasedItems[0].length; i++) {
          let tRow = document.createElement("tr");
          let tData = document.createElement("td");
          tData.classList.add("no");
          tData.innerHTML = i + 1;
          tRow.appendChild(tData);
          tData = document.createElement("td");
          tData.classList.add("text-left");
          let item = document.createElement("h3");
          item.innerHTML = result[0].purchasedItems[0][i].item;
          tData.appendChild(item);
          tRow.appendChild(tData);
          tData = document.createElement("td");
          tData.classList.add("unit");
          tData.innerHTML = result[0].purchasedItems[0][i].quantity;
          tRow.appendChild(tData);
          tData = document.createElement("td");
          tData.classList.add("qty");
          tData.innerHTML = result[0].purchasedItems[0][i].unitPrice;
          tRow.appendChild(tData);
          tData = document.createElement("td");
          tData.classList.add("total");
          tData.innerHTML = result[0].purchasedItems[0][i].total;
          tRow.appendChild(tData);
          tBody.appendChild(tRow);

          grandTotal += result[0].purchasedItems[0][i].total;
        }
        document.getElementById("grandTotal").innerHTML = grandTotal;
        table.appendChild(tBody);
        document.getElementById("paymentMode").innerHTML =
          result[0].paymentMode;
      }
    }
  };
  if (id) {
    let data = JSON.stringify({
      id: id,
    });

    xmlhttp.open("POST", "/viewReceipt", true);
    xmlhttp.setRequestHeader("Content-type", "application/json; charset=utf-8");
    xmlhttp.send(data);
    sessionStorage.removeItem("id");
  } else {
    xmlhttp.open("GET", "/getReceiptDetail", true);
    xmlhttp.send();
  }
  xmlhttp.onerror = () => {
    alert("Connection Failed!...Please Check Your Internet Connection");
  };
}

function getAllReceipts() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      if (xmlhttp.responseText) {
        var result = JSON.parse(xmlhttp.responseText);
        console.log(result);
        let tBody = document.createElement("tbody");
        let tRow;
        for (let i = 0; i < result.length; i++) {
          tRow = document.createElement("tr");
          let tData = document.createElement("td");
          tData.innerHTML = result[i].receiptNo;
          tRow.appendChild(tData);
          tData = document.createElement("td");
          tData.innerHTML = result[i].custName;
          tRow.appendChild(tData);
          tData = document.createElement("td");
          tData.innerHTML =
            new Date(result[i].createdAt).toDateString() +
            "<br />" +
            new Date(result[i].createdAt).toLocaleTimeString();
          tRow.appendChild(tData);
          tData = document.createElement("td");
          tData.classList.add("text-right");
          let button = document.createElement("button");
          button.classList.add("btn", "btn-sm", "btn-danger");
          button.onclick = function () {
            viewPDF(result[i].receiptNo);
          };
          let pdfIcon = document.createElement("i");
          pdfIcon.classList.add("fa", "fa-file-pdf-o");
          pdfIcon.style.fontSize = "30px";
          button.appendChild(pdfIcon);
          tData.appendChild(button);
          tRow.appendChild(tData);
          tData = document.createElement("td");
          tRow.appendChild(tData);
          tBody.appendChild(tRow);
        }
        document.getElementById("table").appendChild(tBody);
      }
    }
  };
  xmlhttp.open("GET", "/getAllReceipts", true);
  xmlhttp.send();
  xmlhttp.onerror = () => {
    alert("Connection Failed!...Please Check Your Internet Connection");
  };
}

function viewPDF(id) {
  sessionStorage.setItem("id", id);
  window.location = "https://receipt-generating-app.glitch.me/generatedReceipt";
}

function ExportPdf() {
  kendo.drawing
    .drawDOM("#receipt", {
      paperSize: "A4",
      margin: { top: "1cm", bottom: "1cm" },
      scale: 0.8,
      height: 500,
    })
    .then(function (group) {
      kendo.drawing.pdf.saveAs(group, "receipt.pdf");
    });
}
