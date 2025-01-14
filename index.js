require('dotenv').config();
const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
//middleWare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.whh17.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
    const database = client.db('movieDB');
    const movieCollection = database.collection('movie');
    const favoriteCollection = database.collection('favorite-movie');
    app.post('/movie', async (req, res) => {
      const movie = req.body;
      const result = await movieCollection.insertOne(movie);
      res.send(result);
    });
    app.get('/movie', async (req, res) => {
      const cursor = movieCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    //find
    app.get('/movie/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await movieCollection.findOne(query);
      res.send(result);
    });
    //delete
    app.delete('/movie/:id', async (req, res) => {
      console.log('going to delete', req.params.id);
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await movieCollection.deleteOne(query);
      res.send(result);
    });
    //update movie
    app.patch('/movie/:id', async (req, res) => {
      const id = req.params.id;
      const updateFields = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateMovie = {
        $set: updateFields,
      };
      const result = await movieCollection.updateOne(filter, updateMovie);
      res.send(result);
    });

    //post favorite movie
    app.post('/favorite-movie/add-favorite', async (req, res) => {
      const { movieDetails } = req.body;
      if (!movieDetails.email) {
        return res
          .status(400)
          .send({ error: 'Email is required to add a favorite movie.' });
      }

      const result = await favoriteCollection.insertOne({
        movieDetails,
      });

      res.send(result);
    });

    //get

    app.get('/favorite-movie/add-favorite', async (req, res) => {
      const cursor = favoriteCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //favorite delete
    app.delete('/favorite-movie/add-favorite/:id', async (req, res) => {
      console.log(' delete', req.params.id);
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await favoriteCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Assignment 10 server is a runing');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
