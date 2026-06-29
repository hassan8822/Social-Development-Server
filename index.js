const express = require ("express");
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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
    const joinedEventsCollection =db.collection('joinedEvents')


    // events

    app.get("/events", async(req, res) => {
        
      const result = await eventsCollection.find().toArray();
      res.send(result);
    });

    app.get("/events/:id", async (req, res) => {
  const id = req.params.id;
  const event = await eventsCollection.findOne({
    _id: new ObjectId(id),
  });

  res.send(event);
});

    app.post("/events", async(req, res) => {
      
      const eventData = req.body;
      const result = await eventsCollection.insertOne(eventData);
      res.send(result)

    })

    // joined events


    app.get("/joinedEvents/:email", async(req, res) =>{
      const email = req.params.email;
      const result = await joinedEventsCollection.find({userEmail: email})
      .sort({eventDate: 1}).toArray();
      res.send(result);
    })

    app.post("/joinedEvents", async(req, res) => {
      const joinedEvent = req.body;
      const result = await  joinedEventsCollection.insertOne(joinedEvent);
      res.send(result)
    })

    // manageevnts
    app.get("/myevents/:email", async (req, res) => {
  const email = req.params.email;

  const result = await eventsCollection
    .find({ createdBy: email })
    .sort({ eventDate: 1 })
    .toArray();

  res.send(result);
});

app.delete("/events/:id", async (req, res) => {
  const id = req.params.id;

  const result = await eventsCollection.deleteOne({
    _id: new ObjectId(id),
  });

  res.send(result);
});

// Update events
app.put("/events/:id", async (req, res) => {
 

  const id = req.params.id;
  const updatedEvent = req.body;

  const filter = { _id: new ObjectId(id) };

  const updateDoc = {
    $set: updatedEvent,
  };

  const result = await eventsCollection.updateOne(filter, updateDoc);

  res.send(result);
});






  
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




