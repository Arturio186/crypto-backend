const axios = require('axios');
const db = require('../../database/db');

module.exports = async () => {
  try {
    const response = await axios.get('https://api.rapira.net/open/market/rates');
    
    const rates = response.data.data;

    const usdtRate = rates.find(rate => rate.symbol === 'USDT/RUB');
    
    if (!usdtRate) {
      throw new Error('USDT/RUB rate not found in API response');
    }

    const baseCost = 1 / usdtRate.baseUsdRate;

    await db('usdtRate')
      .insert({
        sell: (baseCost * 1.04).toFixed(2),
        base: baseCost.toFixed(2),
        buy: (baseCost * 0.96).toFixed(2),
        change: usdtRate.change,
        fetchedAt: new Date(),
        single_row: true
      })
      .onConflict('single_row')
      .merge();
  } catch (error) {
    console.error('Failed to fetch market rates:', error);
    throw error;
  }
};