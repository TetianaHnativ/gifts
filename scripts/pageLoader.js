function loadHTML(id, url) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;
        });
}

window.onload = function () {
    loadHTML('header', 'header.html');
    loadHTML('footer', 'footer.html');
    
    loadHTML('message-modal', 'messageModal.html');
};