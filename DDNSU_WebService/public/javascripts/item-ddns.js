// This function is called when the add or edit DDNS button is clicked
function onClickProcessDDNS(action, ddnsName) {
    // Extracting the session from the localStorage
    const session = localStorage.getItem("session");

    // Extracting the values from the html page
    var newName = document.getElementById("ddnsNameInput").value;
    var newUpdateUrl = document.getElementById("ddnsUpdateUrlInput").value;
    var newSettings = document.getElementById("ddnsSettingsInput").value;

    // Alerting the user if the name is empty
    if ((!newName) || newName === "") {
        alert("Name can't be empty!");
        return;
    }

    // Alerting the user if the name is invalid
    if (!isValidName(newName)) {
        alert("Name is invalid! \nA DDNS name can include upper or lower case characters, numbers, spaces, dashes and underlines. It shall start with an upper or lower case character and be at least three characters long.");
        return;
    }

    // Alerting the user if the update URL is empty
    if ((!newUpdateUrl) || newUpdateUrl === "") {
        alert("Update URL can't be empty!");
        return;
    }

    // Alerting the user if the update URL is invalid
    if (!isValidUrl(newUpdateUrl)) {
        alert("Update URL is invalid!");
        return;
    }

    // Alerting the user if the settings is invalid
    if (!isValidJson(newSettings)) {
        alert("Settings must be in JSON format!");
        return;
    }

    // Encoding the update URL
    newUpdateUrl = encodeURIComponent(newUpdateUrl);

    // Encoding the settings
    newSettings = encodeURIComponent(newSettings);

    // Calling the add or update based on the action
    if (action === "add") {
        // Example url: http://localhost:8080/api/ddns/add?session=1234&name=example&updateUrl=http://example.com/update&settings={"setting1":"value1","setting2":"value2"}
        // Adding the new DDNS via API
        fetch("/api/ddns/add?session=" + session + "&name=" + newName + "&updateUrl=" + newUpdateUrl + "&settings=" + newSettings)
            .then(response => response.text()) // Process response as plain text
            .then(data => {
                if (data.startsWith("OK")) {
                    // Informing the user
                    alert("The '" + newName + "' DDNS is successfully added.");
                    // Redirect to the ddns page
                    window.location.href = "/ddnss?session=" + session;
                } else {
                    // Informing the user
                    alert(data.split("\n")[1]);
                }
            })
            .catch(error => console.error("Error fetching API:", error));
    }
    else {
        // Example url: http://localhost:8080/api/ddns/ddns1/update?session=1234&name=example&updateUrl=http://example.com/update&settings={"setting1":"value1","setting2":"value2"}
        // Updating the DDNS via API
        fetch("/api/ddns/" + ddnsName + "/update?session=" + session + "&name=" + newName + "&updateUrl=" + newUpdateUrl + "&settings=" + newSettings)
            .then(response => response.text()) // Process response as plain text
            .then(data => {
                if (data.startsWith("OK")) {
                    // Informing the user
                    alert("The '" + newName + "' DDNS is successfully updated.");
                    // Redirect to the ddns page
                    window.location.href = "/ddnss?session=" + session;
                } else {
                    // Informing the user
                    alert(data.split("\n")[1]);
                }
            })
            .catch(error => console.error("Error fetching API:", error));
    }
};
