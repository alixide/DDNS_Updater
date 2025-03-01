// This function is called when the logout button is clicked
function onClickLogout() {
    // Extracting the session from the localStorage
    const session = localStorage.getItem("session");

    // Logout via API
    fetch("/api/logout?session=" + session)
        .then(response => response.text()) // Process response as plain text
        .then(data => {
            localStorage.removeItem("session");
            window.location.href = "/";
        })
        .catch(error => console.error("Error fetching API:", error));
};
