'use strict';
var express = require('express');
var router = express.Router();

/* GET index page. */
router.get('/', function (req, res) {
    // Extracting the data from the app.locals
    const data = req.app.locals.data;

    res.render('index', { title: 'DDNS Updater', data: data });
});

/* GET DDNSs page. */
// Example url: http://localhost:8080/ddnss?session=[session]
router.get('/ddnss', function (req, res) {
    // Extracting the data from the app.locals
    const data = req.app.locals.data;
    const session = req.query.session;

    // If the session is not provided, redirect to the index page
    if (!session) {
        res.redirect('/');
        return;
    }

    // If the session is not valid, redirect to the index page
    if (session != req.app.locals.session) {
        req.app.locals.session = null;
        res.redirect('/');
        return;
    }

    res.render('ddnss', { title: 'DDNS Updater - DDNSs', focusedSection: "DDNSs", data: data, session: session });
});

/* GET DDNS add or edit page. */
// Example url: http://localhost:8080/ddnss/[action]?session=[session]&index=[index]
router.get('/ddnss/:action', function (req, res) {
    // Extracting the data from the app.locals
    const data = req.app.locals.data;
    const action = req.params.action;
    const urlSession = req.query.session;
    const urlIndex = req.query.index;

    // If the session is not provided, redirect to the index page
    if (!urlSession) {
        res.redirect('/');
        return;
    }

    // If the session is not valid, redirect to the index page
    if (urlSession != req.app.locals.session) {
        req.app.locals.session = null;
        res.redirect('/');
        return;
    }

    // If the action is not valid, redirect to the ddnss page
    if (action !== "add" && action !== "edit") {
        res.redirect('/ddnss');
        return;
    }

    // If the action is edit and the index is not provided, redirect to the ddnss page
    if (action === "edit" && !urlIndex) {
        res.redirect('/ddnss');
        return;
    }

    // If the action is edit and the index is not valid, redirect to the ddnss page
    if (action === "edit" && urlIndex >= data.ddnss.length) {
        res.redirect('/ddnss');
        return;
    }

    // Extracting page info
    var pageTitle = "DDNS Updater - Add DDNS";
    var ddnsIndex = -1;
    var ddnsName = "";
    var ddnsUpdateURL = "";
    var ddnsSettings = "";
    if (action == "edit") {
        pageTitle = "DDNS Updater - Update DDNS: " + data.ddnss[urlIndex].name;
        ddnsIndex = urlIndex;
        ddnsName = data.ddnss[urlIndex].name;
        ddnsUpdateURL = data.ddnss[urlIndex].updateUrl;
        ddnsSettings = data.ddnss[urlIndex].settings;
    }

    // Rendering the page
    res.render('item-ddns', { title: pageTitle, focusedSection: "DDNSs", session: urlSession, ddnsIndex: ddnsIndex, ddnsName: ddnsName, ddnsUpdateUrl: ddnsUpdateURL, ddnsSettings: ddnsSettings, action: action });
});

/* GET Hosts page. */
// Example url: http://localhost:8080/hosts?session=[session]
router.get('/hosts', function (req, res) {
    // Extracting the data from the app.locals
    const data = req.app.locals.data;
    const session = req.query.session;

    // If the session is not provided, redirect to the index page
    if (!session) {
        res.redirect('/');
        return;
    }

    // If the session is not valid, redirect to the index page
    if (session != req.app.locals.session) {
        req.app.locals.session = null;
        res.redirect('/');
        return;
    }

    res.render('hosts', { title: 'DDNS Updater - Hosts', focusedSection: "Hosts", data: data });
});

/* GET host add or edit page. */
// Example url: http://localhost:8080/hosts/[action]?session=[session]&host=[host]
router.get('/hosts/:action', function (req, res) {
    // Extracting the data from the app.locals
    const data = req.app.locals.data;
    const action = req.params.action;
    const urlSession = req.query.session;
    const urlHost = req.query.host;

    // If the session is not provided, redirect to the index page
    if (!urlSession) {
        res.redirect('/');
        return;
    }

    // If the session is not valid, redirect to the index page
    if (urlSession != req.app.locals.session) {
        req.app.locals.session = null;
        res.redirect('/');
        return;
    }

    // If the action is not valid, redirect to the ddnss page
    if (action !== "add" && action !== "edit") {
        res.redirect('/ddnss');
        return;
    }

    // If the action is edit and the host is not provided, redirect to the hosts page
    if (action === "edit" && !urlHost) {
        res.redirect('/hosts');
        return;
    }

    // If the action is edit and the hash is not valid, redirect to the hosts page
    if (action === "edit" && !data.hosts.hasOwnProperty(urlHost)) {
        res.redirect('/hosts');
        return;
    }

    // Extracting page info
    var pageTitle = "DDNS Updater - Add Host";
    var hostId = null;
    var hostName = "";
    var hostIp = "";
    var hostLastUpdate = "No update so far";
    var hostLocalUpdateUrl = "The local update URL will be generated after the host is created.";
    var hostPublicUpdateUrl = "The public update URL will be generated after the host is created.";
    if (action == "edit") {
        pageTitle = "DDNS Updater - Update Host: " + data.hosts[urlHost].name;
        hostId = urlHost;
        hostName = data.hosts[urlHost].name;
        hostIp = data.hosts[urlHost].lastIp;
        hostLocalUpdateUrl = data.localUrl + "/api/update?host=" + hostId + "&ip=<ip>";
        hostPublicUpdateUrl = data.publicUrl + "/api/update?host=" + hostId + "&ip=<ip>";

        // Extracting the last update time
        if (data.hosts[urlHost].lastUpdate) {
            const date = new Date(data.hosts[urlHost].lastUpdate);
            hostLastUpdate = date.toLocaleString();
        }
    }

    // Rendering the page
    res.render('item-host', { title: pageTitle, focusedSection: "Hosts", session: urlSession, hostId: hostId, hostName: hostName, hostIp: hostIp, hostLastUpdate: hostLastUpdate, hostLocalUpdateUrl: hostLocalUpdateUrl, hostPublicUpdateUrl: hostPublicUpdateUrl, action: action });
});

/* GET Host page. */
// Example url: http://localhost:8080/host/[host]?session=[session]
router.get('/host/:name', function (req, res) {
    // Extracting the data from the app.locals
    const data = req.app.locals.data;
    const session = req.query.session;

    // If the session is not provided, redirect to the index page
    if (!session) {
        res.redirect('/');
        return;
    }

    // If the session is not valid, redirect to the index page
    if (session != req.app.locals.session) {
        req.app.locals.session = null;
        res.redirect('/');
        return;
    }

    // Extracting the host name from the URL
    var name = req.params.name;

    // Finding the host data
    let focusedHost = null;
    var hostId = null;
    for (const id in data.hosts) {
        if (data.hosts[id].name === name) {
            focusedHost = data.hosts[id];
            hostId = id;
            break;
        }
    }

    res.render('host', { title: 'DDNS Updater - Host: ' + name, focusedSection: "Host: " + name, data: data, focusedHost: focusedHost, hostId: hostId });
});

/* GET domain add or edit page. */
// Example url: http://localhost:8080/host/[hostId]/domains/[action]?session=[session]&domain=[domain]
router.get('/host/:hostId/domains/:action', function (req, res) {
    // Extracting the data from the app.locals
    const data = req.app.locals.data;
    const hostId = req.params.hostId;
    const action = req.params.action;
    const urlSession = req.query.session;
    const urlDomain = req.query.domain;

    // If the session is not provided, redirect to the index page
    if (!urlSession) {
        res.redirect('/');
        return;
    }

    // If the session is not valid, redirect to the index page
    if (urlSession != req.app.locals.session) {
        req.app.locals.session = null;
        res.redirect('/');
        return;
    }

    // Check the validity of the hostId
    if (!data.hosts.hasOwnProperty(hostId)) {
        res.redirect('/hosts');
        return;
    }

    // If the action is not valid, redirect to the host page
    if (action !== "add" && action !== "edit") {
        res.redirect('/host/' + data.hosts[hostId].name);
        return;
    }

    // If the action is edit and the domain is not provided, redirect to the host page
    if (action === "edit" && !urlDomain) {
        res.redirect('/host/' + data.hosts[hostId].name);
        return;
    }

    // If the action is edit and the hash is not valid, redirect to the hosts page
    if (action === "edit" && !data.hosts[hostId].domains.hasOwnProperty(urlDomain)) {
        res.redirect('/hosts' + data.hosts[hostId].name);
        return;
    }

    // Extracting page info
    var pageTitle = "DDNS Updater - Add Domain";
    var hostName = data.hosts[hostId].name;
    var domainDDNSIndex = "";
    var domainDDNSName = "";
    var domainUpdateUrl = "";
    var domainUser = "";
    var domainPass = "";
    if (action == "edit") {
        pageTitle = "DDNS Updater - Update Domain: " + data.hosts[hostId].domains[urlDomain].name;
        domainDDNSIndex = data.hosts[hostId].domains[urlDomain].ddns;
        domainDDNSName = data.ddnss[data.hosts[hostId].domains[urlDomain].ddns].name;
        domainUpdateUrl = data.hosts[hostId].domains[urlDomain].updateUrl;
        domainUser = data.hosts[hostId].domains[urlDomain].authorization.user;
        domainPass = data.hosts[hostId].domains[urlDomain].authorization.pass;
    }

    // Rendering the page
    res.render('item-domain', { title: pageTitle, focusedSection: "Host: " + hostName, session: urlSession, hostId: hostId, hostName: hostName, domain: urlDomain, domainDDNSIndex: domainDDNSIndex, domainDDNSName: domainDDNSName, domainUpdateUrl: domainUpdateUrl, domainUser: domainUser, domainPass: domainPass, data: data, action: action });
});

/* GET Settings page. */
// Example url: http://localhost:8080/settings?session=[session]
router.get('/settings', function (req, res) {
    // Extracting the data from the app.locals
    const data = req.app.locals.data;
    const session = req.query.session;

    // If the session is not provided, redirect to the index page
    if (!session) {
        res.redirect('/');
        return;
    }

    // If the session is not valid, redirect to the index page
    if (session != req.app.locals.session) {
        req.app.locals.session = null;
        res.redirect('/');
        return;
    }

    res.render('settings', { title: 'DDNS Updater - Settings', focusedSection: "Settings", data: data, session: session });
});

module.exports = router;
