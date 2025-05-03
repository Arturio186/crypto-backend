const express = require('express');
const cron = require('node-cron');
const cors = require('cors');

const fetchRates = require('./services/rates/fetchRates');
const getUsdtRate = require('./services/rates/getUsdtRate');

const PORT = process.env.PORT || 3000;
const environment = process.env.NODE_ENV || 'development';

const app = express();

const allowedOrigins = [
  'https://arturio186-crypto-frontend-02c6.twc1.net',
  'http://localhost:5173'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));

app.use(express.json());

app.get('/getUsdtRate', getUsdtRate);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${environment}`);
}); 

cron.schedule('* * * * *', fetchRates);