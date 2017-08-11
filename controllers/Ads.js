const Utils = require('../utils')
const GumtreeService = require('../services/Gumtree')

exports.get = async (req, res) => {
  const gumtreeAds = await gumtree.getAds(req.query.pages)

  res.send(gumtreeAds)
}

const gumtree = new GumtreeService()
