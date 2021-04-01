const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const bodyParser = require('body-parser');
const cors= require('cors');
require('dotenv').config()
console.log(process.env.DB_USER);

const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = 3005;

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vh4xj.mongodb.net/bikeBazar?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const bikeCollection = client.db("bikeBazar").collection("bikePlace");
  const ordersCollection = client.db("bikeBazar").collection("orderPlace");
  app.get('/allBikes', (req, res)=>{
      bikeCollection.find()
      .toArray((err,items)=>{
          res.send(items)
      })
  })
  app.post('/addBike',(req,res)=>{
      const bikeAdd = req.body;
      bikeCollection.insertOne(bikeAdd)
      .then(result=>{
          console.log(result);
          res.send(result.insertedCount>0)
      })
  })

  app.get('/selectedBike/:id',(req, res) =>{
     bikeCollection.find({_id:ObjectId(req.params.id)})
    .toArray((err,documents)=>{
       res.send(documents[0])
    })
  })

  app.post("/addOrder",(req, res) =>{
    const order = req.body;
    ordersCollection.insertOne(order)
    .then(result=>{
        res.send(result.insertedCount > 0)
    })
})

app.delete('/deleteBike/:id',(req, res) =>{
   bikeCollection.deleteOne({_id:ObjectId(req.params.id)})
  .then(result=>{
    res.send(result.deletedCount > 0)
  })
})
app.get('/orders', (req, res)=>{
  ordersCollection.find()
  .toArray((err,items)=>{
    res.send(items)
})
})

});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})