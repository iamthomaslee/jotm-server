const express = require('express');
const path = require('path');
const app = express();
const db = require('./queries');
const bodyParser = require('body-parser');
const cors = require('cors');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(cors());

// settings for Heroku deployment
if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, 'build')));
    // Handle React routing, return all requests to React app
    app.get('/', function(req, res) {
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
    });
}

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Put all API endpoints under '/api'
app.get('/api/ping', (req, res) => {
    res.send('hello world')
});

app.post('/api/location/get', (req, res) => {
    db.getLocation(req, res);
});
app.post('/api/location/add', (req, res) => {
    db.addLocation(req, res);
});


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));