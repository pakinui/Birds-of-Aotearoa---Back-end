const express = require('express');
var bird_controller = require('../controllers/bird_controller');
var BirdModel = require('../models/birds.js');

//////
const user = process.env.ATLAS_USER;
const password = process.env.ATLAS_PASSWORD;
const db_name = 'NZ_birds';
const db_url = `mongodb+srv://${user}:${password}@cluster0.wghcjdv.mongodb.net/${db_name}`;
//////

/* create a router (to export) */
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
// web server setup

router.use(express.json());

const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });


// TODO: finishe the "Create" route(s)
router.get('/create', async (req, res) => {
    console.log('create');
    // console.log(req);
    // currently does nothing except redirect to home page
    res.render('createPage');
});

var image = upload.single('myFile');
router.post('/create', image, async (req, res) => {
    console.log('post create');
    console.log(req.body);
    console.log(req.body.pName);

    // const response = await fetch('./birds/create', {
    //     method: 'POST',
    //     body: JSON.stringify(birdData),
    //     header: {
    //         'Content-Type' : 'application/json'
    //     }
    // }) ;
    // console.log(await response.text());
    // currently does nothing except redirect to home page
    //create new bird element on page
    

    // const name = req.query.pName;
    // console.log(name);
    // console.log(`primary naem = ${req.body.primary_name}`);
    //console.log(req);
    var tempPath = req.files.myFile.path;
    var targetPath = 'uploads/' + req.files.myFile.name;

    
    const newBird = {
        primary_name: req.body.pName,
        english_name: req.body.eName,
        scientific_name: req.body.sName,
        order: req.body.ord,
        family: req.body.fam,
        status: req.body.cStatus,
        photo: {
            credit: req.body.credit,
            source: tempPath
        },
        size: {
            height: {
                value: req.body.height,
                units : "g"
            },
            weight: {
                value: req.body.weight,
                units: "cm"
            }
        }
        
    };
   
    console.log(newBird);
    const bird_info = await BirdModel.create(newBird);
    console.log(bird_info, '/birds/create response');
    //res.send('success!');
    
 //   const birdInfo = JSON.stringify(newBird);
    //const new_b = await BirdModel.create(newBird);
    //console.log(new_b, 'birds/create response');

    //tell cliuent it worked
   // res.send('success! message create');


    
    res.redirect('/');
});

// TODO: get individual bird route(s)
router.get('/bird',  async (req, res) => {
    console.log('get bird');
    //console.log(req);
    const id = req.query.name;
    
    //const search = req.query.search;
    const status = req.query.status;
    const sort = req.query.sort;
  
   
    // render the Pug template 'home.pug' with the filtered data
    //this means the data from bird_con.. = birds?
    res.render('bird_page', {
       
        birds: await bird_controller.filter_bird_data(id, status, sort)
    });
});

/* route the default URL: `/birds/ */
router.get('/', async (req, res) => {
    // extract the query params
    const search = req.query.search;
    const status = req.query.status;
    const sort = req.query.sort;
    //console.log(req);

    console.log('home');
    //var birds =await  bird_controller.filter_bird_data(search, status, sort);
    res.render('home', {
        birds: await bird_controller.filter_bird_data(search, status, sort)
    });

})

// TODO: Update bird route(s)
// router.get('/edit', async (req, res) => {

// });

// TODO: Delete bird route(s)
// router.get('/delete', async (req, res) => {

// });

router.get('*', (req, res) => {
    res.status(404);
    res.render('404');
});

module.exports = router; // export the router
