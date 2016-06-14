var WEBHOOKS = {
    'lava-lamp': {
        slug: 'lava-lamp',
        title: 'Lava Lamp',
        description: 'Classic 60s aesthetic'
    },
    'stripes': {
        slug: 'stripes',
        title: 'Gradient stripes',
        description: 'Stripey'
    },
    'equaliser': {
        slug: 'equaliser',
        title: 'Graphic Equaliser',
        description: 'Lights move in time with the music on PokeRadio',
    },
    'catchup': {
        slug: 'catchup',
        title: 'Time for catch up!',
        description: 'Triggers a beer animation as the base pattern',
    },
    'text': {
        slug: 'text',
        title: 'Text',
        description: 'Send a string of text to be displayed',
        params: {colour: '', text: ''}
    },
    'flash': {
        slug: 'flash',
        title: 'Flash',
        description: 'Flash a set of colours',
        params: {colour: '120,254,120', count: 1}
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
    'spot': {
        slug: 'spot',
        title: 'Spot',
        description: 'Display spot animation'
    },
    'rain': {
        slug: 'rain',
        title: 'It\'s raining!',
        description: 'Display raining animation'
    },
    'sunrise': {
        slug: 'sunrise',
        title: 'It\'s sunrising!',
        description: 'Display sunrising animation'
    },
    'sunset': {
        slug: 'sunset',
        title: 'It\'s sunsetting!',
        description: 'Display sunset animation'
    },
    'fire': {
        slug: 'fire',
        title: 'FIREE!!! – Or almost certainly some sort of safety test',
        description: 'Burn the house down'
    },
    'snow': {
        slug: 'snow',
        title: 'Pretty sure it aint snowing. Whatever.',
        description: 'It\'s Snowing!'
    },
    'goal': {
        slug: 'goal',
        title: 'Euro 2016 - the rich ball kickers kicked the ball in the net',
        description: 'Ball kicking',
        params: {score: '', team_1: '', team_2: ''}
    }
};

module.exports.WEBHOOKS = WEBHOOKS;
