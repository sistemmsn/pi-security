# PI-Security

## Introduction
PI-Security is a full stack security solution that utilizes a Raspberry Pi to monitor a space by using both an IR motion sensor and a Raspicam. You are required to use Firebase as the database and serverless backend, Ionic for the frontend and AngularFire to bootstrap the entire project. 

## Getting Started
There are three modules in this application that require packages and some configuration information. You'll first need to have [NodeJS](nodejs.org) and [Ionic](ionic.io) installed globally.
```sh
$ cd client && npm install
$ cd server && npm install
$ cd server/functions && npm install
```
 NOTE: running `npm install` in the server directory on a non-GPIO enabled device will make the command break. 
 
 The server module requires some config parameters that can be stored in a `.env` file, refer to the `.env-temp` file for the required fields. Some features on the server module requires that there be a `service_account.json` file that google provides when creating a new service account under the Service Accounts tab in Firebase project settings.

## Run and Deploy
- To build and run the client side, `ionic serve -l` will do the trick. Visit [Ionic](ionic.io) for more information 
- To run the server side, `node index.js` will do the trick.
	- Sometimes you might want the program to run headlessly i.e without a terminal window open, `nohup node index.js & ` will give you that functionality. `nohup` keeps the terminal running even after logout and `&` just makes the job persistent in the background.
- To deploy the Firebase Cloud Functions, in the functions folder, run `firebase deploy --only functions`

## Features
- [ ] Detect motion and take image
- [ ] Enable/Disable Surveillance
- [ ] Enable/Disable Dark Hours (for lighting)
- [ ] Get properties of objects in image

## Coming Soon
- [ ] Object Analytics
	- [ ] Frequency of room entry
	- [ ] Object last location  

## Contributors
Tobi Akerele [@tobidae](https://tobiak.com) (contact@tobiak.com)
 
