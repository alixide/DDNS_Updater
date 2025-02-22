// This file contains the API for the DDNSU_WebService.
'use strict';
const express = require('express');
const fs = require('fs');
const http = require('http');
const url = require('url');

var router = express.Router();

/////////////////////////////////////////////////////////////
// This section is the API for updating a host IP.
// Updates the IP address of a host.
// Example url: http://localhost:8080/api/update?host=e31d41bedbe94f74abf56e0c558f25d3.com&ip=1.1.1.1
router.get('/update', function (req, res) {
    // Extracting the data from the app.locals
    const data = req.app.locals.data;
    var ddnss = data.ddnss;
    var hosts = data.hosts;

    // extracting the url parameters
    var q = url.parse(req.url.toLowerCase(), true).query;
    var urlHostId = q.host;
    var urlIp = q.ip;

    // nothing to do if host id is not provided
    if (!urlHostId) {
        res.write("Error \n" + "No host id provided.");
        res.end();
        return;
    }

    // // This section is only for test purpose and shall be removed for production
    // console.log("here sef");
    // console.log(JSON.stringify(req.headers));
    // //if (!urlIp)
    //   //  if (req.headers && req.headers['x-forwarded-for'])
    //         //urlIp = JSON.stringify(req.headers);
    // res.writeHead(200, { 'Content-Type': 'application/json' });
    // //res.write(JSON.stringify(req.socket.remoteAddress)); 
    // res.write(JSON.stringify(req.headers)); 
    // //res.write("test test");
    // res.end();
    // return;

    // extracting the ip if no ip provided.
    if (!urlIp)
        if (req.headers && req.headers['x-forwarded-for'])
            urlIp = (req.headers['x-forwarded-for']).split(',').pop().trim();
        else if (req.socket && req.socket.remoteAddress)
            urlIp = req.socket.remoteAddress;
        else
            urlIp = req.ip;

    // nothing to do if the ip has not changed.
    if (hosts[urlHostId].lastIp == urlIp || !urlIp || urlIp == "::1") {
        res.write("Error \n" + "Unchanged or invalid IP.");
        res.end();
        return;
    }

    // Updating the host information
    var host = hosts[urlHostId];
    host.lastIp = urlIp;
    host.lastUpdate = Date.now().toString(16);

    // Saving the data
    fs.mkdirSync('./data', { recursive: true });
    fs.writeFileSync('./data/config.json', JSON.stringify(data, null, 2), 'utf-8');
    console.log('JSON data updated successfully:', data);

    // Updating each of the domains relevant to this host
    res.write(host.name + ' => ' + urlIp + "\n");
    const domains = Object.keys(host.domains);
    var requestCounter = 0;
    for (const domain of domains) {
        // generating the update url template for this domain
        var updateUrl = host.domains[domain].updateUrl;
        if (!updateUrl)
            updateUrl = ddnss[host.domains[domain].ddns].updateUrl;

        // replacing the variables in the update url
        updateUrl = updateUrl.replace("<domain>", domain);
        updateUrl = updateUrl.replace("<ip>", urlIp);
        if (host.domains[domain].authorization) {
            updateUrl = updateUrl.replace("<user>", host.domains[domain].authorization.user);
            updateUrl = updateUrl.replace("<pass>", host.domains[domain].authorization.pass);
        }

        // making a http request
        requestCounter++;
        const options = {
            port: 80,
            method: 'GET',
            domain: domain
        };
        if (host.domains[domain].authorization)
            options.auth = host.domains[domain].authorization.user + ":" + host.domains[domain].authorization.pass;
        if (ddnss[host.domains[domain].ddns].settings) {
            const settings = Object.keys(ddnss[host.domains[domain].ddns].settings);
            for (const setting of settings)
                options[setting] = ddnss[host.domains[domain].ddns].settings[setting];
        }
        var req = http.request(updateUrl, options, response => {
            var data = "";
            response.on('data', (d) => { data += d; });
            response.on('end', () => {
                res.write("\n----------------------------------------\n" + options.domain + ":\n" + data);
                requestCounter--;
                if (requestCounter == 0)
                    res.end();
            });
        });
        req.on('error', error => {
            res.write("Error \n" + "An error has occurred.");
            requestCounter--;
            if (requestCounter == 0)
                res.end();
        });
        req.end();
    }
});

/////////////////////////////////////////////////////////////
// This section is the API for user management.
// Login the user and returns a session id.
// Example url: http://localhost:8080/api/login?secret=hashedPassword
router.get('/login', (req, res) => {
    // Extracting the data from the app.locals
    const data = req.app.locals.data;
    var session = req.app.locals.session;

    // Extracting the case sensitive url parameters
    var q = url.parse(req.url, true).query;
    var urlSecret = q.secret;

    // Nothing to do if secret is not provided
    if (!urlSecret) {
        res.write("Error \n" + "No secret provided.");
        res.end();
        return;
    }

    // Extracting the hashed secret from the secret.dat file
    var secret = fs.readFileSync('./secret.dat', 'utf-8');

    // Nothing to do if secret is not valid
    if (urlSecret != secret) {
        res.write("Error \n" + "Invalid secret.");
        res.end();
        return;
    }

    // Returning the existing session if it exists
    if (session) {
        res.write("OK \n" + session);
        res.end();
        return;
    }

    // Generating a new session
    session = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    req.app.locals.session = session;

    // Sending the response
    res.write("OK \n" + session);
    res.end();
});

// Logout the user by invalidating the session.
// Example url: http://localhost:8080/api/logout?session=1234
router.get('/logout', (req, res) => {
    // Extracting the lower case url parameters
    var q = url.parse(req.url.toLowerCase(), true).query;
    var urlSession = q.session;

    // Nothing to do if session is not provided
    if (!urlSession) {
        res.write("Error \n" + "No session provided.");
        res.end();
        return;
    }

    // Nothing to do if session is not valid
    if (req.app.locals.session != urlSession) {
        res.write("Error \n" + "Invalid session.");
        res.end();
        return;
    }

    // Invalidating the session
    req.app.locals.session = null;

    // Sending the response
    res.write("OK \n" + "Session is invalidated.");
    res.end();
});

// Change the secret of the user.
// Example url: http://localhost:8080/api/secret/change?session=1234&oldSecret=hashedPassword&newSecret=hashedPassword
router.get('/secret/change', (req, res) => {
    // Extracting the data from the app.locals
    const data = req.app.locals.data;
    var session = req.app.locals.session;

    // Extracting the lower case url parameters
    var q = url.parse(req.url.toLowerCase(), true).query;
    var urlOldSecret = q.oldsecret;
    var urlNewSecret = q.newsecret;
    var urlSession = q.session;

    // Nothing to do if session is not provided
    if (!urlSession) {
        res.write("Error \n" + "No session provided.");
        res.end();
        return;
    }

    // Nothing to do if session is not valid
    if (req.app.locals.session != urlSession) {
        res.write("Error \n" + "Invalid session.");
        res.end();
        return;
    }

    // Nothing to do if old secret is not provided
    if (!urlOldSecret) {
        res.write("Error \n" + "No old secret provided.");
        res.end();
        return;
    }

    // Nothing to do if new secret is not provided
    if (!urlNewSecret) {
        res.write("Error \n" + "No new secret provided.");
        res.end();
        return;
    }

    // Extracting the hashed secret from the secret.dat file
    var secret = fs.readFileSync('./secret.dat', 'utf-8');

    // Nothing to do if old secret is not valid
    if (urlOldSecret != secret) {
        res.write("Error \n" + "Invalid old secret.");
        res.end();
        return;
    }

    // Updating the secret
    fs.writeFileSync('./secret.dat', urlNewSecret, 'utf-8');

    // Sending the response
    res.write("OK \n" + "Secret is changed.");
    res.end();
});

/////////////////////////////////////////////////////////////
// This section is the API for managing DDNS entries.
// Add new DDNS entry
// Example url: http://localhost:8080/api/ddns/add?session=1234&name=example&updateUrl=http://example.com/update&settings={"setting1":"value1","setting2":"value2"}
router.get('/ddns/add', (req, res) => {
    // Extracting the data from the app.locals
    const data = req.app.locals.data;
    var ddnss = data.ddnss;
    var hosts = data.hosts;

    // Extracting the lower case url parameters
    var q = url.parse(req.url.toLowerCase(), true).query;
    var urlUpdateUrl = q.updateurl;
    var urlSettings = q.settings;
    var urlSession = q.session;

    // Extracting the case sensitive url parameters
    var q = url.parse(req.url, true).query;
    var urlName = q.name;

    // Nothing to do if session is not provided
    if (!urlSession) {
        res.write("Error \n" + "No session provided.");
        res.end();
        return;
    }

    // Nothing to do if session is not valid
    if (req.app.locals.session != urlSession) {
        res.write("Error \n" + "Invalid session.");
        res.end();
        return;
    }

    // Nothing to do if name is not provided
    if (!urlName) {
        res.write("Error \n" + "No ddns name provided.");
        res.end();
        return;
    }

    // Nothing to do if update url is not provided
    if (!urlUpdateUrl) {
        res.write("Error \n" + "No ddns update url provided.");
        res.end();
        return;
    }

    // Nothing to do if the name already exists
    if (ddnss.find(ddns => ddns.name === urlName)) {
        res.write("Error \n" + "DDNS name already exists.");
        res.end();
        return;
    }

    // Setting the settings to null if not provided
    if (!urlSettings)
        urlSettings = null;

    // Adding the new DDNS entry
    ddnss.push({ name: urlName, updateUrl: urlUpdateUrl, settings: urlSettings });

    // Saving the data
    fs.mkdirSync('./data', { recursive: true });
    fs.writeFileSync('./data/config.json', JSON.stringify(data, null, 2), 'utf-8');
    console.log('JSON data updated successfully:', data);

    // Sending the response
    res.write("OK \n" + urlName + " DDNS is added." );
    res.end();
});

// Get specific DDNS entry
// Example url: http://localhost:8080/api/ddns/ddns1?session=1234
router.get('/ddns/:name', (req, res) => {
    // Extracting the data from the app.locals
    const data = req.app.locals.data;
    var ddnss = data.ddnss;
    var hosts = data.hosts;

    // Extracting the lower case url parameters
    var q = url.parse(req.url.toLowerCase(), true).query;
    var urlSession = q.session;

    // Nothing to do if session is not provided
    if (!urlSession) {
        res.write("Error \n" + "No session provided.");
        res.end();
        return;
    }

    // Nothing to do if session is not valid
    if (req.app.locals.session != urlSession) {
        res.write("Error \n" + "Invalid session.");
        res.end();
        return;
    }

    // Finding the DDNS entry
    const entry = ddnss.find(ddns => ddns.name === req.params.name);

    // Sending the response
    if (entry)
        res.write("OK \n" + JSON.stringify(entry));
    else
        res.write("Error \n" + "DDNS not found.");

    res.end();
});

// Update DDNS entry
// Example url: http://localhost:8080/api/ddns/ddns1/update?session=1234&name=example&updateUrl=http://example.com/update&settings={"setting1":"value1","setting2":"value2"}
router.get('/ddns/:name/update', (req, res) => {
    // Extracting the data from the app.locals
    const data = req.app.locals.data;
    var ddnss = data.ddnss;
    var hosts = data.hosts;

    // Extracting the lower case url parameters
    var q = url.parse(req.url.toLowerCase(), true).query;
    var urlUpdateUrl = q.updateurl;
    var urlSettings = q.settings;
    var urlSession = q.session;

    // Extracting the case sensitive url parameters
    var q = url.parse(req.url, true).query;
    var urlName = q.name;

    // Nothing to do if session is not provided
    if (!urlSession) {
        res.write("Error \n" + "No session provided.");
        res.end();
        return;
    }

    // Nothing to do if session is not valid
    if (req.app.locals.session != urlSession) {
        res.write("Error \n" + "Invalid session.");
        res.end();
        return;
    }

    // Nothing to do if name is not provided
    if (!urlName) {
        res.write("Error \n" + "No ddns name provided.");
        res.end();
        return;
    }

    // Nothing to do if update url is not provided
    if (!urlUpdateUrl) {
        res.write("Error \n" + "No ddns update url provided.");
        res.end();
        return;
    }

    // Finding the DDNS entry
    const index = ddnss.findIndex(ddns => ddns.name === req.params.name);

    // Nothing to do if the DDNS entry is not found
    if (index === -1) {
        res.write("Error \n" + "DDNS not found.");
        res.end();
        return;
    }

    // Setting the settings to null if not provided
    if (!urlSettings)
        urlSettings = null;

    // Updating the DDNS entry
    ddnss[index] = { name: urlName, updateUrl: urlUpdateUrl, settings: urlSettings };

    // Saving the data
    fs.mkdirSync('./data', { recursive: true });
    fs.writeFileSync('./data/config.json', JSON.stringify(data, null, 2), 'utf-8');
    console.log('JSON data updated successfully:', data);

    // Sending the response
    res.write("OK \n" + urlName + " DDNS is updated.");
    res.end();
});

// Delete DDNS entry
// Example url: http://localhost:8080/api/ddns/ddns1/delete?session=1234
router.get('/ddns/:name/delete', (req, res) => {
    // Extracting the data from the app.locals
    const data = req.app.locals.data;
    var ddnss = data.ddnss;
    var hosts = data.hosts;

    // Extracting the lower case url parameters
    var q = url.parse(req.url.toLowerCase(), true).query;
    var urlSession = q.session;

    // Extracting the case sensitive url parameters
    var q = url.parse(req.url, true).query;
    var urlName = q.name;

    // Nothing to do if session is not provided
    if (!urlSession) {
        res.write("Error \n" + "No session provided.");
        res.end();
        return;
    }

    // Nothing to do if session is not valid
    if (req.app.locals.session != urlSession) {
        res.write("Error \n" + "Invalid session.");
        res.end();
        return;
    }

    // Finding the DDNS entry
    const index = ddnss.findIndex(ddns => ddns.name === req.params.name);

    // Nothing to do if the DDNS entry is not found
    if (index === -1) {
        res.write("Error \n" + "DDNS not found.");
        res.end();
        return;
    }

    // Deleting the DDNS entry
    ddnss.splice(index, 1);

    // Saving the data
    fs.mkdirSync('./data', { recursive: true });
    fs.writeFileSync('./data/config.json', JSON.stringify(data, null, 2), 'utf-8');
    console.log('JSON data updated successfully:', data);

    // Sending the response
    res.write("OK \n" + req.params.name + " DDNS is deleted.");
    res.end();
});

/////////////////////////////////////////////////////////////
// This section is the API for managing host entries.
// Add new host
// Example url: http://localhost:8080/api/host/add?session=1234&name=host1&ip=1.1.1.1
router.get('/host/add', (req, res) => {
    // Extracting the data from the app.locals
    const data = req.app.locals.data;
    var ddnss = data.ddnss;
    var hosts = data.hosts;

    // Extracting the lower case url parameters
    var q = url.parse(req.url.toLowerCase(), true).query;
    var urlIp = q.ip;
    var urlSession = q.session;

    // Extracting the case sensitive url parameters
    var q = url.parse(req.url, true).query;
    var urlName = q.name;

    // Nothing to do if session is not provided
    if (!urlSession) {
        res.write("Error \n" + "No session provided.");
        res.end();
        return;
    }

    // Nothing to do if session is not valid
    if (req.app.locals.session != urlSession) {
        res.write("Error \n" + "Invalid session.");
        res.end();
        return;
    }

    // Nothing to do if name is not provided
    if (!urlName) {
        res.write("Error \n" + "No host name provided.");
        res.end();
        return;
    }

    // Setting the ip to null if not provided
    if (!urlIp)
        urlIp = null;

    // Generating a lower case GUID without dashes as the host id
    const hostId = crypto.randomUUID().replace(/-/g, "").toLowerCase();

    // Getting the current time in milliseconds
    const lastUpdate = Date.now().toString(16);

    // Adding the new dynamic host
    hosts[hostId] = { name: urlName, lastIp: urlIp, lastUpdate: lastUpdate, domains: {} };

    // Saving the data
    fs.mkdirSync('./data', { recursive: true });
    fs.writeFileSync('./data/config.json', JSON.stringify(data, null, 2), 'utf-8');
    console.log('JSON data updated successfully:', data);

    // Sending the response
    res.write("OK \n" + urlName + " host is added with following id: \n" + hostId);
    res.end();
});

// Get specific dynamic host
// Example url: http://localhost:8080/api/host/e31d41bedbe94f74abf56e0c558f25d3?session=1234
router.get('/host/:hostId', (req, res) => {
    // Extracting the data from the app.locals
    const data = req.app.locals.data;
    var ddnss = data.ddnss;
    var hosts = data.hosts;

    // Extracting the lower case url parameters
    var q = url.parse(req.url.toLowerCase(), true).query;
    var urlHostId = req.params.hostId;
    var urlSession = q.session;

    // Nothing to do if session is not provided
    if (!urlSession) {
        res.write("Error \n" + "No session provided.");
        res.end();
        return;
    }

    // Nothing to do if session is not valid
    if (req.app.locals.session != urlSession) {
        res.write("Error \n" + "Invalid session.");
        res.end();
        return;
    }

    // Finding the host
    const host = hosts[urlHostId];

    // Nothing to do if the host is not found
    if (!host) {
        res.write("Error \n" + "Host not found.");
        res.end();
        return;
    }

    // Sending the response
    res.write("OK \n" + JSON.stringify(host));
    res.end();
});

// Update host information
// Example url: http://localhost:8080/api/host/e31d41bedbe94f74abf56e0c558f25d3/update?session=1234&name=host1&ip=1.1.1.1
router.get('/host/:hostId/update', (req, res) => {
    // Extracting the data from the app.locals
    const data = req.app.locals.data;
    var ddnss = data.ddnss;
    var hosts = data.hosts;

    // Extracting the lowercase url parameters
    var q = url.parse(req.url.toLowerCase(), true).query;
    var urlIp = q.ip;
    var urlSession = q.session;
    var hostId = req.params.hostId;

    // Extracting the case sensitive url parameters
    var q = url.parse(req.url, true).query;
    var urlName = q.name;

    // Nothing to do if session is not provided
    if (!urlSession) {
        res.write("Error \n" + "No session provided.");
        res.end();
        return;
    }

    // Nothing to do if session is not valid
    if (req.app.locals.session != urlSession) {
        res.write("Error \n" + "Invalid session.");
        res.end();
        return;
    }

    // Getting the host information
    var host = hosts[hostId];

    // Nothing to do if the host is not found
    if (!host) {
        res.write("Error \n" + "Host not found.");
        res.end();
        return;
    }

    // Setting the name to current name if not provided
    if (!urlName)
        urlName = host.name;

    // Setting the IP to current IP if not provided
    if (!urlIp)
        urlIp = host.lastIp;

    // Updating the host
    host.name = urlName;
    host.lastIp = urlIp;

    // Saving the data
    fs.mkdirSync('./data', { recursive: true });
    fs.writeFileSync('./data/config.json', JSON.stringify(data, null, 2), 'utf-8');
    console.log('JSON data updated successfully:', data);

    // Sending the response
    res.write("OK \n" + urlName + " host is updated.");
    res.end();
});

// Delete host
// Example url: http://localhost:8080/api/host/e31d41bedbe94f74abf56e0c558f25d3/delete?session=1234
router.get('/host/:hostId/delete', (req, res) => {
    // Extracting the data from the app.locals
    const data = req.app.locals.data;
    var ddnss = data.ddnss;
    var hosts = data.hosts;

    // Extracting the lower case url parameters
    var q = url.parse(req.url.toLowerCase(), true).query;
    var urlSession = q.session;
    var hostId = req.params.hostId;

    // Nothing to do if session is not provided
    if (!urlSession) {
        res.write("Error \n" + "No session provided.");
        res.end();
        return;
    }

    // Nothing to do if session is not valid
    if (req.app.locals.session != urlSession) {
        res.write("Error \n" + "Invalid session.");
        res.end();
        return;
    }

    // Getting the host information
    var host = hosts[hostId];

    // Nothing to do if the host is not found
    if (!host) {
        res.write("Error \n" + "Host not found.");
        res.end();
        return;
    }

    // Storing the host name
    var name = host.name;

    // Deleting the host
    delete hosts[hostId];

    // Saving the data
    fs.mkdirSync('./data', { recursive: true });
    fs.writeFileSync('./data/config.json', JSON.stringify(data, null, 2), 'utf-8');
    console.log('JSON data updated successfully:', data);

    // Sending the response
    res.write("OK \n" + name + " host is deleted.");
    res.end();
});

/////////////////////////////////////////////////////////////
// This section is the API for managing domain entries of a host.
// Add new domain to host
// Example url: http://localhost:8080/api/host/e31d41bedbe94f74abf56e0c558f25d3/domain/add?session=1234&domain=example.com&ddns=0&updateUrl=http://optional.com/update&user=optionalUser&pass=optionalPass
router.get('/host/:hostId/domain/add', (req, res) => {
    // Extracting the data from the app.locals
    const data = req.app.locals.data;
    var ddnss = data.ddnss;
    var hosts = data.hosts;

    // Extracting the lower case url parameters
    var q = url.parse(req.url.toLowerCase(), true).query;
    var urlHostId = req.params.hostId;
    var urlDomain = q.domain;
    var urlDdns = q.ddns;
    var urlUpdateUrl = q.updateurl;
    var urlSession = q.session;

    // Extracting the case sensitive url parameters
    var q = url.parse(req.url, true).query;
    var urlUser = q.user;
    var urlPass = q.pass;

    // Nothing to do if session is not provided
    if (!urlSession) {
        res.write("Error \n" + "No session provided.");
        res.end();
        return;
    }

    // Nothing to do if session is not valid
    if (req.app.locals.session != urlSession) {
        res.write("Error \n" + "Invalid session.");
        res.end();
        return;
    }

    // Getting the host information
    var host = hosts[urlHostId];

    // Nothing to do if the host is not found
    if (!host) {
        res.write("Error \n" + "Host not found.");
        res.end();
        return;
    }

    // Nothing to do if domain is not provided
    if (!urlDomain) {
        res.write("Error \n" + "No domain provided.");
        res.end();
        return;
    }

    // Nothing to do if ddns index is not provided
    if (!urlDdns) {
        res.write("Error \n" + "No ddns index provided.");
        res.end();
        return;
    }

    // Nothing to do if the domain already exists
    if (host.domains[urlDomain]) {
        res.write("Error \n" + "Domain already exists.");
        res.end();
        return;
    }

    // Setting the update url to null if not provided
    if (!urlUpdateUrl)
        urlUpdateUrl = null;

    // Setting the user to null if not provided
    if (!urlUser)
        urlUser = null;

    // Setting the pass to null if not provided
    if (!urlPass)
        urlPass = null;

    // Adding the new domain
    host.domains[urlDomain] = { ddns: urlDdns, updateUrl: urlUpdateUrl, authorization: { user: urlUser, pass: urlPass } };

    // Saving the data
    fs.mkdirSync('./data', { recursive: true });
    fs.writeFileSync('./data/config.json', JSON.stringify(data, null, 2), 'utf-8');
    console.log('JSON data updated successfully:', data);

    // Sending the response
    res.write("OK \n" + urlDomain + " domain is added to " + host.name + " host.");
    res.end();
});

// Get specific domain from a host
// Example url: http://localhost:8080/api/host/e31d41bedbe94f74abf56e0c558f25d3/domain/example.com?session=1234
router.get('/host/:hostId/domain/:domain', (req, res) => {
    // Extracting the data from the app.locals
    const data = req.app.locals.data;
    var ddnss = data.ddnss;
    var hosts = data.hosts;

    // Extracting the lower case url parameters
    var q = url.parse(req.url.toLowerCase(), true).query;
    var urlHostId = req.params.hostId;
    var urlDomain = req.params.domain;
    var urlSession = q.session;

    // Nothing to do if session is not provided
    if (!urlSession) {
        res.write("Error \n" + "No session provided.");
        res.end();
        return;
    }

    // Nothing to do if session is not valid
    if (req.app.locals.session != urlSession) {
        res.write("Error \n" + "Invalid session.");
        res.end();
        return;
    }

    // Getting the host information
    var host = hosts[urlHostId];

    // Nothing to do if the host is not found
    if (!host) {
        res.write("Error \n" + "Host not found.");
        res.end();
        return;
    }

    // Finding the domain
    const domain = host.domains[urlDomain];

    // Nothing to do if the domain is not found
    if (!domain) {
        res.write("Error \n" + "Domain not found.");
        res.end();
        return;
    }

    // Sending the response
    res.write("OK \n" + urlDomain + "\n" + JSON.stringify(domain));
    res.end();
});

// Update domain information of a host
// Example url: http://localhost:8080/api/host/e31d41bedbe94f74abf56e0c558f25d3/domain/example.com/update?session=1234&ddns=0&updateUrl=http://optional.com/update&user=optionalUser&pass=optionalPass
router.get('/host/:hostId/domain/:domain/update', (req, res) => {
    // Extracting the data from the app.locals
    const data = req.app.locals.data;
    var ddnss = data.ddnss;
    var hosts = data.hosts;

    // Extracting the lower case url parameters
    var q = url.parse(req.url.toLowerCase(), true).query;
    var urlHostId = req.params.hostId;
    var urlDomain = req.params.domain;
    var urlDdns = q.ddns;
    var urlUpdateUrl = q.updateurl;
    var urlSession = q.session;

    // Extracting the case sensitive url parameters
    q = url.parse(req.url, true).query;
    var urlUser = q.user;
    var urlPass = q.pass;

    // Nothing to do if session is not provided
    if (!urlSession) {
        res.write("Error \n" + "No session provided.");
        res.end();
        return;
    }

    // Nothing to do if session is not valid
    if (req.app.locals.session != urlSession) {
        res.write("Error \n" + "Invalid session.");
        res.end();
        return;
    }

    // Getting the host information
    var host = hosts[urlHostId];

    // Nothing to do if the host is not found
    if (!host) {
        res.write("Error \n" + "Host not found.");
        res.end();
        return;
    }

    // Nothing to do if domain is not provided
    if (!urlDomain) {
        res.write("Error \n" + "No domain provided.");
        res.end();
        return;
    }

    // Finding the domain
    const domain = host.domains[urlDomain];

    // Nothing to do if the domain is not found
    if (!domain) {
        res.write("Error \n" + "Domain not found.");
        res.end();
        return;
    }

    // Setting the ddns to current ddns if not provided
    if (!urlDdns)
        urlDdns = domain.ddns;
    else {
        // Nothing to do if urlDdns is out of ddnss range
        var ddns = Number(urlDdns);
        if (ddns < 0 || ddns >= ddnss.length) {
            res.write("Error \n" + "Out of range DDNS index.");
            res.end();
            return;
        }
    }

    // Setting the update url to current update url if not provided
    if (!urlUpdateUrl)
        urlUpdateUrl = domain.updateUrl;

    // Setting the user to current user if not provided
    if (!urlUser)
        urlUser = domain.authorization.user;

    // Setting the pass to current pass if not provided
    if (!urlPass)
        urlPass = domain.authorization.pass;

    // Updating the domain
    host.domains[urlDomain] = { ddns: urlDdns, updateUrl: urlUpdateUrl, authorization: { user: urlUser, pass: urlPass } };

    // Saving the data
    fs.mkdirSync('./data', { recursive: true });
    fs.writeFileSync('./data/config.json', JSON.stringify(data, null, 2), 'utf-8');
    console.log('JSON data updated successfully:', data);

    // Sending the response
    res.write("OK \n" + urlDomain + " domain is updated.");
    res.end();
});

// Delete domain from a host
// Example url: http://localhost:8080/api/host/e31d41bedbe94f74abf56e0c558f25d3/domain/example.com/delete?session=1234
router.get('/host/:hostId/domain/:domain/delete', (req, res) => {
    // Extracting the data from the app.locals
    const data = req.app.locals.data;
    var ddnss = data.ddnss;
    var hosts = data.hosts;

    // Extracting the lower case url parameters
    var q = url.parse(req.url.toLowerCase(), true).query;
    var urlHostId = req.params.hostId;
    var urlDomain = req.params.domain;
    var urlSession = q.session;

    // Nothing to do if session is not provided
    if (!urlSession) {
        res.write("Error \n" + "No session provided.");
        res.end();
        return;
    }

    // Nothing to do if session is not valid
    if (req.app.locals.session != urlSession) {
        res.write("Error \n" + "Invalid session.");
        res.end();
        return;
    }

    // Getting the host information
    var host = hosts[urlHostId];

    // Nothing to do if the host is not found
    if (!host) {
        res.write("Error \n" + "Host not found.");
        res.end();
        return;
    }

    // Finding the domain
    const domain = host.domains[urlDomain];

    // Nothing to do if the domain is not found
    if (!domain) {
        res.write("Error \n" + "Domain not found.");
        res.end();
        return;
    }

    // Deleting the domain
    delete host.domains[urlDomain];

    // Saving the data
    fs.mkdirSync('./data', { recursive: true });
    fs.writeFileSync('./data/config.json', JSON.stringify(data, null, 2), 'utf-8');
    console.log('JSON data updated successfully:', data);

    // Sending the response
    res.write("OK \n" + urlDomain + " domain is deleted from " + host.name + " host.");
    res.end();
});

module.exports = router;
