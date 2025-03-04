// loadData.js
// This function loads the initial data needed to operate the web service.
// Definitions:
// 1. Dynamic Domain: A domain name that is updated with a new IP address when the IP address changes.
// 2. Dynamic Domain Name Service (DDNS): A service that provides dynamic domain names.
// 3. DDNSs: A list of dynamic domain name service providers.
// 4. Host: A group of dynamic domains that share the same IP address.

const fs = require('fs');
const path = require('path');

// Define the file path
const filePath = path.join(__dirname, 'data', 'config.json');

module.exports = function () {
    // Initialize the data variable. Check the readme.md file for the data structure.
    var data = null;

    // Checking if the file exists
    if (!fs.existsSync(filePath)) {
        // Copying and renaming the config default file to the data folder
        const defaultConfigPath = path.join(__dirname, '.', 'config-default.json');
        fs.copyFileSync(defaultConfigPath, filePath);
        console.log('The default config file was copied to the data folder.');
    }

    // Load the data from a file
    try {
        // Read the JSON file
        const jsonData = fs.readFileSync(filePath, 'utf8');

        // Parse JSON data into a variable
        data = JSON.parse(jsonData);

        console.log('JSON data loaded successfully:', data);
    } catch (error) {
        console.error('Error loading JSON file:', error.message);
    }

    // Return the loaded data
    return data;
};