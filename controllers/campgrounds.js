const { model } = require('mongoose');
const Campground = require('../models/campground');
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('index', { campgrounds });
} 

module.exports.renderNewForm = (req, res) => {
    res.render('new');
}

module.exports.showCampground = async (req, res) => {
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

}
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
   
    res.render('edit', { campground });
}

module.exports.editCampground = async (req, res) => {
    const { id } = req.params;

    // const title = req.body.campground.title;
    // const image = req.body.campground.image;
    // const price = req.body.campground.price;
    // const location = req.body.campground.location;
    // const description = req.body.campground.description;
    // console.log(req.body.campground.title);

    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { runValidators: true, new: true });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save()
    if (req.body.deleteImages){
        for(let filename of req.body.deleteImages)
        {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull: {images: { filename: { $in: req.body.deleteImages }}}})
    }
    
    req.flash('success', 'Successfully Updated your Campground')
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;


    const deletedCampground = await Campground.findByIdAndDelete(id);
    res.redirect(`/campgrounds`);

}
module.exports.postCampground = async (req, res, next) => {
    
    //if (!req.body.campground) throw new ExpressError('invalid data', 400);
    
    const camp = new Campground(req.body.campground);
    camp.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    camp.author = req.user._id;
    await camp.save();
    console.log(camp);
    req.flash('success', 'Successfully Made a New Campground')
    res.redirect(`/campgrounds/${camp._id}`);

}