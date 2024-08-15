const apiRegex = /https?:\/\/[\d\w:\/\.]+/;

document.onload = function pullData() {
  chrome.storage.local.get('apiURL', function(data) {
    if (data.apiURL !== undefined) {
      document.getElementById("translateAPI").value = data.apiURL;
    }
  });
};

document.getElementById("saveAPI").addEventListener("click", saveAPI);

function saveAPI() {
  const api = document.getElementById("translateAPI").value;
  const extracted = api.match(apiRegex);

  const result = document.getElementById("result");

  // Check if the inputted value is a valid URL
  if (api === '' || extracted === null) {
    result.innerText = "Error: Your API URL is invalid, please try again.";
    result.style.display = "block";
    return;
  }

  const key = document.getElementById("translateKey").value;

  // Check if the API URL has already been saved
  chrome.storage.local.get(null, function(data) {
    if (data.apiURL !== undefined) {
      if (data.apiKey === key) {
        result.innerText = "Error: This API URL has already been saved.";
        result.style.display = "block";
        return;
      }
      
      chrome.storage.local.set({apiKey: key}, function() {
        result.innerText = "Success: Your API Key has been updated.";
        result.style.display = "block";
      });
      return;
    }
  });

  // Informs user of success
  chrome.storage.local.set({apiURL: extracted[0], apiKey: key}, function() {
    result.innerText = "Success: Your API URL and Key have been saved.";
    result.style.display = "block";
  });
}