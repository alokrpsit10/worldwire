const https = require('https');

exports.handler = async function(event) {
  const API_KEY = process.env.REACT_APP_NEWS_API_KEY;
  const params = event.queryStringParameters || {};
  const search = params.search || '';
  const cat = params.category || 'general';
  const country = params.country || 'us';

  let url = '';
  if (search) {
    url = 'https://newsapi.org/v2/everything?q=' + encodeURIComponent(search) + '&language=en&sortBy=publishedAt&pageSize=20&apiKey=' + API_KEY;
  } else {
    url = 'https://newsapi.org/v2/top-headlines?country=' + country + '&category=' + cat + '&pageSize=20&apiKey=' + API_KEY;
  }

  const options = {
    headers: {
      'User-Agent': 'WorldWire-App/1.0',
      'X-Api-Key': API_KEY,
    }
  };

  return new Promise(function(resolve) {
    https.get(url, options, function(res) {
      var data = '';
      res.on('data', function(chunk) { data += chunk; });
      res.on('end', function() {
        resolve({
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: data,
        });
      });
    }).on('error', function(err) {
      resolve({
        statusCode: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ status: 'error', message: err.message }),
      });
    });
  });
};
