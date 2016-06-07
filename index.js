'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*

clinterface License

The MIT License (MIT)
Copyright (c) 2016 Lukas von Mateffy (@Capevace)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/
var readline = require('readline');
var util = require('util');

var clinterface =

// Command:
// {
//   method: function (args),
//   description: string
// }

function clinterface(commands, options) {
  var _this = this;

  _classCallCheck(this, clinterface);

  if (!commands) {

    return;
  }

  this.options = options || {};

  // Create readline interface
  this.cmd = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  // Get commands
  this.commands = commands || {};
  this.commands.help = {
    description: 'Shows all available commands.',
    method: function method(args) {
      if (args.length > 1 && args[1]) {
        if (args[1] in _this.commands) {
          var command = _this.commands[args[1]];
          console.log(args[1] + '\n   ' + command.description);
        } else {
          console.error('Command \'' + args[1] + '\' was not found. Try \'help\' for a list of commands.\n');
        }
      } else {
        console.log(_this.options.available || '⌨️  Available commands:');

        for (var commandKey in _this.commands) {
          var help = _this.commands[commandKey].description || 'No description specified.';
          console.log('   ' + commandKey.toString() + '  ' + help);
        }
      }
    }
  };
  this.commands.exit = {
    description: 'Exits the process with code 0.',
    method: function method(args) {
      _this.cmd.clearLine();
      _this.cmd.question("Confirm exit (y/n): ", function (answer) {
        return answer.match(/^o(ui)?$/i) || answer.match(/^y(es)?$/i) ? process.exit(0) : this.cmd.output.write(this.options.prefix || '🤖 > ');
      });
    }
  };

  // Set prompt
  this.cmd.setPrompt(this.options.prefix || '🤖 > ', 2);

  // Called on line
  this.cmd.on('line', function (line) {
    // Remove linebreaks at end of commands and then split into arguments
    var args = line.replace(/\r?\n|\r/g, '').split(' ');
    if (args.length > 0 && args[0] in _this.commands) {
      _this.commands[args[0]].method(args);
    } else {
      // Command not found
      console.error('Command \'' + args[0] + '\' was not found. Try \'help\' for a list of commands.\n');
    }

    _this.cmd.prompt();
  });
  this.cmd.on('close', function () {
    console.log(_this.options.bye || '🖖  Bye bye!');
    return process.exit(0);
  });
  this.cmd.prompt();

  var privateLog = function privateLog(type, args) {
    var t = Math.ceil((_this.cmd.line.length + 3) / process.stdout.columns);
    var text = util.format.apply(console, args);
    _this.cmd.output.write("\n\x1B[" + t + "A\x1B[0J");
    _this.cmd.output.write(text + "\n");
    _this.cmd.output.write(Array(t).join("\n\x1B[E"));
    _this.cmd._refreshLine();
  };

  console.log = function () {
    privateLog("log", arguments);
  };
  console.warn = function () {
    privateLog("warn", arguments);
  };
  console.info = function () {
    privateLog("info", arguments);
  };
  console.error = function () {
    privateLog("error", arguments);
  };
};

exports = module.exports = clinterface;
