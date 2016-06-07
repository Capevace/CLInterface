var clinterface = require('./')

var cli = new clinterface(
  {
    test: {
      description: 'A testing command!',
      method: function (args) {
        console.log('Your arguments:', args);
      }
    },
    ping: {
      description: 'A ping command!',
      method: function (args) {
        var count = 1
        if (args.length > 1) {
          count = parseInt(args[1])
        }
        
        for (var i = 0; i < count; i++) {
          console.log('Pong!');
        }
      }
    }
  },
  {
    available: 'My commands:',
    prefix: '💙 > ',
    bye: 'Goodbye old friend...'
  }
)
