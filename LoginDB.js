const { MongoClient } = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Create an Express app
const app = express();
app.use(cors());


// Use bodyParser middleware to parse JSON request bodies
app.use(bodyParser.json());


// ==============Create Admin API

app.post('/CreateAdmin', async (req, res) => {
 
    const { username, password } = req.body;


    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const uri = "mongodb://localhost:27017/";
        const client = await MongoClient.connect(uri);
        const db = client.db("Data");

    
        const existingUser = await db.collection('users').findOne({ username });
        if (existingUser) {
            client.close();
            return res.status(400).json({ error: 'Username already exists' });
        }


        await db.collection('users').insertOne({ username, password });
        client.close();

        res.json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while creating the user' });
    }
});




// ---------------View Video api
app.use(bodyParser.json());
app.get('/viewVideo', async (req, res) => {
   

    try {
        uri="mongodb://localhost:27017/"
        const client =  await MongoClient.connect(uri);
        const db = client.db("Data");
   
      
        var user=  await db.collection('Video').find({}).toArray();
        
        res.send(user.map(video=>video.Video))
        
       


    } catch (error) {
        console.log(error)
    }
})



// ================Login API

app.get('/login', async (req, res) => {
    const {username, Password} = req.body;

    try {
        uri="mongodb://localhost:27017/"
        const client =  await MongoClient.connect(uri);
        const db = client.db("Data");
        var dbPassword;
      
        var user= await db.collection('users').find({username}).toArray();
        
        for(var data of user){
        console.log(data.password);
        dbPassword=data.password;

        }
        if(user&&Password==dbPassword){
            res.json({ message: 'Login successful' });
        } else {
            res.status(404).json({ error: 'Login Failed User not found' });
        }
        
       


    } catch (error) {
        console.log(error)
    }
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});





