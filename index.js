// index.js

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');

// Import the Campground model from the module
const Campground = require('./models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp')
    .then(() => {
        console.log("CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO ERROR!!!!")
        console.log(err)
    });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/addcamp', (req, res) => {
    console.log("starting to post");

    const camp = new Campground({
        title: "yabede camp",
        price: "100",
        description: "are yabede camp nw nuna eyut",
        location: "302 wayne ave, silver spring, md",
    });

    camp.save()
        .then(camp => {
            console.log(camp);
            res.send(camp);
        })
        .catch(e => {
            console.log(e);
            res.status(500).send("Error saving camp");
        });
});

app.listen(8080, () => {
    console.log("LISTENING ON PORT 8080");
});