const { MongoClient } = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
const fs = require("fs").promises;
const path=require('path');


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



app.get('/viewUsers', async (req, res) => {
   

    try {
        uri="mongodb://localhost:27017/"
        const client =  await MongoClient.connect(uri);
        const db = client.db("Data");
   
      
        var user=  await db.collection('users').find({}).toArray();
        
        res.send(user.map(user=>user.username))
        
       


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

app.get("/read-file", async (req,res) => {
    try {
      const filePath = "C:/Users/antony.vinith/Desktop/FinalYearProj/frontend-apparel/PythonDecrypt/TextData/DecryptedFile.txt"
      var fileData = (await fs.readFile(filePath, "utf-8")).toString();
      fileData=fileData.toString();
      res.send({ success: true, data: fileData });
    } catch (error) {
      console.error("Error reading file:", error);
      res.status(500).send({ success: false, error: "Error reading file" });
    }
  });

const videoDirectory = path.join("C:/Users/antony.vinith/Desktop/FinalYearProj/frontend-apparel/src/PythonDecrypt");


app.get('/api/getVideos', (req, res) => {
    fs.readdir(videoDirectory, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to scan directory: ' + err);
        }
 
        const videoFiles = files.filter(file => file);
 
        const videoPaths = videoFiles.map(file => path.join(videoDirectory, file));
        res.json(videoPaths);
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});




