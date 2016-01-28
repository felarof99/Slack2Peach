var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var path = require('path');

var request = require('request');
var Firebase = require('firebase');
var Logger = require('./logger.js');


var PORT = 80;
var HOST = 'http://slack2peach.cloudapp.net';
var FB_STORE = ""; //Firebase Store URL
var CLIENT_ID = "";
var CLIENT_SECRET = "";

var rootRef = ""; //Reference to Firebase Store root

app.use(cookieParser());
app.use(expressSession({secret: new Date().getTime().toString()}));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencode

function replyOnSlack(slack_response_url, reply){
    request({
        url: slack_response_url,
        method: 'POST',
        json: {
            "text": reply,
        }
    });
}

function saveProfile(email, slack_username, peach_token){
    //Logger.log('Creating user...', email, slack_username, peach_token);
    var update_obj = {
        email: email,
        slack_username: slack_username,
        peach_token: peach_token,
    };
    rootRef.child('users').child(slack_username).update(update_obj);
};

function loginToPeach(email, password, slack_username, slack_response_url){
    request({
        url: 'https://v1.peachapi.com/login',
        method: 'POST',
        json: {
            "email": email,
            "password": password,
        }
    }, function(err, res, body){

        if(err || body.success != 1){
            if(err){
                Logger.err('loginToPeach failed cause', err.message);
            }
            reply = "Login failed :cry: Try again.";
        } else {
            //Logger.log('loginToPeach succeeded', 'body.data', body.data.streams);

            var peach_token = body.data.streams[0].token;
            saveProfile(email, slack_username, peach_token);

            reply = "You have logged into Peach! You can go ahead and Peach from Slack :the_horns:";
        }

        replyOnSlack(slack_response_url, reply);

    });
};

function postToPeach(input, peach_token, response_url){
    Logger.log('postToPeach with text...', input, 'peachToken', peach_token, 'responseUrl', response_url);
    request({
        url: 'https://v1.peachapi.com/post',
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + peach_token
        },
        json: {
            "message": [{
                "text": input.text,
                "type": "text"
            }]
        }
    }, function(err, res, body){
        var reply = "";
        if(err || res.statusCode != 200 || body.success != 1){
            Logger.err('postToPeach failed', err);
            reply = "Posting to Peach failed :cry:";
        } else {
            //Logger.log('postToPeach succeeded!');
            reply = ":thumbsup: Posted to Peach!";
        }
        replyOnSlack(response_url, reply);
    });

};
function waveOnPeach(input, peach_token, response_url){
    var target = input.target.substr(1), type = input.type, target_stream_id = "";
    Logger.log('target', target, 'wave_type', type, 'peach_token', peach_token, 'response_url', response_url)
    request({
        url: 'https://v1.peachapi.com/connections',
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + peach_token
        },
    }, function(err, res, body){
        var reply = "";
        if(err || res.statusCode != 200){
            Logger.err('waveOnPeach: Getting connections failed', err);
            reply = "" + type + "-ing failed :cry:";
        } else {
            var body = JSON.parse(body);
            var data = body['data'], valid_connection = false;
            for(var i=0; i<data.connections.length; i++){
                if(target == data.connections[i].name ){
                    valid_connection = true;
                    target_stream_id = data.connections[i].id;
                    break;
                }
            }
            if(!valid_connection){
                reply = "Cannot " + type + " @" + target + ". Either its an invalid username or the user is not in your connections.";
            } else {
                request({
                    url: "https://v1.peachapi.com/activity/wave",
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + peach_token
                    },
                    json: {
                        targetStreamId: target_stream_id,
                        type: type
                    }
                }, function(err, res, body){
                    if(err || res.statusCode != 200){
                        // TODO I'm screwed here. I haven't informed the user. Fix it!
                        Logger.err('waving failed!');
                    }
                });
                reply = "You " + type + "ed @" + target + " :clap:";
            }
        }

        replyOnSlack(response_url, reply);
    });

}

function getUserPeachTokenAndProceed(callback, callback_input, slack_username, response_url){
    rootRef.child('users').child(slack_username).once('value', function(snapshot){
            var profile = snapshot.val();
            if(profile){
                // user's peach token available with you
                //postToPeach(text, profile['peach_token'], response_url);
                callback(callback_input, profile['peach_token'], response_url);
            } else {
                // user hasn't never logged in with Slack2Peach
                var login_url = HOST + '/peach/login/?slack_username=' + encodeURIComponent(slack_username) + '&response_url=' + encodeURIComponent(response_url);
                request({
                    url: response_url,
                    method: 'POST',
                    json: {
                        text: "We cannot post to Peach. Please log into Peach on the below URL.",
                        attachments: [
                            {
                                text: login_url,
                            }
                        ]
                    }
                });
            }
    });
}

app.get('/', function(req, res){
    if(req.query['code']){
        request({
            url: "https://slack.com/api/oauth.access?client_id="+CLIENT_ID+"&client_secret="+CLIENT_SECRET+"&code="+req.query['code']+"&redirect_uri="+encodeURIComponent('http://slack2peach.cloudapp.net/'),
            method: 'GET',
        }, function(err, res, body){
            if(err || res.statusCode != 200){
                Logger.err('OAuth access failed', err);
            } else {
                Logger.log('OAuth access response', 'statusCode', res.statusCode, 'body', body);
            }
        });
    }
    res.sendfile(__dirname+ '/www/index.html');
});

app.get('/privacy', function(req, res){
    Logger.log('Privacy');
    res.sendfile(__dirname+ '/www/privacy.html');
});


app.get('/help', function(req, res){
    res.sendfile(__dirname+ '/www/help.html');
});

app.get('/peach/login', function(req, res){
    //Logger.log('slack_username', req.query['slack_username'], 'response_url', req.query['response_url']);
    res.sendfile(__dirname+ '/www/login.html');
});

app.post('/peach/login', function(req, res){
    var slack_username = "", slack_response_url = "";
    //Logger.log('req.quer*****', req.query);

    if(req.query['slack_username']){
        slack_username = req.query['slack_username'];
    }

    if(req.query['response_url']){
        slack_response_url = req.query['response_url'];
    }
    if(slack_username != "" && slack_response_url != ""){
      loginToPeach(req.body['peach-email'], req.body['peach-password'], slack_username, slack_response_url);
      Logger.log("sending index.html file");
      res.sendfile(__dirname+ '/www/index.html');
    } else {
      res.send("Incorrect details. Login didn't work!");
    }

});

app.post('/slack/api/', function(req, res){
    var data = req.body;
    var regex = /([a-zA-Z]+)\s*(.*)/igm;
    var match = regex.exec(data.text);
    var command = (match != null && match[1])?match[1]: null;
    var input = (match != null && match[2])?match[2]: null;

    Logger.log('slack/api/ data', data, 'command', command, 'input', input);
    switch(command){
        case 'login':
            var login_url = HOST + '/peach/login/?slack_username=' + encodeURIComponent(data['user_name']) + '&response_url=' + encodeURIComponent(data['response_url']);
            res.send({
                text: 'Cool! Login to Peach on this URL',
                attachments: [
                    {
                        text: login_url,
                    }
                ]
            });
            break;
        case 'post':
            getUserPeachTokenAndProceed(postToPeach, {text: input}, data['user_name'], data['response_url']);
            res.send('Working on it!');
            break;
        case 'cake':
        case 'wave':
        case 'boop':
        case 'quarantine':
        case 'hiss':
            getUserPeachTokenAndProceed(waveOnPeach, {type: command, target: input}, data['user_name'],data['response_url'] );
            res.send('Working on it!');
            break;
        default:
            res.send(':interrobang: Invalid command.');
            break;
    }
});

// this needs to be below app.get('/peach/login'...) if not index.html will be directly served from this and
// req.sessions won't work.

app.use(express.static(path.join(__dirname, '/www/')));
app.use('/peach/login', express.static(path.join(__dirname, '/www/')));
app.use('/peach', express.static(path.join(__dirname, '/www/')));
app.use('/privacy', express.static(path.join(__dirname, '/www/')));
app.use('/help', express.static(path.join(__dirname, '/www/')));
app.use('/', express.static(path.join(__dirname, '/www/')));

process.on('uncaughtException', function(err) {
    // handle the error safely
    Logger.err('uncaughtException', err);
});


function getCommandLineArgs(flag, default_value){
    if(process.argv.indexOf(flag) != -1){
        return process.argv[process.argv.indexOf(flag) + 1];
    } else {
        if(default_value == null){
            Logger.err('Cannot run, you need to pass ' + flag);
            proccess.exit(1);
        } else {
            return default_value;
        }
    }
}

PORT = getCommandLineArgs('--port', PORT);
HOST = getCommandLineArgs('--host', HOST);

FB_STORE = getCommandLineArgs('--fbStore', null);
CLIENT_ID = getCommandLineArgs('--clientId', null);
CLIENT_SECRET = getCommandLineArgs('--clientSecret', null);


app.listen(PORT, function(){
    Logger.log('PORT', PORT, 'HOST', HOST, 'FB_STORE', FB_STORE, 'CLIENT_ID', CLIENT_ID, 'CLIENT_SECRET', CLIENT_SECRET);
    rootRef = new Firebase(FB_STORE);
});
