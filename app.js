require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
var favicon = require('serve-favicon')
var path = require('path')



const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static("lib"));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon_package_v0.16', 'favicon.ico')));


app.set('view engine', 'ejs');

/* Footer Year */

const thisYear = new Date().getFullYear();


/* Google Total Reviews Widget */


const url = "https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJr99LYO8gvUcRrfxkVQhwB7c&fields=name,rating,user_ratings_total&key=" + process.env.GOOGLEAPIKEY;

app.get("/", function (req, res) {
    
    https.get(url, function (response) {
        response.on("data", function (data) {
            const totalReviewData = JSON.parse(data);
            
            const name = totalReviewData.result.name;
            const rating = totalReviewData.result.rating;
            const userRatingsTotal = totalReviewData.result.user_ratings_total;

            res.render('index', {
                
                rating: rating,
                userRatingsTotal: userRatingsTotal,
                year: thisYear,
                googleApiKey: process.env.GOOGLEAPIKEY
                
            })

        });

    })
    
})


app.get("/speisekarte", function (req, res) {
    res.render('speisekarte', {
        year: thisYear
    });
});

app.get("/restaurant", function (req, res) {
    res.render('restaurant', {
        year: thisYear
    });
});

app.get("/impressum", function (req, res) {
    res.render('impressum', {
        year: thisYear
    });
});

app.get("/datenschutz", function (req, res) {
    res.render('datenschutz', {
        year: thisYear
    });
});


/* Server */

app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on port 3000.");
})

