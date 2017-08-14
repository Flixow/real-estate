const scrapeIt = require('scrape-it')
const Geocoder = require('./Geocoder')

class Gumtree {
  constructor(params = {}) {
    this.geocoder = new Geocoder()
    this.filters = [
      {
        key: 'pr',
        value: ',200000'
      }
    ]
    this.scrapeSelectors = {
      title: 'span.myAdTitle',
      created_at: '.selMenu .attribute > .name:contains("Data dodania") + span',
      locations: {
        listItem: '.selMenu .attribute > .value > .location > a',
      },
      by: '.selMenu .attribute > .name:contains("Na sprzedaż przez") + span',
      size: '.selMenu .attribute > .name:contains("Wielkość (m2)") + span',
      price: {
        selector: '.price .value .amount',
        eq: 0
      },
      phone_number: {
        selector: '.button.telephone',
        attr: 'href',
        convert: x => x && x.replace('tel:', '')
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
    }
    this.params = params
  }

  getUrl(page = 1) {
    const params = this.filters.reduce((prev, curr) => `&${curr.key}=${curr.value}`, '')
    const url = page === 1
    ? `https://www.gumtree.pl/s-mieszkania-i-domy-sprzedam-i-kupie/warszawa/mieszkanie/v1c9073l3200008a1dwp1?${params}`
    : `https://www.gumtree.pl/s-mieszkania-i-domy-sprzedam-i-kupie/warszawa/mieszkanie/page-${page}/v1c9073l3200008a1dwp2?${params}`

    console.log('Gumtree:getUrl', url)
    return url
  }

  async getAdsUrl(pages) {
    const allUrls = []

    await Promise.all([...Array(Number(pages))].map(async (k, i) => {
      const {urls} = await scrapeIt(this.getUrl(i + 1), {
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
      urls.forEach(({url}) => url && allUrls.push(url))
    }))

    return allUrls
  }

  async getAds(pages = 1) {
    const urls = await this.getAdsUrl(pages)
    const ads = await Promise.all(urls.map(async (url, i) => {
      return await new Promise((resolve, reject) => {
        setTimeout(async () => {
          if (url) {
            const ad = await scrapeIt(`https://www.gumtree.pl${url}`, this.scrapeSelectors)

            ad.url = `https://www.gumtree.pl${url}`
            ad.street = await this.geocoder.getStreet(ad.cords)

            resolve(ad)
          }
        }, 200 * i)
      })
    }))

    console.log('ads length:', ads.length)

    return ads
  }
}

exports = module.exports = Gumtree
