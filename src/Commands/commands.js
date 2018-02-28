var powerCommands = {
    halt: {
        command: ['halt'],
        sudo: true
    },
    shutdown: {
        command: ['shutdown', '-h'],
        sudo: true
    },
    restart: {
        command: ['shutdown', '-r'],
        sudo: true
    }, 
    sleep: {
        command: ['pmset', 'sleepnow'],
        sudo: false
    },
    displaySleep: {
        command: ['pmset', 'displaysleepnow'],
        sudo: false
    },
    logout: {
        command: ['osascript', 'src/Commands/AppleScripts/logout.scpt'],
        sudo: false
    }
}

module.exports = {
    power: powerCommands
}