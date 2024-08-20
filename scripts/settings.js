const apiRegex = /https?:\/\/[\d\w:\/\.]+/;

window.onload = function pullData() {
  chrome.storage.local.get('apiURL', function(data) {
    if (data.apiURL !== undefined) {
      document.getElementById("translateAPI").value = data.apiURL;
    }
  });
};

document.getElementById("saveAPI").addEventListener("click", saveAPI);
document.getElementById("clearSaved").addEventListener("click", clearSavedAPI);

function result(type, message) {
  const result = document.getElementById("result");
  result.innerText = message;
  result.style.display = "block";

  if (type === "error") {
    result.style.color = "#f3564e";
  } else {
    result.style.color = "#4aad4d";
  }
}

function saveAPI() {
  const api = document.getElementById("translateAPI").value;
  const extracted = api.match(apiRegex);

  // Check if the inputted value is a valid URL
  if (api === '' || extracted === null) {
    result("error", "Error: Your API URL is invalid, please try again.");
    return;
  }

  const key = document.getElementById("translateKey").value;

  // Check if the API URL has already been saved
  chrome.storage.local.get(null, function(data) {
    if (data.apiURL !== undefined) {
      if (data.apiKey === key) {
        result("error", "Error: This API URL has already been saved.");
        return;
      }
      
      chrome.storage.local.set({apiKey: key}, function() {
        result("success", "Success: Your API Key has been updated.");
      });
      return;
    }
  });

  // Informs user of success
  chrome.storage.local.set({apiURL: extracted[0], apiKey: key}, function() {
    result("success", "Success: Your API URL and Key have been saved.");
  });
}

function clearSavedAPI() {
  chrome.storage.local.remove(["apiURL", "apiKey"], function() {
    result("success", "Success: Your saved settings have been cleared.");

    document.getElementById("translateAPI").value = "";
    document.getElementById("translateKey").value = "";
  });
}
