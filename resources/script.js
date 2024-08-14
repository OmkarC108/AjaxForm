var connToken = "90932119|-31949222298876792|90962107";
var dbName = "Delivery_DB";
var tableName = "Shipment_Table";
var baseUrl = "http://api.login2explore.com:5577";
var iml = "/api/iml";
var irl = "/api/irl";

/*$("#defaultData").click(function (event) {
  event.preventDefault();
  $("#shipment_no").val("747749494");
  $("#description").val("Hello world");
  $("#source").val("Mumbai");
  $("#destination").val("Bangalore");
  $("#ship_date").val("2024-08-15");
  $("#delivery_date").val("2024-08-20");
  $("#SaveBtn, #ResetBtn").prop("disabled", false);
  $("#description").focus();
});
*/
document.addEventListener("DOMContentLoaded", function () {
  var today = new Date().toISOString().split("T")[0];
  document.getElementById("ship_date").value = today;
  document.getElementById("delivery_date").value = today;
});

$("#shipment_no").focus();

function saveRecNo2LS(resultObj) {
  var lvdata = JSON.parse(resultObj.data);
  localStorage.setItem("recno", lvdata.rec_no);
}

function validateAndGetFormData() {
  var shipmentVar = $("#shipment_no").val();
  var descVar = $("#description").val();
  var sourceVar = $("#source").val();
  var destinationVar = $("#destination").val();
  var ship_dateVar = $("#ship_date").val();
  var delivery_dateVar = $("#delivery_date").val();

  if (shipmentVar === "") {
    alert("Shipment No. is a Required Value");
    $("#shipment_no").focus();
    return "";
  }
  if (descVar === "") {
    alert("Description is a Required Value");
    $("#description").focus();
    return "";
  }
  if (sourceVar === "") {
    alert("Source is a Required Value");
    $("#source").focus();
    return "";
  }
  if (destinationVar === "") {
    alert("Destination is a Required Value");
    $("#destination").focus();
    return "";
  }
  if (ship_dateVar === "") {
    alert("Shipping date is a Required Value");
    $("#ship_date").focus();
    return "";
  }
  if (delivery_dateVar === "") {
    alert("Expected delivery date is a Required Value");
    $("#delivery_date").focus();
    return "";
  }

  var jsonStrObj = {
    shipment_no: shipmentVar,
    description: descVar,
    source: sourceVar,
    destination: destinationVar,
    ship_date: ship_dateVar,
    delivery_date: delivery_dateVar,
  };
  return JSON.stringify(jsonStrObj);
}

function saveData() {
  var jsonStr = validateAndGetFormData();
  if (jsonStr === "") {
    return;
  }
  var putReqStr = createPUTRequest(connToken, jsonStr, dbName, tableName);
  jQuery.ajaxSetup({ async: false });
  var resultObj = executeCommandAtGivenBaseUrl(putReqStr, baseUrl, iml);
  jQuery.ajaxSetup({ async: true });
  alert(JSON.stringify(resultObj));
  resetForm();
  $("#shipment_no").focus();
}

function updateData() {
  $("#UpdateBtn").prop("disabled", true);
  var jsonStr = validateAndGetFormData();
  if (jsonStr === "") {
    return;
  }
  var updateReqStr = createUPDATERecordRequest(
    connToken,
    jsonStr,
    dbName,
    tableName,
    localStorage.getItem("recno")
  );
  jQuery.ajaxSetup({ async: false });
  var resultObj = executeCommandAtGivenBaseUrl(updateReqStr, baseUrl, iml);
  jQuery.ajaxSetup({ async: true });
  console.log(resultObj);
  resetForm();
  $("#shipment_no").focus();
}

function resetForm() {
  $("#FormData")[0].reset();
  $("#shipment_no").prop("disabled", false);
  $("#SaveBtn, #UpdateBtn, #ResetBtn").prop("disabled", true);
  $("#shipment_no").focus();
}

function getData() {
  var shipmentVar = $("#shipment_no").val();
  var jsonStr = JSON.stringify({ shipment_no: shipmentVar });
  var getReqStr = createGET_BY_KEYRequest(
    connToken,
    dbName,
    tableName,
    jsonStr
  );

  jQuery.ajaxSetup({ async: false });
  var resultObj = executeCommandAtGivenBaseUrl(getReqStr, baseUrl, irl);
  jQuery.ajaxSetup({ async: true });

  console.log(resultObj);

  if (resultObj.status === 400) {
    $("#SaveBtn, #ResetBtn").prop("disabled", false);
    $("#description").focus();
  } else if (resultObj.status === 200) {
    $("#shipment_no").prop("disabled", true);
    fillForm(resultObj);
    $("#UpdateBtn, #ResetBtn").prop("disabled", false);
    $("#description").focus();
  } else {
    alert("Shipment not found");
  }
}

function fillForm(resultObj) {
  saveRecNo2LS(resultObj);
  var record = JSON.parse(resultObj.data).record;
  console.log("Record:", record);
  $("#description").val(record.description);
  $("#source").val(record.source);
  $("#destination").val(record.destination);
  $("#ship_date").val(record.ship_date);
  $("#delivery_date").val(record.delivery_date);
}
