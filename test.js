var clinterface = require('./')
var colors = require('colors');

var cli = new clinterface(
  {
    test: {
      description: 'A testing command!',
      method: function (args) {
        console.log('Your arguments:', args);
      }
    },
    green: {
      description: 'Prints your input text green',
      method: function (args) {
        if (args.length < 2) {
          console.log('Please supply a string to print green as an argument.'.red)
          return
        }

        var text = args
          .filter(function (arg, index) {
            return index > 0
          })
          .reduce(function (previous, current, index) {
            return (previous != '' ? previous.toString() + ' ' : '') + current.toString()
          }, '')

        console.log(colors.green(text))
      }
    }
  },
  {
    available: 'My commands:',
    prefix: '💙 > ',
    bye: 'Goodbye old friend...'
  }
)
