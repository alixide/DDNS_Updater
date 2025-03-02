// This function is called when the update settings button is clicked
function onClickUpdateSettings() {
    // Extracting the session from the localStorage
    const session = localStorage.getItem("session");

    // Extracting the values from the html page
    var newLocalUrl = document.getElementById("settingsLocalUrlInput").value;
    var newPublicUrl = document.getElementById("settingsPublicUrlInput").value;

    // Alerting the user if the local URL is empty
    if ((!newLocalUrl) || newLocalUrl === "") {
        alert("Local URL can't be empty!");
        return;
    }

    // Alerting the user if the local URL is not valid
    if (!isValidUrl(newLocalUrl)) {
        alert("Local URL is not valid!");
        return;
    }

    // Alerting the user if the public URL is empty
    if ((!newPublicUrl) || newPublicUrl === "") {
        alert("Public URL can't be empty!");
        return;
    }

    // Alerting the user if the public URL is not valid
    if (!isValidUrl(newPublicUrl)) {
        alert("Public URL is not valid!");
        return;
    }

    // Encoding the local URL
    newLocalUrl = encodeURIComponent(newLocalUrl);

    // Encoding the public URL
    newPublicUrl = encodeURIComponent(newPublicUrl);

    // Example url: http://localhost:8080/api/settings/update?session=1234&localUrl=localhost&publicUrl=http://example.com
    // Updating the settings via API
    fetch("/api/settings/update?session=" + session + "&localUrl=" + newLocalUrl + "&publicUrl=" + newPublicUrl)
        .then(response => response.text()) // Process response as plain text
        .then(data => {
            if (data.startsWith("OK")) {
                // Informing the user
                alert("The settings are successfully updated.");
            } else {
                // Informing the user
                alert(data.split("\n")[1]);
            }
        })
        .catch(error => console.error("Error fetching API:", error));
};

// This function is called when the change password button is clicked
function onClickChangePassword() {
    // Inline private function for clearing the password fields
    function clearPasswordInpus() {
        // Clearing the password fields
        document.getElementById("settingsCurrentPasswordInput").value = "";
        document.getElementById("settingsNewPasswordInput").value = "";
        document.getElementById("settingsRepeatPasswordInput").value = "";
    }

    // Extracting the session from the localStorage
    const session = localStorage.getItem("session");

    // Extracting the values from the html page
    var currentPass = document.getElementById("settingsCurrentPasswordInput").value;
    var newPass = document.getElementById("settingsNewPasswordInput").value;
    var repeatPass = document.getElementById("settingsRepeatPasswordInput").value;

    // Alerting the user if the old password is empty
    if ((!currentPass) || currentPass === "") {
        alert("Old password can't be empty!");
        clearPasswordInpus();
        return;
    }

    // Alerting the user if the new password is empty
    if ((!newPass) || newPass === "") {
        alert("New assword can't be empty!");
        clearPasswordInpus();
        return;
    }

    // Alerting the user if the new password confirmation is empty
    if ((!repeatPass) || repeatPass === "") {
        alert("New password repeat can't be empty!");
        clearPasswordInpus();
        return;
    }

    // Alerting the user if the new password and the new password confirmation do not match
    if (newPass !== repeatPass) {
        alert("New password and repeated password do not match!");
        clearPasswordInpus();
        return;
    }

    // Alerting the user if the new password is not valid
    if (!isValidPassword(newPass)) {
        alert("New password is not valid!");
        clearPasswordInpus();
        return;
    }

    // Computing the hash of the passwords
    oldSecret = computeHash(currentPass);
    newSecret = computeHash(newPass);

    // Example url: http://localhost:8080/api/secret/change?session=1234&oldSecret=hashedPassword&newSecret=hashedPassword
    // Changing the password via API
    fetch("/api/secret/change?session=" + session + "&oldSecret=" + oldSecret + "&newSecret=" + newSecret)
        .then(response => response.text()) // Process response as plain text
        .then(data => {
            if (data.startsWith("OK")) {
                // Informing the user
                alert("The password is successfully changed.");
                // Clearing the password fields
                clearPasswordInpus();
            } else {
                // Informing the user
                alert(data.split("\n")[1]);
            }
        })
        .catch(error => console.error("Error fetching API:", error));
};