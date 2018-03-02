var router = require('../Services/RouterService').router

// define the home page route => /systemSpy
router.get('/', function (req, res) {
  res.send('System Spy')
})

router.get('/screenshot', function (req, res) {
    si.cpuTemperature(function(data) {
        res.status(200).send({responseMessage: "CPU Temperature", resonse: data})
    })
})

router.get('/screenRecord', function (req, res) {
    si.currentLoad(function(data) {
        res.status(200).send({responseMessage: "CPU Stats", resonse: data})
    })
})

router.get('/camRecord', function (req, res) {
    si.mem(function(data) {
        res.status(200).send({responseMessage: "Ram Stats", resonse: data})
    })
})

router.get('/alert', function (req, res) {
    si.fsSize(function(data) {
        res.status(200).send({responseMessage: "Storage Stats", resonse: data})
    })
})

router.get('/battery', function (req, res) {
    si.battery(function(data) {
        res.status(200).send({responseMessage: "Battery Stats", resonse: data})
    })
})


module.exports = router