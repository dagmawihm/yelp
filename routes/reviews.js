const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const Campground = require('../models/campground');
const Review = require('../models/review');


const catchAsync = require('../utils/catchAsync');





router.post('/',isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review)
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground.id}`)

}));

router.delete('/:rid', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, rid } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: rid } });
    const deletedReview = await Review.findByIdAndDelete(rid);
    res.redirect(`/campgrounds/${id}`)

}));


module.exports = router;