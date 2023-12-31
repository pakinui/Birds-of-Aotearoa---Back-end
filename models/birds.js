const mongoose = require('mongoose');

//create the schema
const birdSchema = new mongoose.Schema({
    primary_name: {type: String, required:true},
    english_name: {type: String, required:true},
    scientific_name: {type: String, required:true},
    order: {type: String, required:true},
    family: {type: String, required:true},
    status: {type: String, required:true},
    photo: {
        credit: {type: String, required: true},
        source: {type: String, required: true}
    },  
    size: {
        height: {
            value: {type:Number, required: true},
             units: {type: String, required: true}
        }, 
        weight: {
            value: {type:Number, required: true},
            units: {type: String, required: true}
        }
    },
    other_names: [{type: String, required:false}]
    
});

const BirdModel = mongoose.model('bird', birdSchema);

//export the model
module.exports = BirdModel;
