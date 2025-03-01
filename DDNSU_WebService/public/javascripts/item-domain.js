// This function is called when the add or edit Domain button is clicked
function onClickProcessDomain(action, hostId, hostName, domain) {
    // Extracting the session from the localStorage
    const session = localStorage.getItem("session");

    // Extracting the values from the html page
    var newDomain = null;
    var newDDNSIndex = document.getElementById("domainDDNSIndexInput").value;
    var newUpdateUrl = document.getElementById("domainUpdateUrlInput").value;
    var newUser = document.getElementById("domainUserInput").value;
    var newPass = document.getElementById("domainPassInput").value;

    // Alerting the user if the ddns index is empty
    if ((!newDDNSIndex) || newDDNSIndex === "") {
        alert("DDNS Index can't be empty!");
        return;
    }

    // Alerting the user if the ddns index is not an integer
    if (!Number.isInteger(parseInt(newDDNSIndex))) {
        alert("DDNS Index must be an integer!");
        return;
    }

    // Converting the ddns index to integer if it is not
    newDDNSIndex = parseInt(newDDNSIndex);

    // Setting the update URL if not available
    if (!newUpdateUrl)
        newUpdateUrl = "";

    // Alerting the user if the update URL is not valid
    if (!isValidUrl(newUpdateUrl)) {
        alert("Invalid Update URL!");
        return
    }

    // Setting the username if not available
    if (!newUser)
        newUser = "";

    // Setting the password if not available
    if (!newPass)
        newPass = "";

    // Encoding the update URL
    if (newUpdateUrl != "")
        newUpdateUrl = encodeURIComponent(newUpdateUrl);

    // Calling the add or update based on the action
    if (action === "add") {
        // Getting domain from html input
        newDomain = document.getElementById("domainInput").value;
        // Alerting the user if the name is empty
        if ((!newDomain) || newDomain === "") {
            alert("Name can't be empty!");
            return;
        }

        // Checking if the domain is valid
        if (!isValidDomainUrl(newDomain)) {
            alert("Invalid Domain Name!");
            return;
        }

        // Example url: http://localhost:8080/api/host/e31d41bedbe94f74abf56e0c558f25d3/domain/add?session=1234&domain=example.com&ddns=0&updateUrl=http://optional.com/update&user=optionalUser&pass=optionalPass
        // Adding the new domain via API
        fetch("/api/host/" + hostId + "/domain/add?session=" + session + "&domain=" + newDomain + "&ddns=" + newDDNSIndex + "&updateUrl=" + newUpdateUrl + "&user=" + newUser + "&pass=" + newPass)
            .then(response => response.text()) // Process response as plain text
            .then(data => {
                if (data.startsWith("OK")) {
                    // Informing the user
                    alert("The '" + newDomain + "' Domain is successfully added.");
                    // Redirect to the host page
                    // Example url: http://localhost:8080/host/[host]?session=[session]
                    window.location.href = "/host/" + hostName + "?session=" + session;
                } else {
                    // Informing the user
                    alert(data.split("\n")[1]);
                }
            })
            .catch(error => console.error("Error fetching API:", error));
    }
    else {
        // Example url: http://localhost:8080/api/host/e31d41bedbe94f74abf56e0c558f25d3/domain/example.com/update?session=1234&ddns=0&updateUrl=http://optional.com/update&user=optionalUser&pass=optionalPass
        // Updating the domain via API
        fetch("/api/host/" + hostId + "/domain/" + domain + "/update?session=" + session + "&ddns=" + newDDNSIndex + "&updateUrl=" + newUpdateUrl + "&user=" + newUser + "&pass=" + newPass)
            .then(response => response.text()) // Process response as plain text
            .then(data => {
                if (data.startsWith("OK")) {
                    // Informing the user
                    alert("The '" + domain + "' Domain is successfully updated.");
                    // Redirect to the host page
                    window.location.href = "/host/" + hostName + "?session=" + session;
                } else {
                    // Informing the user
                    alert(data.split("\n")[1]);
                }
            })
            .catch(error => console.error("Error fetching API:", error));
    }
};
