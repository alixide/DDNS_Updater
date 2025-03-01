// This function is called when the DOM is loaded and redirect to the ddns page if the session is active
document.addEventListener("DOMContentLoaded", function () {
    // Extracting the session from the localStorage
    const session = localStorage.getItem("session");

    // Focusing the password input box
    let inputField = document.getElementById("passwordInput");
    inputField.focus(); // Focus the keyboard on it

    // Checking the availability of the session
    if (session) {
        // Checking the validity of the session via the API
        fetch("/api/session?session=" + session)
            .then(response => response.text()) // Process response as plain text
            .then(data => {
                if (data.startsWith("OK")) {
                    // Redirect to the ddns page
                    window.location.href = "/ddnss?session=" + session;

                } else {
                    // Removing the local session
                    localStorage.removeItem("session");
                }
            })
            .catch(error => console.error("Error fetching API:", error));
    }
});

// This function is called when the login button is clicked
function onLoginClick() {
    login();
};

function onEnterPress() {
    login();
};

function login() {
    // Extracting the the password from the passwordInput
    const password = document.getElementById("passwordInput").value;

    // Alerting the user if the password is empty
    if ((!password) || password === "") {
        alert("Password can't be empty!");
        return;
    }

    // Generating hash of the password
    var secret = computeHash(password);

    // Checking the password hash (secret) via the API
    fetch("/api/login?secret=" + secret)
        .then(response => response.text()) // Process response as plain text
        .then(data => {
            if (data.startsWith("OK")) {
                // Exrtracting the session from the second line of the data
                const session = data.split("\n")[1];
                // Storing the session in the localStorage
                localStorage.setItem("session", session);
                // Redirect to the ddns page
                window.location.href = "/ddnss?session=" + session;
            } else {
                alert("Incorrect password!");
                let inputField = document.getElementById("passwordInput");
                inputField.value = ""; // Clear the input field
                inputField.focus(); // Focus the keyboard on it
            }
        })
        .catch(error => console.error("Error fetching API:", error));
};
