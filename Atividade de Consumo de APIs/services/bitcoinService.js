const axios = require('axios');

const getBitcoinPrice = async () => {
    try {
        const response = await axios.get('https://api.coindesk.com/v1/bpi/currentprice.json');
        return response.data;
    } catch (error) {
        console.error("Error fetching Bitcoin price:", error);
        throw error;
    }
};

module.exports = { getBitcoinPrice };