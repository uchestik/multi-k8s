const keys = require('./keys');

//express app setup
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());

// postgress client setup
const { Pool } = require('pg');
const pgClient = new Pool({
    user : keys.pgUser,
    host : keys.pgHost,
    database : keys.pgDatabase,
    password : keys.pgPassword,
    port : keys.pgPort
});
pgClient.on('error', () => console.log('Lost PG connection'));

pgClient.on("connect", (client) => {
    client
      .query("CREATE TABLE IF NOT EXISTS values (number INT)")
      .catch((err) => console.error(err));
});

// redis client setup
const redis = require('redis');
const redisClient = redis.createClient({
    host : keys.redisHost,
    port : keys.redisPort,
    retry_strategy: () => 1000 //if connection is lost retry to connect every second
});
const redisPublisher = redisClient.duplicate();

// Express route handlers

app.get('/', (req, res) => {
    res.send('Hi')
});

app.get('/values/all', async (req, res) => {
    const values = await pgClient.query('SELECT * from values');
    res.send(values.rows);
});

app.get('/values/current', async (req, res) => {
    redisClient.hgetall('values',  (err, values) => {
        res.send(values);
    })
});

app.post('/values', async (req, res) => {
    const index = req.body.index;
    if(parseInt(index) > 40){
        return res.status(422).send('Index too high');
    }

    redisClient.hset('values', index, 'Nothing yet!');
    redisPublisher.publish('insert', index);
    pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);
    
    res.send({working : true});
});


app.listen(5050, err => {
    if(err){
        console.log('Node server error', err)
    }
    console.log('Listening')
});