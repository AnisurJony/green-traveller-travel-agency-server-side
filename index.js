const express = require('express');
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wbldh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function greenFunction() {


    try {
        await client.connect();
        const database = client.db('greenTraveller');
        const servicesCollection = database.collection('services');
        const ordersCollection = database.collection('orders');




        //------------------- get services --------------//

        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const orders = await cursor.toArray();
            res.json(orders);
        });


        //---------------- post service --------------//

        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await ordersCollection.insertOne(service);
            res.json(result);
        });


        //------------------ post order --------------//

        app.post('/orders', async (req, res) => {

            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.json(result);
        });


        //------------------- get order --------------//

        app.get('/orders', async (req, res) => {
            let query = {};
            const email = req.query.email;
            if (email) {
                query = { email: email }
                const cursor = ordersCollection.find(query);
                const orders = await cursor.toArray();
                res.json(orders);
            }
            else {
                const cursor = ordersCollection.find(query);
                const orders = await cursor.toArray();
                res.json(orders);
            }

        });


        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) }

            const result = await ordersCollection.deleteOne(query);

            res.json(result);
        });




    }
    finally {

        // await client.close();
    }
}
greenFunction().catch(console.dir);



app.get('/', (req, res) => {
    res.send('green traveller');
});


app.listen(port, () => {
    console.log('listening to green-traveller', port)
})