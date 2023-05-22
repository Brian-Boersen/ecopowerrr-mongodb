import express from "express";

import Mongo from "./lib/mongo.js";

const app = express();

let portNumber = 70;

app.listen(portNumber, () => {
    console.log("Server is running on port " + portNumber + "...");
});

//Enable JSON input
app.use(express.json());

/// You might get a CORS error when sending a request from localhost (i.e. a React
/// application) So we need to tell our server to accept all requests.
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
    next();
});


let url = "http://localhost:3000";

let coursesUrl = "/courses";

let idUrl = "/:id";

//delete--------------------------------------------------------------------------------------------------------

// app.delete(coursesUrl+idUrl, (req, res) => {
//     let searchId = parseInt(req.params.id);
//     res.send({id: searchId, deleted: true});
// });

// //put--------------------------------------------------------------------------------------------------------

// app.put(coursesUrl+idUrl, (req, res) => {
//     let searchId = parseInt(req.params.id);
//     res.send({id: searchId, received: req.body});
// });

//Post--------------------------------------------------------------------------------------------------------

app.get('/fetch_data/:id', (request, response) =>
{
    Mongo.fetch('solar-data',request.params.id)
    .then(result => response.send(result))
    .catch(err => response.send(err))
});

app.get('/fetch_data', (request, response) =>
{
    Mongo.fetch('solar-data')
    .then(result => response.send(result))
    .catch(err => response.send(err))
});


app.get('/setstatus/:status', (request, response) => 
{
    Mongo.setStatus('solar-data', request.params.status)
    .then(result => response.send(result))
    .catch(err => response.send(err))
    //response.send({status: request.params.status});
});

//get--------------------------------------------------------------------------------------------------------

app.get("/", (request, response) => {
    console.log("Homepage");

    Mongo.list()
    .then( result => {
        console.log("then");
        // response.send(courses);
        response.send(result);
    })
    .catch( err => {
        response.send(err);
    });
    
    //response.send({page:"Homepage"});
});
