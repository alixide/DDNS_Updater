// This function is called when the add or edit Host button is clicked
function onClickProcessHost(action, hostId) {
    // Extracting the session from the localStorage
    const session = localStorage.getItem("session");

    // Extracting the values from the html page
    var newName = document.getElementById("hostNameInput").value;
    var newCurrentIp = document.getElementById("hostCurrentIpInput").value;

    // Alerting the user if the name is empty
    if ((!newName) || newName === "") {
        alert("Name can't be empty!");
        return;
    }

    // Alerting the user if the name is invalid
    if (!isValidName(newName)) {
        alert("Name is invalid! \nA DDNS name can include upper or lower case characters, numbers, spaces, dashes and underlines. A DDNS name shall start with an upper or lower case character. A DDNS name shall be at least three character long.");
        return;
    }

    // Setting the current IP if not available
    if (!newCurrentIp)
        newCurrentIp = "";
    else {
        // Alerting the user if the IP is invalid
        if (!isValidIP(newCurrentIp)) {
            alert("IP is invalid!");
            return;
        }
    }

    // Calling the add or update based on the action
    if (action === "add") {
        // Example url: http://localhost:8080/api/host/add?session=1234&name=host1&ip=1.1.1.1
        // Adding the new Host via API
        fetch("/api/host/add?session=" + session + "&name=" + newName + "&ip=" + newCurrentIp)
            .then(response => response.text()) // Process response as plain text
            .then(data => {
                if (data.startsWith("OK")) {
                    // Informing the user
                    alert("The '" + newName + "' Host is successfully added.");
                    // Redirect to the hosts page
                    window.location.href = "/hosts?session=" + session;
                } else {
                    // Informing the user
                    alert(data.split("\n")[1]);
                }
            })
            .catch(error => console.error("Error fetching API:", error));
    }
    else {
        // Example url: http://localhost:8080/api/host/e31d41bedbe94f74abf56e0c558f25d3/update?session=1234&name=host1&ip=1.1.1.1
        // Updating the Host via API
        fetch("/api/host/" + hostId + "/update?session=" + session + "&name=" + newName + "&ip=" + newCurrentIp)
            .then(response => response.text()) // Process response as plain text
            .then(data => {
                if (data.startsWith("OK")) {
                    // Informing the user
                    alert("The '" + newName + "' Host is successfully updated.");
                    // Redirect to the hosts page
                    window.location.href = "/hosts?session=" + session;
                } else {
                    // Informing the user
                    alert(data.split("\n")[1]);
                }
            })
            .catch(error => console.error("Error fetching API:", error));
    }
};
