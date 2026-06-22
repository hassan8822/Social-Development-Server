const express = require ("express");
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors())
app.use(express.json());

const uri = "mongodb+srv://SocialUserDB:2vIdPCB7aDDRevLH@clustermongo.cyjzhhy.mongodb.net/?appName=ClusterMongo";
// 2vIdPCB7aDDRevLH
// SocialUserDB
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
 
async function run() {
  try {
    await client.connect();
    const db = client.db('Social_User')
    const eventsCollection = db.collection('events')

    app.get("/events", async(req, res) => {
        
      const result = await eventsCollection.find().toArray();
      res.send(result);
    });

    app.post("/events", async(req, res) => {
      
      const eventData = req.body;
      const result = await eventsCollection.insertOne(eventData);
      res.send(result)

    })








  
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

   
  }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('Hello ! Bangladesh')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})