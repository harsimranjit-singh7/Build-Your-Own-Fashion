const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://officialwebprojects:WebProjects2023@cluster0.noggo6q.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp";

const client = new MongoClient(uri);
const conn = async() =>{
    try{
        const database = client.db('ecommsite');
        if(database){
            console.log("connection Successful")
            return database;
        }
    }catch(err){
        console.log("Connection error" + err)
    }
}


module.exports = conn;