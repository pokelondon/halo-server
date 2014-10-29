var WEBHOOKS = {
    'text': {
        slug: 'text',
        title: 'Text',
        description: 'Send a string of text to be displayed',
        params: {text: ''}
    },
    'flash': {
        slug: 'flash',
        title: 'Flash',
        description: 'Flash a set of colours',
        params: {colour: '120,120,120', interval: 1}
    },
};

module.exports.WEBHOOKS = WEBHOOKS;
