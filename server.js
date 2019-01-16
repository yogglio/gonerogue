let express = require('express');
let app = express();
let http = require('http').Server(app);
let https = require('https').Server(app);
let path = require('path');
let serveStatic = require('serve-static');
let fs = require('fs');
let webpush = require('web-push');
let bodyParser = require('body-parser');
const compression = require('compression');

app.use(compression());

app.use(bodyParser.json());

const publicVapidKey = "BFMeLiaQT76-yscl8uao2RjeTqplSGcRrN6YiBN3ltVeeNvLVSsa6lu3aV2u_vFwk8eLh0CdqabJxgP5sjODvK0";
const privateVapidKey = "vQZ65ua1QLcuWfyLwN_SIQw5eL7yxUO6OjsLxNkdbKg";

//Collect active endpoints
const subscriptions = {};
// Interval for sending push
const pushInterval = 10;

webpush.setVapidDetails(
    "mailto:yannick.baettig@gmail.com",
    publicVapidKey,
    privateVapidKey
);

/*app.post("/subscribe", (req, res) => {
    // Get pushSubscription object
    const subscription = req.body;

    // Send 201 - resource created
    res.status(201).json({});

    // Create payload
    const payload = JSON.stringify({ title: "Push Test" });

    // Pass object into sendNotification
    webpush.sendNotification(subscription, payload).catch(err => console.error(err));
});*/

// send public Key
app.get('/vapidPublicKey', function(req, res) {
    res.send(publicVapidKey);
});

// register endpoint
app.post('/register', function(req, res) {
    var subscription = req.body.subscription;
    if (!subscriptions[subscription.endpoint]) {
        console.log('Subscription registered ' + subscription.endpoint);
        subscriptions[subscription.endpoint] = subscription;
    }
    res.sendStatus(201);
});

// unregister endpoint
app.post('/unregister', function(req, res) {
    var subscription = req.body.subscription;
    if (subscriptions[subscription.endpoint]) {
        console.log('Subscription unregistered ' + subscription.endpoint);
        delete subscriptions[subscription.endpoint];
    }
    res.sendStatus(201);
});

app.use(function(req,res,next) {
    // heroku  req header check
    if (req.header('x-forwarded-proto') !== 'https') {
        console.log("HTTP call detected, not allowed");
        return res.redirect('https://' + req.hostname + req.path);
    } else {
        console.log("HTTPs call detected, allowed");
        return next();
    }
});

// serve the index.html as starting page
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, "dist", "index.html"))
});


// serve all files in dist
app.use(express.static('dist'));

http.listen(process.env.PORT || 8090, function(){
    console.log(`listening on *: ${http.address().port}`);
});

// Send notification to the push service, remove cancelled/expired endpoints
function sendNotification(subscription) {
    // Create payload
    const payload = JSON.stringify({ title: "Push Test" });
    webpush.sendNotification(subscription, payload)
        .then(function() {
            console.log('Push Application Server - Notification sent to ' + subscription.endpoint);
        }).catch(function() {
        console.log('ERROR in sending Notification, endpoint removed ' + subscription.endpoint);
        delete subscriptions[subscription.endpoint];
    });
}

// Send notification for each subscription in interval for testing
setInterval(function() {
    Object.values(subscriptions).forEach(sendNotification);
}, pushInterval * 1000);