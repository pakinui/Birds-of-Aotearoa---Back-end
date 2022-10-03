const { bird_sort, search_string } = require('./bird_utils.js');

var BirdModel = require('../models/birds.js');
const { response } = require('express');

// get all birds (filtered)
async function filter_bird_data(search, status, sort) {

    var b =  await BirdModel.find({});
    
    b = await BirdModel.aggregate([ {$unwind: '$size'}]);
    b = await BirdModel.aggregate( [ { $unwind : '$photo' } ]);

    // filter by conservation status 
    if (status !== undefined && status !== "All") {
        b = b.filter((b) => b.status == status);

    }
    // filter by search string
    if (search !== undefined && search !== "") { 
        b = search_string(b, search);
        
    }
    // sort by
    if (sort !== undefined) {
        b = bird_sort(b, sort);
        
    }
    return b;
}

module.exports = { filter_bird_data };
/**
 * exports data so that it can be usde in another file
 * 
 * const d = require('./bird_controller.js');
 */