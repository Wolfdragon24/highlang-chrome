let selection = [];

document.addEventListener("mouseup", function (e) {
    selection = window.getSelection().getRangeAt(0).getClientRects();
});

document.addEventListener("mousemove", function (e) {
    for(var i = 0 ; i < selection.length ; i++) {
        bounds = selection[i];

        const x = e.clientX;
        const y = e.clientY;

        if (x >= bounds.left && x <= bounds.right && y >= bounds.top && y <= bounds.bottom) {
            console.log("Mouse is inside the selection");
            return;
        }
    }
});