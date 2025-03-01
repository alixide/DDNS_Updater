// This function computes the hash of a string using the djb2 algorithm.
function computeHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Convert to 32-bit integer
    }
    return hash.toString(16); // Return hash as a hexadecimal string
};

// This function checks if a password is valid. The password must be:
// - at least 8 characters long.
// - contain at least one uppercase letter.
// - contain at least one lowercase letter.
// - contain at least one number.
function isValidPassword(password) {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);

    return minLength && hasUpperCase && hasLowerCase && hasNumber;
};

// This function checks if a name is valid. The name must be:
// - A DDNS name can include upper or lower case characters, numbers, spaces, dashes and underlines.
// - A DDNS name shall start with an upper or lower case character.
// - A DDNS name shall be at least three charcter long.
function isValidName(name) {
    // Regular expression to match the required format
    const regex = /^[A-Za-z][A-Za-z0-9 _-]{2,}$/;

    return regex.test(name);
};

// This function checks if a URL is valid.
function isValidUrl(url) {
    if (url == "")
        return true;

    // Regular expression to match the required format allowing "<domain>", "<ip>", "<user>", "<pass>" variables in the fragment locator section
    const pattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?(\?([\w\-<>]+=[\w\-<>]+)(&[\w\-<>]+=[\w\-<>]+)*)?$/;

    return pattern.test(url);
};

// This function checks if a domain URL is valid.
function isValidDomainUrl(url) {
    const regex = /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}$/;
    return regex.test(url);
}

// This function checks if a string is a valid JSON data.
function isValidJson(str) {
    if ((!str) || str == "")
        return true;

    try {
        JSON.parse(str);
        return true;  // Valid JSON
    } catch (e) {
        return false; // Invalid JSON
    }
}

// This function checks if a string is a valid IP address.
function isValidIP(str) {
    const regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return regex.test(str);
}