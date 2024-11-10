let express = require('express');
let path = require('path');
let fs = require('fs');
let MongoClient = require('mongodb').MongoClient;
let bodyParser = require('body-parser');
let app = express();

// Prometheus script
const client = require('prom-client');
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

const httpRequestsTotal = new client.Counter({
  name: 'http_request_operations_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'status_code']
});

const httpRequestDurationSeconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  buckets: [0.1, 0.5, 2, 5, 10]
});

// Expose /metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});


app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  // Increase the number of requests
  httpRequestsTotal.inc();
  
  // Simulate execution time
  const start = Date.now();
  const simulateTime = Math.floor(Math.random() * (10000 - 500 + 1) + 500);
  
  setTimeout(() => {
    const duration = (Date.now() - start) / 1000; // Convert to seconds
    httpRequestDurationSeconds.observe(duration);
  }, simulateTime);
  
  // Send the response
  res.sendFile(path.join(__dirname, "index.html"));
});


app.get('/profile-picture', function (req, res) {
  let img = fs.readFileSync(path.join(__dirname, "images/profile-1.jpg"));
  res.writeHead(200, {'Content-Type': 'image/jpg' });
  res.end(img, 'binary');
});

app.get('/health', function (req, res) {
  res.status(200).send('Healthy');
});

app.get('/readiness', function (req, res) {
  res.status(200).send('Ready');
});

// use when starting application locally with node command
let mongoUrlLocal = "mongodb://admin:password@0.0.0.0:27017";

// use when starting application as a separate docker container
let mongoUrlDocker = "mongodb://admin:password@host.docker.internal:27017";

// use when starting application as docker container, part of docker-compose
let mongoUrlDockerCompose = "mongodb://admin:password@mongodb";

// pass these options to mongo client connect request to avoid DeprecationWarning for current Server Discovery and Monitoring engine
let mongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };

// "user-account" in demo with docker. "my-db" in demo with docker-compose
let databaseName = "my-db";

app.post('/update-profile', function (req, res) {
  let userObj = req.body;

//  MongoClient.connect(mongoUrlLocal, mongoClientOptions, function (err, client) {
MongoClient.connect(mongoUrlDockerCompose, mongoClientOptions, function (err, client) {
    if (err) throw err;

    let db = client.db(databaseName);
    userObj['userid'] = 1;

    let myquery = { userid: 1 };
    let newvalues = { $set: userObj };

    db.collection("users").updateOne(myquery, newvalues, {upsert: true}, function(err, res) {
      if (err) throw err;
      client.close();
    });

  });
  // Send response
  res.send(userObj);
});

app.get('/get-profile', function (req, res) {
  let response = {};
  // Connect to the db
  MongoClient.connect(mongoUrlDockerCompose, mongoClientOptions, function (err, client) {
    if (err) throw err;

    let db = client.db(databaseName);

    let myquery = { userid: 1 };

    db.collection("users").findOne(myquery, function (err, result) {
      if (err) throw err;
      response = result;
      client.close();

      // Send response
      res.send(response ? response : {});
    });
  });
});

app.listen(3000, '0.0.0.0', function () {
  console.log("app listening on port 3000!");
});
