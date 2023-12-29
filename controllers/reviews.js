const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.postReview = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review)
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground.id}`)

}

module.exports.deleteReview = async (req, res) => {
    const { id, rid } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: rid } });
    const deletedReview = await Review.findByIdAndDelete(rid);
    res.redirect(`/campgrounds/${id}`)

}