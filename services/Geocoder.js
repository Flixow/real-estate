const geocoder = require('node-geocoder')({
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GOOGLE_APIS_APIKEY,
  formatter: null
})

class Geocoder {
  constructor() {

  }

  async getStreet(cords) {
    const res = await geocoder.reverse(cords)

    return res[0].formattedAddress
  }
}

exports = module.exports = Geocoder
