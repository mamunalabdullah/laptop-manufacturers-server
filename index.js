const express = require('express')
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()
const port = process.env.PORT || 5000

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nihvi.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        console.log("Database connect");
        const toolsCollection = client.db("laptop-manufacturers").collection("tools");

      // read all 
        app.get("/tools", async(req, res) => {
            const query = {};
            const cursor = toolsCollection.find(query);
            const tools = await cursor.toArray();
            res.send(tools);
        })

        // find one 
        app.get('/tool/:id', async (req, res) => {
          const id = req.params.id;
          const filter = { _id: ObjectId(id) };
          const tool = await toolsCollection.findOne(filter);
          res.send(tool);
      })

        // Update one
        app.put('/update/:id', async (req, res) => {
          const id = req.params.id;
          const data = req.body;
          const filter = { _id: ObjectId(id) };
          const options = { upsert: true };
          const updateDoc = {
              $set: {
                  ...data,
              },
          };
          const result = await toolsCollection.updateOne(filter, updateDoc, options);
          res.send(result);
      })
      }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);


app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello Laptop-Manufacturers!')
})

app.listen(port, () => {
  console.log(`Laptop-Manufacturers app listening on port ${port}`)
})