const { MongoClient } = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
app.use(cors());


app.use(bodyParser.json());
app.get('/viewVideo', async (req, res) => {
   

    try {
        uri="mongodb://localhost:27017/"
        const client =  await MongoClient.connect(uri);
        const db = client.db("Data");
   
      
        var user=  db.collection('Video').find();
        
        consolele.log(user)
        
       


    } catch (error) {
        console.log(error)
    }
})
