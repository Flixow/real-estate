const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const scrapeIt = require('scrape-it')
const adsController = require('./controllers/Ads')
const githubController = require('./controllers/Github')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('It works!')
})
app.get('/scrape', adsController.get)

app.get('/payload', (req, res) => {
  res.sendStatus(200)
  console.log('get /payload')
});
app.post('/payload', githubController.payload)



const GumtreeService = require('./services/Gumtree')
app.get('/devTest', async (req, res) => {
  const test = new GumtreeService()

  res.send(await test.getAdsUrl())
})

app.listen('8080')

console.log('Magic happens on http://localhost:8080');

exports = module.exports = app;
