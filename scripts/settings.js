const apiRegex = /https?:\/\/[\d\w:\/\.]+/;

document.onload(function() {
  chrome.storage.local.get('apiURL', function(data) {
    if (data.apiURL !== undefined) {
      document.getElementById("translateAPI").value = data.apiURL;
    }
  });
});

function saveAPI() {
  const api = document.getElementById("translateAPI").value;
  const extracted = api.match(apiRegex);

  const result = document.getElementById("result");

  // Check if the inputted value is a valid URL
  if (api === '' || extracted === null) {
    result.innerText = "Error: Your API URL is invalid, please try again.";
    return;
  }

  // Check if the API URL has already been saved
  chrome.storage.local.get('apiURL', function(data) {
    if (data.apiURL !== undefined) {
      result.innerText = "Error: This API URL has already been saved.";
      return;
    }
  });

  // Informs user of success
  chrome.storage.local.set({apiURL: extracted[0]}, function() {
    result.innerText = "Success: Your API URL has been saved.";
  });
}