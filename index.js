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

app.delete(coursesUrl+idUrl, (req, res) => {
    let searchId = parseInt(req.params.id);
    res.send({id: searchId, deleted: true});
});

//put--------------------------------------------------------------------------------------------------------

app.put(coursesUrl+idUrl, (req, res) => {
    let searchId = parseInt(req.params.id);
    res.send({id: searchId, received: req.body});
});

//Post--------------------------------------------------------------------------------------------------------

app.get('/fetch_data', (request, response) => {
    Mongo.fetch('solar-data')
    .then(result => response.send(result))
    .catch(err => response.send(err))
})

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

app.get("/courses", (rec, res) => {
    res.send(courses);
});

app.get("/courses/:id", (rec, res) => {
    let searchId = parseInt(rec.params.id);
    let result = courses.filter( course => course.id === searchId);

    if(result.length === 0) {
        res.status(404).send("The course with the given ID was not found");
        return;
    }
    res.send(result[0]);
});

