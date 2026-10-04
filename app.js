require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
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
const testimonials = [
    {
        author: "Joshua M.",
        date: "19. August 2024",
        text: "All you can eat with good food. What more could you ask for :) Good staff"
    },
    {
        author: "Lab B.",
        date: "21. Dezember 2023",
        text: "I found this good buffet Restaurant that only costs 14,85€ per person. The place was nice and cozy it was really homie type of Asian Restaurant. The service was great and the Service crews were friendly. The food tasted good and authentic Chinese food but I can taste some of msg but it’s okay. Food variants from vegetables, sushi, soup, chicken, duck, pork, beef and seafoods. I will definitely go back to this place."
    },
    {
        author: "另美美",
        date: "3. Oktober 2023",
        text: "I found the experience delightful the food eas traditional the servers were very nice the atmosphere was so calm."
    },
    {
        author: "Qide Y.",
        date: "26. Dezember 2021",
        text: "Awesome place to spend some quality time with your family. Excellent variety and quality of Chinese food. Absolut lovely owner and definitely worthy to come back."
    }
];

app.get("/", function (req, res) {
    res.render('index', {
        testimonials: testimonials,
        year: thisYear
    });
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
