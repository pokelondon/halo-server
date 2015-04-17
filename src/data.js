var WEBHOOKS = {
    'text': {
        slug: 'text',
        title: 'Text',
        description: 'Send a string of text to be displayed',
        params: {colour: '120,120,120', text: ''}
    },
    'flash': {
        slug: 'flash',
        title: 'Flash',
        description: 'Flash a set of colours',
        params: {colour: '120,254,120', count: 1}
    },
    'equaliser': {
        slug: 'equaliser',
        title: 'Graphic Equaliser',
        description: 'Lights move in time with the music on PokeRadio',
    },
    'track-yay': {
        slug: 'track-yay',
        title: 'Track YAY',
        description: 'Display a positive reaction to a POKE Radio track',
        params: {title: 'The Sound of Silence', artist: 'Simon and Garfunkel'}
    },
    'track-noo': {
        slug: 'track-noo',
        title: 'Track NOO',
        description: 'Display a negative reaction to a POKE Radio track',
        params: {title: 'The Sound of Silence', artist: 'Simon and Garfunkel'}
    },
    'track-scratch': {
        slug: 'track-scratch',
        title: 'Track Scratch',
        description: 'Display a reaction to a POKE Radio track being binned off',
        params: {title: 'The Sound of Silence', artist: 'Simon and Garfunkel'}
    },
    'track-change': {
        slug: 'track-change',
        title: 'Track Change',
        description: 'Show details for the track POKE Radio is now playing',
        params: {title: 'The Sound of Silence', artist: 'Simon and Garfunkel'}
    },
    'bell': {
        slug: 'bell',
        title: 'Bell',
        description: 'Display special bell animation'
    },
};

module.exports.WEBHOOKS = WEBHOOKS;
