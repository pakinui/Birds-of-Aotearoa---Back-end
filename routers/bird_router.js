const express = require('express');
var bird_controller = require('../controllers/bird_controller');
var BirdModel = require('../models/birds.js');
var fs = require('fs');
const path = require('path');

/* create a router (to export) */
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));

router.use(express.json());

//image express ver
const exp = require('express-fileupload');

//express file upload (images)
router.use(
    exp()
);

/**
 * Create bird page
 */
router.get('/create', async (req, res) => {
    try {
        res.render('createPage');
    } catch (error) {
        errorMessage(res);
    }
});

/**
 * Post the create bird
 */
router.post('/create', async (req, res) => {
    try {
        var filePath;
        if (!req.files) {//if no file uploaded
            filePath = 'default.jpg';
        } else {
            const fileImg = req.files.myFile
            const fromPath = path.join(__dirname, "../public/images/", fileImg.name);

            filePath = fileImg.name;
            var valid = validateImg(fileImg.name);
            if (valid == 'y') {//valid img file
                //move file
                fileImg.mv(fromPath, function (err) {
                    if (err) {
                        console.log('file error');
                        return res.status(500).send(err);
                    } else {
                        console.log('file uploaded');
                    }
                });
            }else{//not valid img file
                filePath = 'default.jpg';
            }
        }

        var namesArr;
        if (req.body.oName.includes(',')) {//if split by commas
            namesArr = req.body.oName.split(',');
        } else {//otherwise split by arrays
            namesArr = req.body.oName.split(' ');
        }

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

        const bird_info = await BirdModel.create(newBird);//add to MongoDB
        res.redirect('/');
    } catch (error) {
        console.log(error);
    }
});

/**
 * Individual bird pages by _id.
 */
router.get('/bird', async (req, res) => {
    try {
        const id = req.query.id;
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
        const search = req.query.search;
        const status = req.query.status;
        const sort = req.query.sort;

        res.render('home', {
            birds: await bird_controller.filter_bird_data(search, status, sort)
        });
    } catch (error) {
        errorMessage(res);
    }
});

/**
 * Edit bird page
 */
router.get('/edit', async (req, res) => {
    try {
        bird = await BirdModel.findOne({ _id: req.query.id });

        res.render('editPage', {
            birds: bird
        });
    } catch (error) {
        errorMessage(res);
    }

});
/**
 * Post the edited bird.
 * birdId is a hidden input on the form that holds the birds '_id'.
 * Checks if file uploaded is an accepted image file (png, jpg or jpeg), 
 * if not valid, it does not change the bird's image.
 */
router.post('/edit', async (req, res) => {
    try {
        bird = await BirdModel.findById({ _id: req.body.birdID });
        const namesArr = req.body.oName.split(/\r?\n/);
        var filePath;

        if (!req.files) {//if image file not uploaded
            filePath = bird.photo.source;
        } else {
            const fileImg = req.files.myFile;
            var v = validateImg(fileImg.name);

            if (v == 'y') {//image is png, jpg or jpeg
                const fromPath = path.join(__dirname, "../public/images/", fileImg.name);
                filePath = fileImg.name;
                fileImg.mv(fromPath, function (err) {
                    if (err) {
                        console.log('file error');
                        return res.status(500).send(err);
                    } else {
                        console.log('file uploaded');
                    }
                });
            } else {//wrong file type
                console.log("not an accepted image file (png, jpg, jpeg)");
                filePath = bird.photo.source;//keep old image
            }
        }
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

        const bird_info = await BirdModel.findByIdAndUpdate(bird._id, newBird);
        res.redirect(`/birds/bird/?id=${bird._id}`);
    } catch (error) {
        // errorMessage(res);
        console.log(error);
        res.redirect(`/birds/bird/?id=${bird._id}`);
    }
});

/**
 * Function to validate if file is an img file or not.
 * If file is a png, jpg or jpeg, then 'y' is returned,
 * otherwise 'n' is returned.
 */
function validateImg(filename) {
    var extensionLength = filename.lastIndexOf(".") + 1;//get filename without string
    console.log(filename);
    var extension = filename.substr(extensionLength, filename.length).toLowerCase();
    console.log(extension);
    if (extension == "jpg" || extension == "png" || extension == "jpeg") {
        return 'y';
    } else {
        return 'n';
    }
}

/**
 * Deletes a bird by _id.
 * Redirects to home.
 */
router.get('/delete', async (req, res) => {
    try {
        const bird = await BirdModel.findOneAndDelete({ _id: req.query.id });
        res.redirect('/');
    } catch (error) {
        errorMessage(res);
    }

});

/**
 * Matches any path not specifed above.
 * Sends to 404 error page.
 */
router.get('*', (req, res) => {
    res.status(404);
    res.render('404');
});

/**
 * Function to display to 404 error page.
 */
function errorMessage(res) {
    res.status(404);
    res.render('404');
}

module.exports = router; // export the router

