// Utils
// ================================================================

// Imports
var crypto = require('crypto');

function randomHash() {
    var current_date = (new Date()).valueOf().toString();
    var random = Math.random().toString();
    return crypto.createHash('sha1').update(current_date + random).digest('hex');
}

// Run this with an item from appData.WEBHOOKS
// To create the payload that gets sent to Processing
function processPayload(body, webhook) {
    var payload = [webhook.slug];
    if(!webhook.hasOwnProperty('params')) {
        return webhook.slug;
    }
    for (key in webhook.params) {
        if(body.hasOwnProperty(key)) {
            payload.push(key + ':' + body[key]);
        } else {
            payload.push(key + ':' + webhook.params[key]);
        }
    }
    return payload.join('|');
}

// Exports
module.exports.randomHash = randomHash;
module.exports.processPayload = processPayload;
