const express = require('express')
const request = require('request')
const app = express()

const scrapeIt = require('scrape-it')
const adsController = require('./controllers/Ads')

app.get('/scrape', adsController.get)

app.listen('8080')

console.log('Magic happens on http://localhost:8080');

exports = module.exports = app;
