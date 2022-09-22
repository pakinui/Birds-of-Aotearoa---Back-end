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
    // photo_credit: {type: String, required:true},
    // photo: {type: String, required:true},
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
    // length_value: {type: Number, required:true},
    // length_units: {type: String, required:true},
    // weight_value: {type: Number, required:true},
    // weight_units: {type: String, required:true},
    other_names: [{type: String, required:false}]
    
    //how to make this take multiple strings??
    
});

const BirdModel = mongoose.model('bird', birdSchema);

//export the model
module.exports = BirdModel;

// {
//     "_id":{"$oid":"632b914c1335979628e80d91"},
//     "primary_name":"Whio",
//     "english_name":"Blue duck",
//     "scientific_name":"Hymenolaimus malacorhynchos",
//     "order":"Anseriformes",
//     "family":"Anatidae",
//     "other_names":["Blue duck","mountain duck","blue mountain duck"],
//     "status":"Nationally Vulnerable",
//     "photo":{
//       "credit":"Les Feasey",
//       "source":"blue-duck-5.jpg"
      
//     },
//     "size":{
//       "height":{
//         "value":{"$numberDouble":"52.5"},
//         "units":"cm"
        
//       },
//       "weight":{
//         "value":{"$numberInt":"835"},
//         "units":"g"
        
//       }
      
//     }
    
//   }