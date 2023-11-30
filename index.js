const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

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

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));




app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('index', { campgrounds });
});


app.get('/campgrounds/new', (req, res) => {
    res.render('new');
});

app.get('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)

    res.render('show', { campground });
});

app.get('/campgrounds/:id/edit', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)

    res.render('edit', { campground });
});

app.patch('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;

    const title = req.body.title;
    const price = req.body.price;
    const location = req.body.location;
    const description = req.body.description;

    const campground = await Campground.findByIdAndUpdate(
        id,
        { title: title, price: price, location: location, description: description },
        { runValidators: true, new: true }
    );
    res.redirect(`/campgrounds/${campground._id}`);
});

app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;

    const deletedCampground = await Campground.findByIdAndDelete(id);

    res.redirect(`/campgrounds`);

})



app.post('/campgrounds', async (req, res) => {
    const title = req.body.title;
    const price = req.body.price;
    const location = req.body.location;
    const description = req.body.description;

    const camp = new Campground({
        title: title,
        price: price,
        location: location,
        description: description
    })
    camp.save().then()
        .catch(e => {
            console.log(e)
        })

        res.redirect(`/campgrounds/${camp._id}`);
})











app.listen(8080, () => {
    console.log("LISTENING ON PORT 8080");
});