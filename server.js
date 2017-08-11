const express = require('express')
const request = require('request')
const app = express()

const scrapeIt = require('scrape-it')
const adsController = require('./controllers/Ads')


const GumtreeService = require('./services/Gumtree')

app.get('/scrape', adsController.get)
app.get('/devTest', async (req, res) => {
  console.log(GumtreeService)
  const test = new GumtreeService()

  res.send(await test.getAdsUrl())
})

app.listen('8080')

console.log('Magic happens on http://localhost:8080');

exports = module.exports = app;
