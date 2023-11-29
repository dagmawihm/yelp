const express = require("express");
const app = express();
const path = require('path');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home');
})

app.listen(8080, () => {
    console.log("LISTENING ON PORT 8080")
})