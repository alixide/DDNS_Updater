// This function is called when the delete DDNS button is clicked
function onClickDeleteDDNS(ddnsName) {
    // Example url: http://localhost:8080/api/ddns/ddns1/delete?session=1234
    // Extracting the session from the localStorage
    const session = localStorage.getItem("session");

    // Alerting the user for the deletion
    if (!confirm("This will delete the '" + ddnsName + "' ddns and all its corresponding domains from existing hosts. Are you sure you want to proceed?"))
        return;

    // Deleting the DDNS via API
    fetch("/api/ddns/" + ddnsName + "/delete?session=" + session)
        .then(response => response.text()) // Process response as plain text
        .then(data => {
            if (data.startsWith("OK")) {
                // Redirect to the ddns page
                window.location.href = "/ddnss?session=" + session;
                // Informing the user
                alert(data.split("\n").slice(1).join("\n"));
            } else {
                // Informing the user
                alert(data.split("\n")[1]);
            }
        })
        .catch(error => console.error("Error fetching API:", error));
};