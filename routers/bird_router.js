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


//image express ver
const exp = require('express-fileupload');


// TODO: finishe the "Create" route(s)
router.get('/create', async (req, res) => {
    try {
        //console.log('create');

        // console.log(req);
        // currently does nothing except redirect to home page
        res.render('createPage');
    } catch (error) {
        errorMessage(res);
    }

});

//need this for some reason
//errors otherwise
router.use(
    exp()
);

//var image = upload.single('myFile');
//router.post('/create', image, async (req, res) => {
router.post('/create', async (req, res) => {
    try {
        //console.log('post create');
        //console.log(req.body);
        //console.log(req.body.pName);
        //console.log(req.files.myFile);
        var filePath;

        if (!req.files) {
            filePath = 'default.jpg'
            //return res.status(400).send("No files were uploaded.");
        } else {
            const fileImg = req.files.myFile
            const fromPath = path.join(__dirname, "../public/images/", fileImg.name);
            //console.log(`path: ${fromPath}`);
            filePath = fileImg.name;
            fileImg.mv(fromPath, function (err) {
                if (err) {
                    console.log('file error');
                    return res.status(500).send(err);
                } else {
                    console.log('file uploaded');
                }
            });
        }


        console.log(filePath);
        // const copyFile = util.promisify(fs.copyFile);
        // const img = req.file;
        // const results = Object.keys(img).map((key) => {
        //     const f = img[key];
        //     const dest = path.join('uploads/', f.name);
        //     return copyFile(f.path, dest);
        // });
        // await Promise.all(results);
        //console.log(`other names: ${req.body.oName}\n`);
        const namesArr = req.body.oName.split(" ");
        //console.log(`arr ver: ${namesArr}\n`);

        const newBird = {
            primary_name: req.body.pName,
            english_name: req.body.eName,
            scientific_name: req.body.sName,
            order: req.body.ord,
            family: req.body.fam,
            status: req.body.cStatus,
            photo: {
                credit: req.body.credit,
                source: filePath
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
            other_names: namesArr

        };

        console.log(newBird);
        const bird_info = await BirdModel.create(newBird);
        //console.log(bird_info, '/birds/create response');
        //res.send('success!');





        res.redirect('/');
    } catch (error) {
        // errorMessage(res);
        console.log(error);
    }

});

// TODO: get individual bird route(s)
router.get('/bird', async (req, res) => {

    //console.log(req);
    try {
        const id = req.query.name;
        //console.log('get bird');

        bird = await BirdModel.findById({ _id: id });

        res.render('bird_page', {

            birds: bird
        });
    } catch (error) {
        errorMessage(res);
    }

});

/* route the default URL: `/birds/ */
router.get('/', async (req, res) => {
    try {
        // extract the query params
        const search = req.query.search;
        const status = req.query.status;
        const sort = req.query.sort;
        //console.log(req);

        //console.log('home');
        //var birds =await  bird_controller.filter_bird_data(search, status, sort);

        res.render('home', {
            birds: await bird_controller.filter_bird_data(search, status, sort)

        });
    } catch (error) {
        errorMessage(res);
    }


})

// TODO: Update bird route(s)
router.get('/edit', async (req, res) => {
    try {
        //console.log('edit');
        bird = await BirdModel.findOne({ _id: req.query.name });
        //console.log(`request id: ${bird._id}\n`);
        // console.log(`request id2: ${req.query.name}\n`);
        //console.log(bird);
        res.render('editPage', {
            birds: bird
        });
        // res.render('editPage');
    } catch (error) {
        errorMessage(res);
    }

});

router.post('/edit', async (req, res) => {
    try {
        //console.log("Edit time");
        //console.log(req.body.birdID);

        //console.log(req.query);
        bird = await BirdModel.findById({ _id: req.body.birdID });
        //var d = document.querySelector('select');

        //console.log(`id?1?: ${bird}`);
        //console.log(`id?asd1?: ${bird._id}`);
        const namesArr = req.body.oName.split(" ");

        var filePath;

        if (!req.files) {
            filePath = bird.photo.source;
            //return res.status(400).send("No files were uploaded.");
        } else {
            const fileImg = req.files.myFile
            const fromPath = path.join(__dirname, "../public/images/", fileImg.name);
            //console.log(`path: ${fromPath}`);
            filePath = fileImg.name;
            fileImg.mv(fromPath, function (err) {
                if (err) {
                    console.log('file error');
                    return res.status(500).send(err);
                } else {
                    console.log('file uploaded');
                }
            });
        }


        //console.log(filePath);

        const newBird = {
            primary_name: req.body.pName,
            english_name: req.body.eName,
            scientific_name: req.body.sName,
            order: req.body.ord,
            family: req.body.fam,
            status: req.body.cStatus,
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
            photo: {
                source: filePath,
                credit: req.body.credit
            },
            other_names: namesArr


        };
        // if (!req.files) {
        //     // return res.status(400).send("No files were uploaded.");
        //     console.log('bird file not updated');
        //     // const fileImg = 
        // } else {
        //     console.log('file updated');
        //     const fileImg = req.files.myFile
        //     const fromPath = path.join(__dirname, "../public/images/", fileImg.name);
        //     console.log(`path: ${fromPath}`);
        //     fileImg.mv(fromPath, function (err) {
        //         if (err) {
        //             console.log('file error');
        //             errorMessage(res);
        //         } else {
        //             console.log('file uploaded');
        //         }
        //     });
        //     newBird.photo.source = fileImg.name;
        // }


        console.log(newBird);
        const bird_info = await BirdModel.findByIdAndUpdate(bird._id, newBird);
        //console.log(`info: ${bird._id}`);


        res.redirect(`/birds/bird/?name=${bird._id}`);
    } catch (error) {
        // errorMessage(res);
        console.log(error);
        res.redirect(`/birds/bird/?name=${bird._id}`);
    }


});
// TODO: Delete bird route(s)
router.get('/delete', async (req, res) => {
    try {
        //console.log(req.query.name);
        var bird = await BirdModel.findOne({ scienfitic_name: req.query.name });
        //console.log(bird._id.toString());
        // const idd = req.id;
        // console.log(bird);

        const bd_info = await BirdModel.findOneAndDelete({ scientific_name: req.query.name });
        //console.log(bd_info, 'birds/delete response');

        //do i need to delete the image from /images?


        res.redirect('/');
    } catch (error) {
        errorMessage(res);
    }

});

router.get('*', (req, res) => {
    res.status(404);
    res.render('404');
});


function errorMessage(res) {
    res.status(404);
    res.render('404');
}

module.exports = router; // export the router

