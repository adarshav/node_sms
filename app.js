const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const Nexmo = require('nexmo');
const socketio = require('socket.io');

// Init Nexmo
const nexmo = new Nexmo({
    apiKey: '',
    apiSecret: ''
}, { debug: true })

// init app
const app = express();

// Template engine setup
app.set('view engine','html');
app.engine('html', ejs.renderFile);

// public folder setup
app.use(express.static(__dirname + '/public'));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In express first we have to maintain routes and whatever items to be displayed in the screen it should be mentioned in views directory and we have to mention the filename in res.render();

// Index route
app.get('/', (req, res) => {
    res.render('index');
})

// Catch form submit
app.post('/', (req, res) => {
    // res.send(req.body);
    // console.log(req.body);

    const number = req.body.number;
    const text = req.body.text;
    nexmo.message.sendSms(
        'Nexmo_Brand_Name', number, text, { type: 'unicode' }, (err, responseData) => {
            if(err) {
                console.log(err);
            } else {
                // console.dir() takes an object and returns its every properties
                console.dir(responseData);

                // Get data from response
                const data = {
                    id: responseData.messages[0]['message-id'],
                    number: responseData.messages[0]['to']
                }
                console.log(data);
                // Emit to client
                io.emit('smsStatus', data);
            }
        }

    )
})
// Define port 
const port = 3000;

// Start Server
const server = app.listen(port, () => console.log(`server started on port ${ port } `));

// connect to socket.io
const io = socketio(server);

io.on('connection', (socket) => {
    console.log('Connected');
    io.on('disconnect', () => {
        console.log('Disconnected')
    })
})
