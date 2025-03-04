# DDNS Updater
The DDNS Updater project helps you to update your dynamic domain name servers upon IP changes in your network. The main component of the project is DDNSU WebService. DDNSU WebService is a dynamic domain name service (DDNS) updater that allows you to manage and update the IP addresses of your dynamic domains. This service is designed to work with multiple DDNS providers and supports user and domain management.

## Table of Contents
- [Definitions](#definitions)
- [Screenshots](#screenshots)
- [Default Password](#default-password)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
  - [Update IP of a Host](#update-ip-of-a-host)
  - [User Management](#user-management)
  - [DDNS Management](#ddns-management)
  - [Host Management](#host-management)
  - [Domain Management](#domain-management)

## Definitions
- **Dynamic Domain**: A domain name that is updated with a new IP address when the IP address changes.
- **Dynamic Domain Name Service (DDNS)**: A service that provides dynamic domain names.
- **DDNSs**: A list of dynamic domain name service providers.
- **Host**: A host with a dynamic IP which can contain several dynamic domains sharing the same IP address.

## Screenshots
This section contains the screenshots of the DDNSU WebService.
### Login Page
Login to the DDNSU WebService with the default password. The default password is `password`.
![Login page](https://github.com/alixide/DDNS_Updater/blob/master/DDNSU_WebService/screenshots/index.png)
### DDNSs List Page
The DDNSs list page shows the list of DDNS service providers. Here you can add new DDNS service providers, update existing ones, and delete them.
![DDNSs List page](https://github.com/alixide/DDNS_Updater/blob/master/DDNSU_WebService/screenshots/ddnss.png)
### DDNS Item Page
This page shows the details of a DDNS service provider. Here you can update the DDNS service provider.
![DDNS Item page](https://github.com/alixide/DDNS_Updater/blob/master/DDNSU_WebService/screenshots/item-ddns.png)
### Hosts List Page
The Hosts list page shows the list of host groups. Here you can add new host groups, update existing ones, and delete them.
![Hosts List page](https://github.com/alixide/DDNS_Updater/blob/master/DDNSU_WebService/screenshots/hosts.png)
### Host Item Page
This page shows the details of a host group. Here you can update the host group.
![Host Item page](https://github.com/alixide/DDNS_Updater/blob/master/DDNSU_WebService/screenshots/item-host.png)
### Host's Domain List Page
The Host's Domain List page shows the list of domains that belong to a host group. Here you can add new domains, update existing ones, and delete them.
![Host's Domain List page](https://github.com/alixide/DDNS_Updater/blob/master/DDNSU_WebService/screenshots/host.png)
### Domain Item Page
This page shows the details of a domain that belongs to a host group. Here you can update the domain.
![Domain Item page](https://github.com/alixide/DDNS_Updater/blob/master/DDNSU_WebService/screenshots/item-domain.png)
### Settings Page
The Settings page shows the settings of the DDNSU WebService. Here you can change the password of the DDNSU WebService.
![Settings page](https://github.com/alixide/DDNS_Updater/blob/master/DDNSU_WebService/screenshots/settings.png)

## Default Password
The default password of the DDNSU WebService is `password`.

## Configuration
To initialize the DDNSU WebService, create a `config.json` file with the following path `./data/config.json`. Update the values and remove the comments before using this template.

```json
{
  "localUrl": "http://localhost:8080",
  "publicUrl": "http://example.com",
  "ddnss": [
    {
      "name": "ddns1",
      "updateUrl": "http://www.ddns-1.com/update?...",
      "settings": null
    },
    {
      "name": "ddns2",
      "updateUrl": "http://www.ddns-2.com/update?...",
      "settings": null
    }
  ],
  "hosts": {
    "e31d41bedbe94f74abf56e0c558f25d3": {
      "name": "host1",
      "lastIp": null,
      "lastUpdate": 0,
      "domains": {
        "domain-1.com": {
          "ddns": 0,
          "updateUrl": null,
          "authorization": {
            "user": "username",
            "pass": "password"
          }
        },
        "domain-2.com": {
          "ddns": 0,
          "updateUrl": null,
          "authorization": {
            "user": "username",
            "pass": "password"
          }
        }
      }
    },
    "d94d69713f6142e287a9d392e15258c1": {
      "name": "host2",
      "lastIp": null,
      "lastUpdate": 0,
      "domains": {
        "domain-3.com": {
          "ddns": 0,
          "updateUrl": null,
          "authorization": {
            "user": "username",
            "pass": "password"
          }
        },
        "domain-4.com": {
          "ddns": 1,
          "updateUrl": null,
          "authorization": {
            "user": "username",
            "pass": "password"
          }
        }
      }
    }
  }
}
```

### Configuration Components
- **localUrl**: The local URL of the DDNSU WebService.
- **publicUrl**: The public URL of the DDNSU WebService.
- **ddnss**: List of dynamic domain name service providers.
  - **name**: The name of the DDNS service provider.
  - **updateUrl**: The URL to update the IP address of the domain.
  - **settings**: Custom settings for the GET call.
- **hosts**: List of hosts.
  - **name**: The name of the host group.
  - **lastIp**: The last IP address that was updated. Leave this null.
  - **lastUpdate**: The last time the IP address was updated. Leave this 0.
  - **domains**: List of domains that belong to the host group.
    - **ddns**: The index of the DDNS service provider in the ddnss list.
    - **updateUrl**: The URL to update the IP address of the domain.
    - **authorization**: The user and password to authenticate the update call.

## API Documentation
This section documents the API endpoints of the DDNSU WebService.

### Update IP of a Host
#### Update IP
This endpoint updates the IP address of a host.
- **Method**: GET
- **URL**: `/api/update?host=<host>&ip=<ip>`
- **Parameters**:
  - **host**: The dynamic host id.
  - **ip**: The new IP address of the host.

### User Management
#### Login
This endpoint logs in a user.
- **Method**: GET
- **URL**: `/api/login?secret=<secret>`
- **Parameters**:
  - **secret**: The MD5 hashed password of the user.

#### Logout
This endpoint logs out a user.
- **Method**: GET
- **URL**: `/api/logout?session=<session>`
- **Parameters**:
  - **session**: The session id of the user.

#### Change Password
This endpoint changes the password of a user.
- **Method**: GET
- **URL**: `/api/secret/change?session=<session>&oldSecret=<oldSecret>&newSecret=<newSecret>`
- **Parameters**:
  - **session**: The session id of the user.
  - **oldSecret**: The MD5 hashed old password of the user.
  - **newSecret**: The MD5 hashed new password of the user.

### DDNS Management
#### Add a DDNS
This endpoint adds a DDNS service provider.
- **Method**: GET
- **URL**: `/api/ddns/add?session=<session>&name=<name>&updateUrl=<updateUrl>&settings=<settings>`
- **Parameters**:
  - **session**: The session id of the user.
  - **name**: The name of the DDNS service provider.
  - **updateUrl**: The URL to update the IP address of the domain.
  - **settings**: Custom settings for the GET call.

#### Get a DDNS
This endpoint gets a DDNS service provider.
- **Method**: GET
- **URL**: `/api/ddns/<ddns>?session=<session>`
- **Parameters**:
  - **ddns**: The index of the DDNS service provider in the ddnss list.
  - **session**: The session id of the user.

#### Update a DDNS
This endpoint updates a DDNS service provider.
- **Method**: GET
- **URL**: `/api/ddns/<ddns>/update?session=<session>&name=<name>&updateUrl=<updateUrl>&settings=<settings>`
- **Parameters**:
  - **ddns**: The index of the DDNS service provider in the ddnss list.
  - **session**: The session id of the user.
  - **name**: The name of the DDNS service provider.
  - **updateUrl**: The URL to update the IP address of the domain.
  - **settings**: Custom settings for the GET call.

#### Delete a DDNS
This endpoint deletes a DDNS service provider.
- **Method**: GET
- **URL**: `/api/ddns/<ddns>/delete?session=<session>`
- **Parameters**:
  - **ddns**: The index of the DDNS service provider in the ddnss list.
  - **session**: The session id of the user.

### Host Management
#### Add a Host
This endpoint adds a host.
- **Method**: GET
- **URL**: `/api/host/add?session=<session>&name=<name>&ip=<ip>`
- **Parameters**:
  - **session**: The session id of the user.
  - **name**: The name of the host group.
  - **ip**: The IP address of the host.

#### Get a Host
This endpoint gets a host.
- **Method**: GET
- **URL**: `/api/host/<host>?session=<session>`
- **Parameters**:
  - **host**: The dynamic host id.
  - **session**: The session id of the user.

#### Update a Host
This endpoint updates a host.
- **Method**: GET
- **URL**: `/api/host/<host>/update?session=<session>&name=<name>&ip=<ip>`
- **Parameters**:
  - **host**: The dynamic host id.
  - **session**: The session id of the user.
  - **name**: The name of the host group.
  - **ip**: The IP address of the host.

#### Delete a Host
This endpoint deletes a host.
- **Method**: GET
- **URL**: `/api/host/<host>/delete?session=<session>`
- **Parameters**:
  - **host**: The dynamic host id.
  - **session**: The session id of the user.

### Domain Management
#### Add a Domain
This endpoint adds a domain to a host.
- **Method**: GET
- **URL**: `/api/host/<host>/domain/add?session=<session>&domain=<domain>&ddns=<ddns>&updateUrl=<updateUrl>&user=<user>&pass=<pass>`
- **Parameters**:
  - **host**: The dynamic host id.
  - **session**: The session id of the user.
  - **domain**: The name of the domain.
  - **ddns**: The index of the DDNS service provider in the ddnss list.
  - **updateUrl**: The URL to update the IP address of the domain.
  - **user**: The username to authenticate the update call.
  - **pass**: The password to authenticate the update call.

#### Get a Domain
This endpoint gets a domain of a host.
- **Method**: GET
- **URL**: `/api/host/<host>/domain/<domain>?session=<session>`
- **Parameters**:
  - **host**: The dynamic host id.
  - **domain**: The name of the domain.
  - **session**: The session id of the user.

#### Update a Domain
This endpoint updates a domain of a host.
- **Method**: GET
- **URL**: `/api/host/<host>/domain/<domain>/update?session=<session>&ddns=<ddns>&updateUrl=<updateUrl>&user=<user>&pass=<pass>`
- **Parameters**:
  - **host**: The dynamic host id.
  - **domain**: The name of the domain.
  - **session**: The session id of the user.
  - **ddns**: The index of the DDNS service provider in the ddnss list.
  - **updateUrl**: The URL to update the IP address of the domain.
  - **user**: The username to authenticate the update call.
  - **pass**: The password to authenticate the update call.

#### Delete a Domain
This endpoint deletes a domain of a host.
- **Method**: GET
- **URL**: `/api/host/<host>/domain/<domain>/delete?session=<session>`
- **Parameters**:
  - **host**: The dynamic host id.
  - **domain**: The name of the domain.
  - **session**: The session id of the user.

## Docker Container
The DDNSU WebService can be run as a Docker container. The Docker image of the DDNSU WebService is available on Docker Hub.
### Building Docker Image
To build the Docker image of the DDNSU WebService run the following command:
```bash
docker build -t ddnsu .
```
### Publishing Docker Image
To publish the Docker image of the DDNSU WebService to Docker Hub run the following command:
```bash
docker tag ddnsu <username>/ddnsu:v1.0.1
docker push <username>/ddnsu:v1.0.1
```
Also publish the Docker image of the DDNSU WebService to Docker Hub with the latest tag run the following command:
```bash
docker tag ddnsu <username>/ddnsu:latest
docker push <username>/ddnsu:latest
```
### Pulling Docker Image
To pull the Docker image of the DDNSU WebService from Docker Hub run the following command:
```bash
docker pull <username>/ddnsu:latest
```
### Running Docker Container
To run the Docker container of the DDNSU WebService run the following command:
```bash
docker run -d -p 8080:8080 --name ddnsu ddnsu
```
### Stopping Docker Container
To stop the Docker container of the DDNSU WebService run the following command:
```bash
docker stop ddnsu
```
### Removing Docker Container
To remove the Docker container of the DDNSU WebService run the following command:
```bash
docker rm ddnsu
```
### Removing Docker Image
To remove the Docker image of the DDNSU WebService run the following command:
```bash
docker rmi ddnsu
```
### Running Docker Container with Config File
To run the Docker container of the DDNSU WebService with a config file run the following command:
```bash
docker run -d -p 8080:8080 -v /path/to/config.json:/app/data/config.json --name ddnsu ddnsu
```
### Running Docker Container with Data Volume
To run the Docker container of the DDNSU WebService with a data volume run the following command:
```bash
docker run -d -p 8080:8080 -v ddnsu-data:/app/data --name ddnsu ddnsu
```
### Removing Data Volume
To remove the data volume of the DDNSU WebService run the following command:
```bash
docker volume rm ddnsu-data
```
### Defining docker-compose.yml File
Define the docker-compose.yml file with the following content:
```yaml
version: '3.8'
services:
  ddnsu:
    image: alixide/ddnsu:latest 
    ports:
      - "8080:8080"
    volumes:
      - ./data:/app/data
    environment:
      NODE_ENV: production
    restart: unless-stopped
```
### Running Docker Container with docker-compose.yml File
To run the Docker container of the DDNSU WebService with a docker-compose.yml file run the following command:
```bash
docker-compose up -d
```
Alternatively to run the Docker container of the DDNSU WebService with Docker Compose run the following command:
```bash
docker-compose -f docker-compose.yml up -d
```
### Stopping Docker Container with docker-compose.yml File
To stop the Docker container of the DDNSU WebService with a docker-compose.yml file run the following command:
```bash
docker-compose down
```
Alternatively to stop the Docker container of the DDNSU WebService with Docker Compose and remove the volume run the following command:
```bash
docker-compose down -v
```

