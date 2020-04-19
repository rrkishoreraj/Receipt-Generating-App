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

function calculateTotal(i, j) {
  console.log("i: ", i);
  console.log("j: ", j);
  let unitPrice = document.getElementById("data" + i + j).value;
  j -= 1;
  let quantity = document.getElementById("data" + i + j).value;
  j += 2;
  let total = document.getElementById("data" + i + j);
  total.value = (float(unitPrice) * Number(quantity)).toFixed(2);
}

function addTable() {
  var fields = ["Item", "Quantity", "Unit Price", "Total"];
  var units = $("#fieldno").val();
  var myTableDiv = document.getElementById("receiptFields");

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
      tid.type = "text";
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
  xmlhttp.open("GET", "/getReceiptDetail", true);
  xmlhttp.send();
  xmlhttp.onerror = () => {
    alert("Connection Failed!...Please Check Your Internet Connection");
  };
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
