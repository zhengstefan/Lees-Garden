require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const fs = require("fs").promises;
const path = require("path");
var favicon = require('serve-favicon');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static("lib"));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon_package_v0.16', 'favicon.ico')));

app.set('view engine', 'ejs');

/* Footer Year */
const thisYear = new Date().getFullYear();

/* Google Total Reviews Widget */
const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJr99LYO8gvUcRrfxkVQhwB7c&fields=name,rating,user_ratings_total,reviews&key=${process.env.GOOGLEAPIKEY}`;
const cacheFile = path.join(__dirname, 'cache', 'places_data.json');
const cacheDuration = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

// Ensure cache directory exists
async function ensureCacheDir() {
    try {
        await fs.mkdir(path.join(__dirname, 'cache'), { recursive: true });
    } catch (err) {
        console.error('Error creating cache directory:', err);
    }
}

// Function to check if cache is valid
async function getCachedData() {
    try {
        const stats = await fs.stat(cacheFile);
        const cacheAge = Date.now() - stats.mtimeMs;
        if (cacheAge < cacheDuration) {
            const data = await fs.readFile(cacheFile, 'utf8');
            return JSON.parse(data);
        }
        return null; // Cache is outdated or doesn't exist
    } catch (err) {
        return null; // Cache file doesn't exist or error occurred
    }
}

// Function to save data to cache
async function saveCachedData(data) {
    try {
        await fs.writeFile(cacheFile, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Error writing to cache file:', err);
    }
}

app.get("/", async function (req, res) {
    await ensureCacheDir();

    // Try to get cached data
    const cachedData = await getCachedData();
    if (cachedData) {
        // Use cached data
        res.render('index', {
            rating: cachedData.result.rating,
            userRatingsTotal: cachedData.result.user_ratings_total,
            reviews: cachedData.result.reviews || [],
            googleApiKey: process.env.GOOGLEAPIKEY,
            year: thisYear
        });
        return;
    }

    // Fetch new data from API if no valid cache
    https.get(url, function (response) {
        let data = '';
        response.on("data", function (chunk) {
            data += chunk;
        });
        response.on("end", async function () {
            try {
                const totalReviewData = JSON.parse(data);
                if (totalReviewData.status === "OK") {
                    // Save to cache
                    await saveCachedData(totalReviewData);
                    // Render response
                    res.render('index', {
                        rating: totalReviewData.result.rating,
                        userRatingsTotal: totalReviewData.result.user_ratings_total,
                        reviews: totalReviewData.result.reviews || [],
                        googleApiKey: process.env.GOOGLEAPIKEY,
                        year: thisYear
                    });
                } else {
                    console.error('Google API error:', totalReviewData.status);
                    res.status(500).send('Error fetching Google Places data');
                }
            } catch (err) {
                console.error('Error parsing API response:', err);
                res.status(500).send('Server error');
            }
        });
    }).on("error", function (err) {
        console.error('Error fetching Google Places API:', err);
        res.status(500).send('Error fetching Google Places data');
    });
});

app.get("/speisekarte", function (req, res) {
    res.render('speisekarte', { year: thisYear });
});

app.get("/restaurant", function (req, res) {
    res.render('restaurant', { year: thisYear });
});

app.get("/impressum", function (req, res) {
    res.render('impressum', { year: thisYear });
});

app.get("/datenschutz", function (req, res) {
    res.render('datenschutz', { year: thisYear });
});

/* Server */
app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on port 3000.");
});