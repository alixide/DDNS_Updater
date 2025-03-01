// This function is called when the update IPs button is clicked
function onClickUpdateIPs(hostId, hostName, hostIp) {
    // Example url: http://localhost:8080/api/update?host=e31d41bedbe94f74abf56e0c558f25d3&ip=1.1.1.1

    // Checking if the host IP is valid
    if ((!hostIp) || hostIp == "" || hostIp == "null") {
        alert("The IP address of '" + hostName + "' host is not set yet.");
        return;
    }

    // Alerting the user for the IP update
    if (!confirm("You are about to update all the following listed domains with the IP of '" + hostName + "' host: " + hostIp + "\n\nAre you sure you want to proceed?"))
        return;

    // Updating the IP via API
    fetch("/api/update?host=" + hostId + "&ip=" + hostIp)
        .then(response => response.text()) // Process response as plain text
        .then(data => {
            if (data.startsWith("OK")) {
                // Informing the user
                alert("All the domain IPs for '" + hostName + "' is successfully updated.");
            } else {
                // Informing the user
                alert(data.split("\n")[1]);
            }
        })
        .catch(error => console.error("Error fetching API:", error));
};

// This function is called when the delete Domain button is clicked
function onClickDeleteDomain(hostId, hostName, domain) {
    // Example url: http://localhost:8080/api/host/e31d41bedbe94f74abf56e0c558f25d3/domain/example.com/delete?session=1234
    // Extracting the session from the localStorage
    const session = localStorage.getItem("session");

    // Alerting the user for the deletion
    if (!confirm("Are you sure you want to delete the '" + domain + "' Domain?"))
        return;

    // Deleting the Domain via API
    fetch("/api/host/" + hostId + "/domain/" + domain + "/delete?session=" + session)
        .then(response => response.text()) // Process response as plain text
        .then(data => {
            if (data.startsWith("OK")) {
                // Redirect to the host page
                window.location.href = "/host/" + hostName + "?session=" + session;
                // Informing the user
                alert("The '" + domain + "' Domain is successfully deleted.");
            } else {
                // Informing the user
                alert(data.split("\n")[1]);
            }
        })
        .catch(error => console.error("Error fetching API:", error));
};