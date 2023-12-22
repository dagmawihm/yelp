const mongoose = require('mongoose');
const Campground = require('../models/campground');

const titles = require('./title');
const descriptions = require('./descriptions');
const cityStatePairs = require('./location');

tlength = titles.length;
dlength = descriptions.length;
clength = cityStatePairs.length;


mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp')
    .then(() => {
        console.log("CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO ERROR!!!!")
        console.log(err)
    });

const seed = async () =>{
    await Campground.deleteMany({});
for (let a = 0; a<101; a++)
{
    const camp = new Campground({
        author: '65849dbaa117b6a3f5a046c6',
        title: titles[Math.floor(Math.random() * tlength)],
        image: 'https://source.unsplash.com/collection/483251',
        price: Math.floor(Math.random() * (300 - 50 + 1)) + 50,
        description: descriptions[Math.floor(Math.random() * dlength)],
        location: `${cityStatePairs[Math.floor(Math.random() * clength)].city}, ${cityStatePairs[Math.floor(Math.random() * clength)].state}`,
    });
    await camp.save()
    .then(camp => {
        console.log(camp);

    })
    .catch(e => {
        console.log(e);
    });
}


}

seed().then(() => {
    mongoose.connection.close()
});


