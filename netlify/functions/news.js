const https = require('https');

const COUNTRY_NAMES = {
  us: 'United States',
  gb: 'United Kingdom',
  in: 'India',
  ca: 'Canada',
  au: 'Australia',
  de: 'Germany',
};

function fetchUrl(url, apiKey) {
  return new Promise(function(resolve, reject) {
    https.get(url, { headers: { 'User-Agent': 'WorldWire-App/1.0', 'X-Api-Key': apiKey } }, function(res) {
      var data = '';
      res.on('data', function(chunk) { data += chunk; });
      res.on('end', function() { resolve(data); });
    }).on('error', reject);
  });
}

exports.handler = async function(event) {
  const API_KEY = process.env.REACT_APP_NEWS_API_KEY;
  const params = event.queryStringParameters || {};
  const search = params.search || '';
  const cat = params.category || 'general';
  const country = params.country || 'us';

  try {
    let data, parsed;

    if (search) {
      const url = 'https://newsapi.org/v2/everything?q=' + encodeURIComponent(search) + '&language=en&sortBy=publishedAt&pageSize=20&apiKey=' + API_KEY;
      data = await fetchUrl(url, API_KEY);
      parsed = JSON.parse(data);
    } else {
      const url1 = 'https://newsapi.org/v2/top-headlines?country=' + country + '&category=' + cat + '&pageSize=20&apiKey=' + API_KEY;
      data = await fetchUrl(url1, API_KEY);
      parsed = JSON.parse(data);

      if (!parsed.articles || parsed.articles.length === 0) {
        const countryName = COUNTRY_NAMES[country] || country;
        const catQuery = cat === 'general' ? countryName + ' news' : cat + ' news ' + countryName;
        const url2 = 'https://newsapi.org/v2/everything?q=' + encodeURIComponent(catQuery) + '&language=en&sortBy=publishedAt&pageSize=20&apiKey=' + API_KEY;
        data = await fetchUrl(url2, API_KEY);
        parsed = JSON.parse(data);
      }
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(parsed),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ status: 'error', message: err.message }),
    };
  }
};
