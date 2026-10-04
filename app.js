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
        author: "Ewald",
        date: "2. März 2026",
        text: "Ist ein sehr schönes Restaurant. Schönes Ambiente."
    },
    {
        author: "David",
        date: "2. März 2026",
        text: "Preis-Leistung absolut gut. Das Abendbuffet kostete im Dezember 2025 16,80 €."
    },
    {
        author: "Hummel",
        date: "2. März 2026",
        text: "Wir haben dort Buffet gegessen und waren sehr zufrieden. Es wurde schnell nachgelegt, die Behälter waren nicht zu groß, so dass alles immer frisch war. Sehr gutes Preis-Leistungs-Verhältnis."
    },
    {
        author: "Martin",
        date: "2. März 2026",
        text: "Abwechslungsreich und lecker! Das Buffet ist wirklich empfehlenswert."
    },
    {
        author: "Im",
        date: "2. März 2026",
        text: "Wir besuchen das Restaurant als Familie sehr oft, mindestens einmal im Monat. Es ist wirklich wunderschön und das Essen ist toll. Unser Favorit ist das All-you-can-eat-Buffet, aber auch die anderen Gerichte aus der Speisekarte sind fantastisch."
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
