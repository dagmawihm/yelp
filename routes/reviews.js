const express = require('express');
const router = express.Router({ mergeParams: true });

const Review = require('../models/review');
const Campground = require('../models/campground');

const ExpressError = require('../utils/expressError');
const catchAsync = require('../utils/catchAsync');

const { reviewSchema } = require('../joiSchema.js');



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

router.post('/', validateReview, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review)
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground.id}`)

}));

router.delete('/:rid', catchAsync(async (req, res) => {
    const { id, rid } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: rid } });
    const deletedReview = await Review.findByIdAndDelete(rid);
    res.redirect(`/campgrounds/${id}`)

}));


module.exports = router;