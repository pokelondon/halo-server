var https = require('https');
var http = require('http');
var _ = require('underscore');

var FORECAST_ENDPOINT = 'https://api.forecast.io/forecast/';
var FORECAST_KEY = '097ea57342078d14896ef4cadc02ca75';
var LOCATION = [51.5198710, -0.1562690];
var url = FORECAST_ENDPOINT + FORECAST_KEY + '/' + LOCATION.join(',');
var PERIOD = 1000 * 60 * 10; // 10 mins
var POLL_INTERVAL = 1000 * 60 * 3; // 3 mins

/**
 * Ping the webhook if it's raining and hasnt done so recently
 */
function handleRaining() {
    console.log('handling raining');
    var req = http.request({
      host: 'mediator.halo.pokedev.net',
      port: '80',
      path: '/webhook/075848d7f6d56863bf6a65a2a656de59137ee521/rain/',
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
      }
    });
    req.write('');
    req.end();
};

var throttledHandleRaining = _.throttle(handleRaining, PERIOD);

/**
 * Get Forecast for this location from Forecast.IO
 * Look for precipProbability
 */
function checkRaining() {
    https.get(url, function(res) {
        var body = '';

        res.on('data', function(chunk) {
            body += chunk;
        });

        res.on('end', function() {
            var json = JSON.parse(body)
            if (json.minutely.summary.match('stopping')) {
                console.log('Its raining (text match), prob: %s', json.minutely.data[0].precipProbability);
                throttledHandleRaining();
            }
            if(json.minutely.data[0].precipProbability > .5) {
                console.log('Its raining (prob > 50)');
            }
        });
    }).on('error', function(e) {
        console.log("Got error: ", e);
    });
}

setInterval(checkRaining, POLL_INTERVAL);
