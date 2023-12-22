const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

const Campground = require('../models/campground');

const { isLoggedIn, isAuthor, validateCampground } = require('../middleware.js');


router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('index', { campgrounds });
}));


router.get('/new', isLoggedIn,(req, res) => {
    res.render('new');
});

router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path:'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');

    if(!campground){
        req.flash('error', 'There is NO Campground that much this ID');
        return res.redirect('/campgrounds');
    }

    res.render('show', { campground });

}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
   
    res.render('edit', { campground });
}));


router.patch('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;

    // const title = req.body.campground.title;
    // const image = req.body.campground.image;
    // const price = req.body.campground.price;
    // const location = req.body.campground.location;
    // const description = req.body.campground.description;
    // console.log(req.body.campground.title);

    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { runValidators: true, new: true });
    req.flash('success', 'Successfully Updated your Campground')
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;


    const deletedCampground = await Campground.findByIdAndDelete(id);
    res.redirect(`/campgrounds`);

}));



router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    
    //if (!req.body.campground) throw new ExpressError('invalid data', 400);

    const camp = new Campground(req.body.campground);
    camp.author = req.user._id;
    await camp.save();
    req.flash('success', 'Successfully Made a New Campground')
    res.redirect(`/campgrounds/${camp._id}`);

}));

module.exports = router;