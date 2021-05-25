const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const app = express()
const port = 5000

const username = "doctors-portal";
const password = "doctors-portal-2021";

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.vihvh.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`;

app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send('hello world!')
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const Appointments = client.db(`${process.env.DATABASE_NAME}`).collection("appointments");
  // appointment store data
  app.post('/appointment/store',(req,res) => {
      const appointmentBody = req.body;
      Appointments.insertOne(appointmentBody)
      .then(result => {
        res.send(result.insertedCount > 0) 
      })
  })
  // appointment list api
  app.get('/appointment/list',(req,res) => {
    Appointments.find({})
    .toArray((err,document) => {
      res.send(document)
    })
  })
  // appointment by date api
  app.post('/appointmentByDate',(req,res) => {
    const date = req.body;
    Appointments.find({date : date.date})
    .toArray((error,documents) => {
      res.send(documents);
    })
  })

});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})