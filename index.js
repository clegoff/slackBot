const https = require('https'),
      qs = require('querystring'),
      VERIFICATION_TOKEN = "BmWkJszEQfQSkPy4YIKudQV6",
      ACCESS_TOKEN = "XYec2hQVtwbbJFcr6hPhkjYzvUKazSauhtFReZS7EynahVV04Jny";

// Verify Url - https://api.slack.com/events/url_verification
function verify(data, callback) {
    if (data.token === VERIFICATION_TOKEN) callback(null, data.challenge);
    else callback("verification failed");   
}

// Post message to Slack - https://api.slack.com/methods/chat.postMessage
function process(event, callback) {
    // test the message for a match and not a bot
    if (!event.bot_id && /(aws|lambda)/ig.test(event.text)) {
        var text = `<Bonjour @${event.user}>, voici les règles du chat à respecter:`;
        var message = { 
            token: ACCESS_TOKEN,
            channel: event.channel,
            text: text
        };

        var query = qs.stringify(message); // prepare the querystring
        https.get(`https://slack.com/api/chat.postMessage?${query}`);
    }

    callback(null);
}

exports.handler = (data, context, callback) => {
    switch (data.type) {
        case "url_verification": verify(data, callback); break;
        case "event_callback": process(data.event, callback); break;
        default: callback(null);
    }
};