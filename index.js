var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()

// process.env.PWD = process.cwd()

// for image
// app.use(express.static(process.env.PWD + '/public'));


// server 
app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a parrot chat bot for HNG7')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'HNG_Internship') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})


// API End Point - added by Stefan

app.post('/webhook/', function (req, res) {
    messaging_events = req.body.entry[0].messaging
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i]
        sender = event.sender.id
        if (event.message && event.message.text) {
            text = event.message.text
            if (text === 'HNG7') {
                sendGenericMessage(sender)
                continue
            }
            sendTextMessage(sender, "parrot: " + text.substring(0, 200))
        }
        if (event.postback) {
            text = JSON.stringify(event.postback)
            sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
            continue
        }
    }
    res.sendStatus(200)
})

var token = "EAAHxihjsn3gBANEZBPwyJdAteC5kxQPogZBxeR6eFezT4GPPgqBOJJXmu54dlv3UzvPOpPJEVEqhSpIjQUWcFNP67gd0xZBXOVRRkqTcirn802dtK51pZBQL3ETVjubZBiDEIi1AsJdbYo4I9j8fAHFq0FBflDwsMHJVl3eBe5wZDZD"

// function to echo back messages

function sendTextMessage(sender, text) {
    messageData = {
        text:text
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}


// Send an test message back as two cards.

function sendGenericMessage(sender) {
    messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "HNG Community",
                    "subtitle": "Communities to Follow",
                 //   "image_url": "<img src="/main.jpg" />",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://www.facebook.com/HNG-Internship-115577009820117/",
                        "title": "FB HNG Page"
                    }, {
                        "type": "web_url",
                        "url": "https://twitter.com/hnginternship/",
                        "title": "HNG on Twitter"
                    },{
                        "type": "web_url",
                        "url": "mailto:hngi7@hng.tech",
                        "title": "Email us HNG"
                    }],
                }, {
                    "title": "Learn on Internship",
                    "subtitle": "Ask anything on our internships",
               //     "image_url": "<img src="/main2.jpg" />",
                    "buttons": [{
                        "type": "postback",
                        "title": "What's the benefit?",

                        "payload": "During the course of the internship, you will be introduced to different projects to work on. These projects could be added to your portfolio as quality samples to put you ahead of the competition when job hunting",
                    },{
                        "type": "postback",
                        "title": "Remote Learning",
                        "payload": "Our aim is to help everyone willing to kick-start a career in tech without distance being a barrier. We have made our internship flexible to accommodate you regardless of your location or timezone",
                    }, {
                        "type": "postback",
                        "title": "The Future",
                        "payload": "The HNG Internship is an ambitious attempt to change the way education is done in Africa. It’s the bridge between learning to code and becoming the best in the world.",
                    }],
                },  {
                    "title": "Become an Intern",
                    "subtitle": "How does it work",
         //           "image_url": "http://www.brandknewmag.com/wp-content/uploads/2015/12/cortana.jpg",
                    "buttons": [{
                        "type": "postback",
                        "title": "Applyto be an intern",
                        "payload": "The HNG internship is a 3-month remote internship designed to find and develop the most talented software developers. Everyone is welcomed to participate (there is no entrance exam). Anyone can log into the internship using their laptop. Each week we give tasks!",
                    },{
                        "type": "postback",
                        "title": "Onboard team ",
                        "payload": "Join one of the best remote learning opportunities in tech by signing up with us. Expand your knowledge with new challenging tasks and kick-start your career in tech. This is also a chance to connect with valuable and efficient teammates across the globe from the comfort of your home.",
                    }, {
                        "type": "postback",
                        "title": "Products and Services",
                        "payload": "Throughout the internship, you will work on scalable products. This will give you an insight into real-world projects and prepare you for more challenging tasks as you take on real-time jobs after the internship!",
                    }],
                }]  
            } 
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

