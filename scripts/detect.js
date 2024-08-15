let selection = [];
let popup;

window.onload = setup();

document.addEventListener("mouseup", function (e) {
    // Gets the location of the selected text when mouse hold is released
    const tempSelection = window.getSelection();

    if (tempSelection && tempSelection.rangeCount > 0) {
        selection = tempSelection.getRangeAt(0).getClientRects();
    }
});

document.addEventListener("mousemove", function (e) {
    // Iterates through block of selected text
    popup.style.display = "none";

    for(var i = 0 ; i < selection.length ; i++) {
        bounds = selection[i];

        const x = e.clientX;
        const y = e.clientY;

        if (x >= bounds.left && x <= bounds.right && y >= bounds.top && y <= bounds.bottom) {
            const text = window.getSelection().toString();
            fetchTranslation(text, bounds);
            return;
        }
    }
});

function setup() {
    // Creates the popup element
    popup = document.createElement("div");
    popup.id = "popup";

    document.body.appendChild(popup);
};

function updatePopup(text, bounds) {
    // Updates popup with loaded text, makes it appear and moves to correct location
    popup.innerHTML = text;
    popup.style.display = "block";
    popup.style.top = `${bounds.top - popup.offsetHeight * 1.1}px`;
    popup.style.left = `${bounds.left}px`;
}

function fetchTranslation(text) {
    // Fetches translation from API
    chrome.storage.local.get(null, function(data) {
        const apiURL = data.apiURL;
        const apiKey = data.apiKey;

        // Returns error if no API provided
        if (apiURL === undefined) {
            updatePopup("Error: No API URL has been set.", bounds);
            return;
        }

        // Makes request for translation
        fetch(apiURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                text: text
            })
        }).then(response => response.json()).then(data => {
            // If successful, updates popup with translation
            updatePopup(data.html, bounds);
            return;
        }).catch((error) => {
            // Otherwise, returns error from request
            console.error('Error:', error);
            updatePopup(`Error: Failed to fetch translation: ${error}`);
            return;
        });
    });
}