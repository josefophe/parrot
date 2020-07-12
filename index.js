var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()

var admin = require('firebase-admin');

var refreshToken; 



// Get refresh token from OAuth2 flow

admin.initializeApp({
  credential: admin.credential.refreshToken(refreshToken),
  databaseURL: 'https://parrot-dcc75.firebaseio.com'
});




// Add Firebase service account

var serviceAccount = require("./public/firebasepk.json");

admin.initializeApp({
	  credential: admin.credential.cert(serviceAccount),
	  databaseURL: "https://parrot-dcc75.firebaseio.com"
});

//  process.env.PWD = process.cwd()

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


// API End Point 

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
// added this file
	   if (test === 'mock') {

	        app.get('/reactapp/src/App.js', function (req, res) {
			     res.send('App.js')
		   })

		continue

            sendTextMessage(sender, "HNG7: " + text.substring(0, 200))
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
                 "image_url": "https://www.opportunitiesforafricans.com/wp-content/uploads/2020/05/hng-internship-2020.jpg",
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
                        "url": "https://mailto:hngi7@hng.tech",
                        "title": "Email us HNG"
                    }],
                }, {
                    "title": "Learn on Internship",
                    "subtitle": "Ask anything on our internships",
                    "image_url": "https://tctechcrunch2011.files.wordpress.com/2016/04/facebook-chatbots.png?w=738",
                    "buttons": [{
                        "type": "postback",
                        "title": "What's the benefit?",

                        "payload": "During the course of the internship, you will be introduced to different projects to work on.",
                    },{
                        "type": "postback",
                        "title": "Remote Learning",
                        "payload": "Our aim is to help everyone willing to kick-start a career in tech without distance being a barrier.",
                    }, {
                        "type": "postback",
                        "title": "The Future",
                        "payload": "The HNG Internship is an ambitious attempt to change the way education is done",
                    }],
                },  {
                    "title": "Become an Intern",
                    "subtitle": "How does it work",
               "image_url": "https://tctechcrunch2011.files.wordpress.com/2016/04/facebook-chatbots.png?w=738",
                    "buttons": [{
                        "type": "postback",
                        "title": "Apply",
                        "payload": "The HNG internship is a 3-month remote internship!",
                    },{
                        "type": "postback",
                        "title": "Onboard team ",
                        "payload": "Join one of the best remote learning opportunities in tech by signing up with us.",
                    }, {
                        "type": "postback",
                        "title": "Products",
                        "payload": "Throughout the internship, you will work on scalable products. ",
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

