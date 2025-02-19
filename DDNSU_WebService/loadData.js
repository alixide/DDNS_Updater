// loadData.js
// This function loads the initial data needed to operate the web service.
// Definitions:
// 1. Dynamic Domain: A domain name that is updated with a new IP address when the IP address changes.
// 2. Dynamic Domain Name Service (DDNS): A service that provides dynamic domain names.
// 3. DDNSs: A list of dynamic domain name service providers.
// 4. Host Group: A group of dynamic domains that share the same IP address.

const fs = require('fs');
const path = require('path');

// Define the file path
const filePath = path.join(__dirname, 'data', 'data.json');

module.exports = function () {
    /*
    var data = {
        // list of dynamic domain name service providers, custom settings for GET call and also their update url template including the following placeholders: <user>, <pass>, <domain>, <ip>.
        ddnss: [
            // A DDNS entry shall include the following fields:
            // { name: "DDNS Name", updateUrl: "http://www.ddns.com/update?...", settings: null }
            { name: "DDNS1", updateUrl: "http://www.ddns-1.com/update?...", settings: null },
            { name: "DDNS2", updateUrl: "http://www.ddns-2.com/update?...", settings: null }
            // Add more DNSs here
            //...
        ],
        // list of host groups and included dynamic domains (use only lower case characters as the url only acept lower case).
        dynamicHosts: {
            // A host group shall include the following fields:
            // Lower case GUID without any dash: { name: "host group name", lastIp: null, domains: // dynamic domains as seperate fields.
            // First host group
            "e31d41bedbe94f74abf56e0c558f25d3": {
                name: "HostGroup1",
                lastIp: null,
                domains: {
                    // A dynamic domain shall include the following fields:
                    // "DomainName": { ddns: // index of ddns provider starting from one, updateUrl: // specific update URL if available otherwide null, authorization: { user: "user name", pass: "password" }
                    // First dynamic domain in the first host group
                    "domain-1.com": {
                        ddns: 1,
                        updateUrl: null,
                        authorization: {
                            user: "username",
                            pass: "password"
                        }
                    },
                    // Second dynamic domain in the first host group
                    "domain-2.com": {
                        ddns: 1,
                        updateUrl: null,
                        authorization: {
                            user: "username",
                            pass: "password"
                        }
                    }
                    // Add more host domains here
                    //...
                }
            },
            // Second host group
            "d94d69713f6142e287a9d392e15258c1": {
                name: "HostGroup2",
                lastIp: null,
                domains: {
                    // First dynamic domain in the second host group
                    "domain-3.com": {
                        ddns: 1,
                        updateUrl: null,
                        authorization: {
                            user: "username",
                            pass: "password"
                        }
                    },
                    // Second dynamic domain in the second host group
                    "domain-4.com": {
                        ddns: 2,
                        updateUrl: null,
                        authorization: {
                            user: "username",
                            pass: "password"
                        }
                    }
                    // Add more host domains here
                    //...
                }
            }
            // Add more groups here
            //...
        }
    };
    */

    // Initialize the data variable
    var data = null;

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





