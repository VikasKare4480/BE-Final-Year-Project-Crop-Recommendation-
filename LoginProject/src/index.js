const express = require('express');
const app = express();
const path = require('path');

const collection = require("./mongodb")

const hbs = require('hbs');
const tempelatesPath = path.join(__dirname, '../tempelates')
const session = require('express-session');
const multer = require('multer');

//for get adminpage

const { MongoClient } = require('mongodb');
const uri = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri);


//const storage = multer.memoryStorage();
//const upload = multer({ storage: storage, limits: { files: 1 } });
//const flash = require('connect-flash');
//const prompt = require('prompt-sync');

app.use(express.json());
app.set("view engine", "hbs")
app.set("views", tempelatesPath)
app.use(express.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, '../public/uploads/')));


var storage = multer.diskStorage({
    destination: "./public/uploads/",
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});

var upload = multer({
    storage: storage
});

var multipleUpload = upload.fields([{ name: 'fimg' }, { name: 'seventimg' }, { name: 'eightAimg' }])


app.get('/', (req, res) => {

    res.render("home")
})

app.get('/login.hbs', (req, res) => {

    res.render("login")
})

app.get('/signup.hbs', (req, res) => {

    res.render("signup")
})

app.post('/signup', multipleUpload, async(req, res) => {
    const { name, email, mobile, password, cpassword } = req.body;
    const fimg = req.files['fimg'][0].filename;
    const seventimg = req.files['seventimg'][0].filename;
    const eightAimg = req.files['eightAimg'][0].filename;

    const data = {
        name,
        email,
        mobile,
        password,
        cpassword,
        fimg,
        seventimg,
        eightAimg
    };

    try {
        await collection.insertMany([data]);
        res.render("login");
    } catch (error) {
        // Handle the error accordingly
        res.status(500).send("Error while signing up");
    }
});


app.get('/Adminpage.hbs', async(req, res) => {
    try {

        await client.connect();
        const db = client.db('LoginSignup'); // Replace with your database name
        const collection = db.collection('farmerdatacollections'); // Replace with your collection name

        const allUsers = await collection.find({}).toArray();
        res.render('Adminpage', { users: allUsers });

    } catch (error) {
        console.error("Error fetching all users:", error);
        res.status(500).send('Error fetching all users');
    }
});





app.post('/login', async(req, res) => {

    try {

        const check = await collection.findOne({ email: req.body.email })
        if (check.password === req.body.password) {
            res.render("home")
        } else {

            res.render("login", { error: 'Invalid email or password' });
        }
    } catch {

        res.render("login", { error: 'Invalid email or password' });
    }


})

app.listen(4500, () => {
    console.log("port connected");
})