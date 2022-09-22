const express = require('express');
var bird_controller = require('../controllers/bird_controller');
var BirdModel = require('../models/birds.js');
var fs = require('fs');
const path = require('path');

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

//for image
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' }, {preservePath: true});
// upload.preservePath = true;
// const path = require('path');
// const util = require('util');

//image express ver
const exp = require('express-fileupload');


// TODO: finishe the "Create" route(s)
router.get('/create', async (req, res) => {
    console.log('create');
    
    // console.log(req);
    // currently does nothing except redirect to home page
    res.render('createPage');
});

router.use(
    exp()
);

//var image = upload.single('myFile');
//router.post('/create', image, async (req, res) => {
router.post('/create', async (req, res) => {
    console.log('post create');
    console.log(req.body);
    console.log(req.body.pName);
    console.log(req.files.myFile);
    // req.file.filename = originalname;
    
    // console.log(req.file);
    // var tempPath = req.file.path;
    // console.log(tempPath);
    // var targetPath = req.file.originalname;
    // console.log(targetPath);

   // var current = fs.createReadStream();
    // fs.readFile(tempPath,  function (err, data) {
    //     if(err){
    //         console.log('ERORRRR');
    //         throw err; //fail if it cant be read
    //     } 
    //     // fs.writeFile(targetPath, data, function (err) {
    //     //     if(err){
    //     //         console.log(err);
    //     //         console.log('image upload error');
    //     //     }else{
    //     //         console.log('image upload worked');
    //     //         res.render('/');
    //     //     }
            
    //     // })
    //     console.log('read file complete');
    // });
    if (!req.files) {
        return res.status(400).send("No files were uploaded.");
    }

    const fileImg = req.files.myFile
    const fromPath = path.join(__dirname, "../public/images/", fileImg.name);
    console.log(`path: ${fromPath}`);
    
    fileImg.mv(fromPath, function(err) {
        if(err){
            console.log('file error');
            return res.status(500).send(err);
        }else{
            console.log('file uploaded');
        }
    } );
    
    // const copyFile = util.promisify(fs.copyFile);
    // const img = req.file;
    // const results = Object.keys(img).map((key) => {
    //     const f = img[key];
    //     const dest = path.join('uploads/', f.name);
    //     return copyFile(f.path, dest);
    // });
    // await Promise.all(results);


    const newBird = {
        primary_name: req.body.pName,
        english_name: req.body.eName,
        scientific_name: req.body.sName,
        order: req.body.ord,
        family: req.body.fam,
        status: req.body.cStatus,
        photo: {
            credit: req.body.credit,
            source: fileImg.name
        },
        size: {
            height: {
                value: req.body.height,
                units: "g"
            },
            weight: {
                value: req.body.weight,
                units: "cm"
            }
        },
        other_names: req.body.other_names

    };

    console.log(newBird);
    const bird_info = await BirdModel.create(newBird);
    //console.log(bird_info, '/birds/create response');
    //res.send('success!');

   



    res.redirect('/');
});

// TODO: get individual bird route(s)
router.get('/bird', async (req, res) => {
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
router.get('/delete', async (req, res) => {
     console.log(req.query.name);
    var bird = await BirdModel.findOne({scienfitic_name: req.query.name});
    console.log(bird._id.toString());
    // const idd = req.id;
    // console.log(bird);
    
    const bd_info = await BirdModel.findOneAndDelete({scientific_name: req.query.name});
    console.log(bd_info, 'birds/delete response');

    res.redirect('/');
});

router.get('*', (req, res) => {
    res.status(404);
    res.render('404');
});

module.exports = router; // export the router
