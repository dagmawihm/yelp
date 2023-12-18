const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const ejsMate = require('ejs-mate');
const { campgroundSchema, reviewSchema } = require('./joiSchema.js');
const catchAsync = require('./utils/catchAsync');
const expressError = require('./utils/expressError');

// Import the Campground model from the module
const Campground = require('./models/campground');
const Review = require('./models/review');
const ExpressError = require('./utils/expressError');

mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp')
    .then(() => {
        console.log("CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO ERROR!!!!")
        console.log(err)
    });

app.engine('ejs', ejsMate);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


const validateCampground = (req, res, next) => {


    const { error } = campgroundSchema.validate(req.body);
    if (error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else
    {
        next();
    }

}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else
    {
        next();
    }

}


app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('index', { campgrounds });
}));


app.get('/campgrounds/new', (req, res) => {
    res.render('new');
});

app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    res.render('show', { campground });
}));

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    res.render('edit', { campground });
}));

app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review)
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground.id}`)

}));

app.delete('/campgrounds/:id/reviews/:rid', catchAsync(async (req, res) => {
    const { id, rid } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: rid } });
    const deletedReview = await Review.findByIdAndDelete(rid);
    res.redirect(`/campgrounds/${id}`)

}));

app.patch('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;

    // const title = req.body.campground.title;
    // const image = req.body.campground.image;
    // const price = req.body.campground.price;
    // const location = req.body.campground.location;
    // const description = req.body.campground.description;
    // console.log(req.body.campground.title);

    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { runValidators: true, new: true });
    res.redirect(`/campgrounds/${campground._id}`);
}));

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const deletedCampground = await Campground.findByIdAndDelete(id);
    res.redirect(`/campgrounds`);

}));



app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
    //if (!req.body.campground) throw new ExpressError('invalid data', 400);

    const camp = new Campground(req.body.campground);
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`);

}));

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})




app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
     if(!err.message) err.message = 'Something went wrong';
    res.status(statusCode).render('error', { err });
})






app.listen(8080, () => {
    console.log("LISTENING ON PORT 8080");
});