const dotenv = require('dotenv')
const path = require('path');
const express = require('express');
const bird_router = require('./routers/bird_router');
const image_router = require('./routers/image_router');
const bird = require('./models/birds');
const bodyParser = require('body-parser');
/**
 * My PORT is 8828 instead of 8080 beccause in the labs 
 * 8080 would not work for some reason.
 */

/* load .env */
dotenv.config();

/* create Express app */
const app = express();

/* setup Express middleware */
// Pug for SSR (static site rendering)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

/* host static resources (.css, .js, ...) */
app.use('/images/', image_router);
app.use('/', express.static(path.resolve(__dirname, 'public/')));

/* redirect root route `/` to `/birds/` */
app.get('/', (req, res) => {
    res.redirect('/birds/');
});

app.use('/birds/', bird_router);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('*', (req, res) => {
    res.status(404);
    res.render('404');
});

// Database
const mongoose = require("mongoose");

const user = process.env.ATLAS_USER;
const password = process.env.ATLAS_PASSWORD;
const db_name = 'NZ_birds';
const db_url = `mongodb+srv://${user}:${password}@cluster0.wghcjdv.mongodb.net/${db_name}`;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}
mongoose.connect(db_url, options).then(() => {
    console.log('successfully connected!')

}).catch((e) => {
    console.error(e, 'could not connect!')
});

/* start the server */
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is live http://localhost:${PORT}`);
});

