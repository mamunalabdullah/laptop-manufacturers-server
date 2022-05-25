const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nihvi.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
      await client.connect();
      const toolsCollection = client.db("laptop-manufacturers").collection("tools");
      const reviewsCollection = client.db("laptop-manufacturers").collection("reviews");
      const ordersCollection = client.db("laptop-manufacturers").collection("orders");
      const usersCollection = client.db("laptop-manufacturers").collection("users");

      // Read all data
      app.get('/tools', async (req, res) => {
          const query = req.query;
          const cursor = toolsCollection.find(query);
          const result = await cursor.toArray()
          // console.log(result);
          res.send(result);
      })

      // Find a data

      app.get('/tool/:id', async (req, res) => {
          const id = req.params.id;
          const filter = { _id: ObjectId(id)
};
          const result = await toolsCollection.findOne(filter);
          res.send(result);
      })

      // Update a data

      app.put('/update/:id', async (req, res) => {
          const id = req.params.id;
          const data = req.body;
          const filter = { _id: ObjectId(id)
};
          const options = { upsert: true };
          const updateDoc = {
              $set: {
                  ...data,
              },
          };
          const result = await toolsCollection.updateOne(filter, updateDoc, options);
          res.send(result);
      })

      // Review part
      // Review all data
      app.get('/review', async (req, res) => {
          const query = req.query;
          const cursor = reviewsCollection.find(query);
          const result = await cursor.toArray()
          // console.log(result);
          res.send(result);
      })

      //Create a review

      app.post('/review', async (req, res) => {

          const data = req.body;

          const result = await reviewsCollection.insertOne(data);
          res.send(result);
      })

      // order part
      // order all data
      app.get('/order', async (req, res) => {
          const query = req.query;
          const cursor = ordersCollection.find(query);
          const result = await cursor.toArray()
          // console.log(result);
          res.send(result);
      })

      //Create a order

      app.post('/order', async (req, res) => {
          const data = req.body;
          const result = await ordersCollection.insertOne(data);
          res.send(result);
      })

      app.get("/user", async(req, res) => {
        const users = await usersCollection.find().toArray();
        res.send(users);
      })

      //update a user
      app.put("/user/:email", async(req, res) => {
        const email = req.params.email;
        const user = req.body;
        const filter = {email: email};
        const options = {upsert: true};
        const updateDoc = {
          $set: user, 
        };
        const result = await usersCollection.updateOne(filter, updateDoc, options);
        res.send(result);
      })

  } finally {

  }
}
run().catch(console.dir);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello Laptop-Manufacturers!");
});

app.listen(port, () => {
  console.log(`Laptop-Manufacturers app listening on port ${port}`);
});
