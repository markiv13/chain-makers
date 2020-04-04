const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');

// Get our API routes
const mainRoutes = require('./server/routes');

const app = express();
const server = http.createServer(app);

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

// Set our api routes
app.use(mainRoutes);
const port = process.env.PORT || '3000';
app.set('port', port);

server.listen(port, function() {
  console.log('Web server listening on port ' + port);
});
