const db = require('../../database/db');

module.exports = async (req, res) => {
  try {
    const rate = await db('usdtRate').first();
    
    if (!rate) {
      return res.status(404).json({ 
        error: 'USDT rate not found' 
      });
    }

    res.status(200).json({
      sell: rate.sell,
      base: rate.base,
      buy: rate.buy,
      change: rate.change,
      lastUpdated: rate.fetchedAt
    });
  } catch (error) {
    console.error('Error fetching USDT rate:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}