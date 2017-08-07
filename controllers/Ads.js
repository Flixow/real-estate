const Utils = require('../utils')

exports.get = async (req, res) => {
  const gumtreeAds = await Utils.getFromGumtree()

  res.send(gumtreeAds)
}
