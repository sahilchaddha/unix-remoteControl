# Unix Remote Control (IoT)

Runs Scripts on Mac/Linux remotely.

## Why :

I was setting up homebridge (iOS HomeKit Accesory Protocol) on my rasberryPi and after hooking up my IR Blaster, RF Transmitter and other wake-on-lan devices. I wanted my always-on OSX to also be remotely controlled by my iOS Device. So i ended up writing up a small plugin for [Homebridge](https://github.com/nfarina/homebridge) [plugin](https://github.com/sahilchaddha/homebridge-unixControl). 

I use this to play itunes, search google and bookmark search results, restart my system, get room temperature using MBP in-build Temp Sensor and adjust airconditioning accordingly, monitor my ec-2 instance stats, sync Spotify Playlist etc.

Homebridge Plugin => [homebridge-unixControl](https://github.com/sahilchaddha/homebridge-unixControl)

## How it Works :

This library is directly injected into homebridge with a plugin wrapper => [homebridge-unixControl](https://github.com/sahilchaddha/homebridge-unixControl)

The plugin queries the system using HTTP API and run shell scripts. The shell requires sudo access to shutdown/reboot the system. More commands can be easily be injected. Feel free to PR.

## Todo :

- [ ] Replace HTTP API with socket connection.
- [ ] Implement a working Example
- [ ] Publish to NPM
- [ ] Security Concerns


## Installation :

```
 $ git clone https://github.com/sahilchaddha/unix-remoteControl.git && cd unix-RemoteControl
 $ npm install
```

### Starting Server :

```
$ npm start
```

### Running Forever

```
 $ npm install -g forever
 $ forever start src/server.js
```

## Configuration :

Configuration containing sudo password, port number, logLevel & sessionToken are stored in `environment.js` in root/src.

Sample Configuration :

``` 
//environment.js
var env = {
    port: '3000',
    pass: 'lol', //sudo password TODO: Secure
    logLevel: 'info',
    sessionToken: 'f64f2940-fae4-11e7-8c5f-ef356f279131'
}

module.exports = env
```

### Config Parameters


| Fields             | Description                                           |
|--------------------|-------------------------------------------------------|
| port               | Port Number to run HTTP Server.                       |
| pass               | System Sudo Password                                  |
| logLevel           | Log Level (debug, info, error)                        |
| sessionToken       | Random Session Token for API Authentication.          |


**NOTE**: `sessionToken` needs to be set as Request Header `token`


## Usage :

After Running the server, You can request

`localhost:portNumber/commandType/command?queryParams`

e.g.


`localhost:3000/power/shutdown?time=10`


```
curl --header "token: f64f2940-fae4-11e7-8c5f-ef356f27913" localhost:3000/power/logout

curl --header "token: f64f2940-fae4-11e7-8c5f-ef356f27913" localhost:3000/power/restart?time=10

curl --header "token: f64f2940-fae4-11e7-8c5f-ef356f27913" localhost:3000/music/syncSpotify?destination=AppleMusic
```

## Sample Scripts/Commands : 

### Power Command Type 

Usage:- 

`localhost:3000/power/displaySleep`

`localhost:3000/power/restart?time=10`

| Command             | Method | Description                                           | Query Params | Sudo |
|--------------------|---------|-------------------------------------------------------|----------| ----- |
| /ping      | GET | Pings to get server state (on/off)         | None       | false |
| /halt           | POST | Shutdowns immediately & forcibly (Can cause data loss)                          | None      | true |
| /shutdown              | POST | Shut downs the system                                 | `time` : Delays Shutdown in minutes       | true |
| /restart           | POST | Restarts the system | `time` : Delays Shutdown in minutes      | true |
| /logout         | POST | Logs Out the user (OSX Only)                                  | None      | false |
| /sleep         | POST | Turns the System to Sleep                       | None       | false |
| /displaySleep        | POST | Turns the Display to Sleep                      | None       | false |
| /cancelShutdown        | POST | Cancels Scheduled Shutdown/Restart Task                      | None       | true |

### System Stats Command Type 

Usage:- 

`localhost:3000/systemStats/temperature`

`localhost:3000/systemStats/ram`

| Command             | Method | Description                                           | Query Params | Sudo |
|--------------------|---------|-------------------------------------------------------|----------| ----- |
| /temperature      | GET | Returns current Temperature of CPU         | None       | false |
| /cpuLoad           | GET | Returns current CPU Load                          | None      | false |
| /ram               | GET | Returns current Ram Status                                 | None       | false |
| /storage           | GET | Returns current Storage Stats | None      | false |
| /battery         | GET | Returns current Battery Information                                  | None      | false |

### Browser Command Type 

Usage:- 

`localhost:3000/browser/googleChromeReset `

| Command             | Method | Description                                           | Query Params | Sudo |
|--------------------|---------|-------------------------------------------------------|----------| ----- |
| /googleChromeReset      | POST | Clear all data of google chrome and reset         | None       | false |
| /safariClearHistory      | POST | Clear histroy of safari        | None       | false |

**NOTE**: For safariClearHistory you will have to add terminal or whatever command line tool you are using should be added in System Preferences -> Security & Privacy -> Privacy -> Accessibility. When you run this command for the first time there will a prompt to add command line tool in Accessibility.

### Wi-fi Command Type 

Usage:- 

`localhost:3000/wifi/on `

| Command             | Method | Description                                           | Query Params | Sudo |
|--------------------|---------|-------------------------------------------------------|----------| ----- |
| /on      | POST | Turn on wifi         | None       | false |
| /off      | POST | Turn off wifi        | None       | false |

### System Spy Command Type 

Usage:- 

`localhost:3000/systemSpy/screenshot`

`localhost:3000/systemSpy/camRecord`

| Command             | Method | Description                                           | Query Params | Sudo |
|--------------------|---------|-------------------------------------------------------|----------| ----- |
| /screenshot      | POST | Screenshots Current Screen, Saves & returns image (OSX Only)         | None       | false |
| /webcamCapture      | POST | Clicks Camera Still, Saves & returns image (OSX Only)         | None       | false |
| /screenRecord           | POST | Starts Screen Recording (OSX Only)                          | None      | false |
| /camRecord               | POST | Starts Camera Recording (OSX Only)                                 | None       | false |
| /alert           | POST | Shows Alert to User | None      | false |
| /isRecording         | GET | Returns Recording Status (OSX Only)                                  | `type` : `screen` or `cam` type of recording      | false |


### Todo Scripts :

- [X] Temperature & System Stats
- [X] Reset Google Chrome
- [ ] Reset Firefox
- [X] Reset Safari
- [ ] Music Playback (iTunes & Youtube)
- [ ] Screen, Webcam Recording & Screenshot, Show Alert


## Writing Custom Scripts :

Creating Your Router :

You can create your custom router inside `Routes` folder.

```
//DummyRouter.js
var router = require('../Services/RouterService').router // Use RouterService.router
var commandService = require('../Services/CommandService.js')

router.get('/hello', function (req, res) {
  res.send('Hello')
  // Run Your npm commands
  // or call Shell Scripts using Command Service

    commandService.execute('dummy', 'sayHello', options, function(){})
})

module.exports = router
```

Adding your Router to Valid Routes :

Add your custom router inside `routes.js`

```
var powerRouter = require('./Routes/PowerRouter.js')
var dummyRouter = require('./Routes/DummyRouter.js')

var routes = [
    {
        url: '/power',
        routerClass: powerRouter
    },
    {
        url: '/dummy',
        routerClass: dummyRouter
    }
]

module.exports = routes
```

Adding Your Shell Scripts :

You can use Command Service to execute commands : 

To add Commands, you can inject your commands inside `Commands/commands.js`

```
var dummyCommands = {
    sayHello: {
        command: ['say', 'hello'],
        sudo: false // Set as true if command need sudo access
    }
}

module.exports = {
    // power: powerCommands,
    dummy: dummyCommands
}
```


### Apple Scripts

Apple scripts in format `.scpt` are to be injected inside `AppleScripts` folder.

You can add command inside `commands.js` 

```
var dummyCommands = {
    sayHello: {
        command: ['say', 'hello'],
        sudo: false // Set as true if command need sudo access
    },
    runAppleScript: {
        command: ['osascript', 'src/Commands/AppleScripts/dummyAS.scpt'],
        sudo: false
    }
}

module.exports = {
    // power: powerCommands,
    dummy: dummyCommands
}
```


## Homebridge :

WIP

### Running Forever on Rasberry Pi

WIP