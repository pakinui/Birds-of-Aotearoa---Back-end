//const birds_json = require('../public/nzbird.json');
const { bird_sort, search_string } = require('./bird_utils.js');

var BirdModel = require('../models/birds.js');
const { response } = require('express');

// get all birds (filtered)
async function filter_bird_data(search, status, sort) {
    //var results = birds_json;

    // BirdModel.findOne({'primary_name' : 'Weka'}, 'primary_name order', function(err, bird) {
    //     if(err) handleError(err);
    //     console.log('sci: %s, order: %s\n', bird.primary_name, bird.order);
    // });

    var b =  await BirdModel.find({});
    
    b = await BirdModel.aggregate([ {$unwind: '$size'}]);
    
    
    b = await BirdModel.aggregate( [ { $unwind : '$photo' } ]);
    
    
    

    // filter by conservation status 
    if (status !== undefined && status !== "All") {
        //results = results.filter((b) => b.status == status);
        b = b.filter((b) => b.status == status);
        
        // b = await BirdModel.find({ status: status}, 'english_name status', function(err, bird){
        //     if(err) handleError(err);
        //     console.log('eng: %s, status: %s\n', bird.english_name, bird.status);
        // })
    }
    // filter by search string
    if (search !== undefined && search !== "") {
        //results = search_string(results, search);
        
        b = search_string(b, search);
        
    }
    // sort by
    if (sort !== undefined) {
        //results = bird_sort(results, sort);
        b = bird_sort(b, sort);
        
    }
    //console.log(BirdModel.length);
    //console.log(results);
    
    //console.log(`--${status}, ${search}, ${sort}--`);
    //console.log(results.length);

    //return results;
    //console.log(b);
    return b;
}

module.exports = { filter_bird_data };
/**
 * exports data so that it can be usde in another file
 * 
 * const d = require('./bird_controller.js');
 */