const express = require('express')
const app = express()
const http = require('http').Server(app)
const rp = require('request-promise')

const content = {
    name: [/<span class="indexed-biz-name">[\s\S]*?<\/span>/g, /<span >[\s\S]*?<\/span>/, "<span >", "</span>"],
    address: [/<address>[\s\S]*?<\/address>/g, /<address>[\s\S]*?<\/address>/, "<address>", "</address>", "<br>", ", "],
    id: [/<span class="indexed-biz-name">[\s\S]*?<\/span>/g, /href="[\s\S]*?\"/, "href=\"/biz/", "\""],
    rating: [/<div class="i-stars[\s\S]*?rating">/g, /title="[\s\S]*?rating/, "title=\"", " star rating"],
    price: [/<span class="business-attribute price-range">[\s\S]*?<\/span>/g, />[\s\S]*?</, ">", "<"],
    hours: [/Open:[\s\S]*?[\n]/g, /[\d][\s\S]*/, "", ""],
    phone: [/<span class="biz-phone">[\s\S]*?<\/span>/g, />[\s\S]*?</, ">", "<"]
}


http.listen(8000, "0.0.0.0", function() {
    console.log('Outdoor dining backend listening on port 8000!');
});

app.get("/letsdineout", (req, res) => {
    console.log("Request received!")
    rp(buildURL(parseFloat(req.query.long), parseFloat(req.query.lat), parseInt(req.query.d)))
        .then(function (htmlString) {
            return runParser(htmlString)
        })
        .then(function(listings) {
            res.send(listings)
        })
        .catch(function (err) {
            console.log(err)
        });
})



function scrape(listingsTemp, content, key, input, focus, start, end, middle, midreplace) {
    middle = middle || null
    midreplace = midreplace || null
    let results = content.match(input)
    console.log("Result:", results)
    cleanup(listingsTemp, key, results, focus, start, end, middle, midreplace)
}

function cleanup(listingsTemp, key, results, entry, start, end, middle, midreplace) {
    for (let i = 0; i < results.length; i++) {
        let result = results[i].match(entry)
        let cleandata = result[0].replace(start, "").replace(middle, midreplace).replace(end, "").trim()
        if (listingsTemp[i] === undefined) {
            listingsTemp.push({})
        }
        listingsTemp[i][key] = cleandata
    }
}

function runParser(html) {
    let listingsTemp = []
    for (let key in content) {
        scrape(listingsTemp, html, key, ...content[key])
    }
    return listingsTemp
}

function getCoordinates(longitude, latitude, distance) {
    let coordinates = {}
    let minLong = .0032
    let minLat = .00244
    coordinates.startLong = longitude - (minLong * distance)
    coordinates.endLong = longitude + (minLong * distance)
    coordinates.startLat = latitude - (minLat * distance)
    coordinates.endLat = latitude + (minLat * distance)
    return coordinates.startLong + "," + coordinates.startLat + "," + coordinates.endLong + "," + coordinates.endLat
}

function getTime() {
    let date = new Date()
    let dayOfWeek = (date.getDay() == 0) ? date.getDay() + 6 : date.getDay() - 1
    let hourOfDay = date.getHours()
    let minute = date.getMinutes()
    return dayOfWeek * 1440 + hourOfDay * 60 + minute
}

function buildURL(longitude, latitude, distance) {
    return 'https://www.yelp.com/search?&attrs=OutdoorSeating&open_now=' + getTime() + '&l=g:' +
        getCoordinates(longitude, latitude, distance)

}
