const scrapeIt = require("scrape-it")
const geocoder = require('node-geocoder')({
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GOOGLE_APIS_APIKEY,
  formatter: null
})

exports.getFromGumtree = async () => {
  const {urls} = await scrapeIt('https://www.gumtree.pl/s-mieszkania-i-domy-sprzedam-i-kupie/warszawa/mieszkanie/v1c9073l3200008a1dwp1?pr=,200000', {
    urls: {
      listItem: 'li.result',
      data: {
        url: {
          selector: '.href-link',
          attr: 'href'
        }
      }
    }
  })

  console.log('urls length:', urls.length)
  console.log('urls:', urls.map(url => `https://www.gumtree.pl${url.url}`))

    const ads = await Promise.all(urls.map(async ({url}, i) => {
      if (url) {
        const ad = url && await scrapeIt(`https://www.gumtree.pl${url}`, {
          title: 'span.myAdTitle',
          created_at: {
            selector: '.selMenu .attribute > .value',
            eq: 0
          },
          locations: {
            listItem: '.selMenu .attribute > .value > .location > a',
          },
          by: {
            selector: '.selMenu .attribute > .value',
            eq: 2
          },
          size: {
            selector: '.selMenu .attribute > .value',
            eq: 6
          },
          price: {
            selector: '.price .value .amount',
            eq: 0
          },
          phone_number: {
            selector: '.button.telephone',
            attr: 'href',
            convert: x => x.replace('tel:', '')
          },
          description: '.vip-details > .description',
          cords: {
            selector: '.map .google-maps-link',
            attr: 'data-uri',
            convert: x => {
              const cords = require('url').parse(x, true).query.q.split(',')
              return {
                lat: cords[0],
                lon: cords[1]
              }
            }
          }
        })

        ad.url = `https://www.gumtree.pl${url}`
        ad.street = await this.getStreet(ad.cords)

        return ad
      }
    }))

    console.log('ads length:', ads.length)

    return ads
}

exports.getStreet = async (cords) => {
  const res = await geocoder.reverse(cords)

  return res[0].formattedAddress
}
