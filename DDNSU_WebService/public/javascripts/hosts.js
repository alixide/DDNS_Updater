// This function is called when the copy local URL button of a host is clicked
function onClickCopyLocalHostUrl(url) {
    navigator.clipboard.writeText(url)
        .then(() => alert('Local Host Update URL is copied to clipboard!'))
        .catch(err => console.error('Failed to copy:', err));
};

// This function is called when the copy public URL button of a host is clicked
function onClickCopyPublicHostUrl(url) {
    navigator.clipboard.writeText(url)
        .then(() => alert('Public Host Update URL is copied to clipboard!'))
        .catch(err => console.error('Failed to copy:', err));
};

// This function is called when the delete Host button is clicked
function onClickDeleteHost(hostId, hostName) {
    // Example url: http://localhost:8080/api/host/e31d41bedbe94f74abf56e0c558f25d3/delete?session=1234
    // Extracting the session from the localStorage
    const session = localStorage.getItem("session");

    // Alerting the user for the deletion
    if (!confirm("Are you sure you want to delete the '" + hostName + "' Host?"))
        return;

    // Deleting the Host via API
    fetch("/api/host/" + hostId + "/delete?session=" + session)
        .then(response => response.text()) // Process response as plain text
        .then(data => {
            if (data.startsWith("OK")) {
                // Redirect to the ddns page
                window.location.href = "/hosts?session=" + session;
                // Informing the user
                alert("The '" + hostName + "' Host is successfully deleted.");
            } else {
                // Informing the user
                alert(data.split("\n")[1]);
            }
        })
        .catch(error => console.error("Error fetching API:", error));
};