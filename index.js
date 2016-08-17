'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

var clinterface = function () {

  // Command:
  // {
  //   method: function (args),
  //   description: string
  // }

  function clinterface(commands, options) {
    var _this = this;

    _classCallCheck(this, clinterface);

    this.options = Object.assign({
      available: '⌨️  Available commands:',
      bye: '🖖  Bye bye!',
      prefix: '🤖 > ',
      errorPrefix: '[Clinterface ⚡️ ]',
      successPrefix: '[Clinterface 🎉 ]',
      warningPrefix: '[Clinterface 🕵 ]',
      logPrefix: '[Clinterface 📝 ]',
      hideRegisterLogs: true
    }, options || {});

    // Create readline interface
    this.cmd = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    // Get commands
    this.commands = commands || {};

    // Show register messages for all new commands
    Object.keys(this.commands).forEach(function (name) {
      _this.success('Command ' + name + ' was registered.');
    });

    // Create help command
    this.commands.help = {
      description: 'Shows all available commands.',
      usage: 'help <command>',
      method: function method(args) {
        if (args.length > 1 && args[1]) {
          // If arg for command wanted is given.

          if (args[1] in _this.commands) {
            // If argument is in commands

            // Show command info
            var command = _this.commands[args[1]];
            _this.echo(args[1] + '    ' + command.description);

            if (command.usage) _this.echo(' '.repeat(args[1].length) + '    Usage: ' + command.usage);
          } else {
            // If argument is not in commands
            _this.echo('Command \'' + args[1] + '\' was not found. Try \'help\' for a list of commands.\n');
          }
        } else {
          // If no arg for command is given

          // Show available commands text
          _this.echo(_this.options.available);

          var biggestLength = Object.keys(_this.commands).reduce(function (length, key) {
            return key.length > length ? key.length : length;
          }, 0);

          // Loop through all commands
          for (var commandKey in _this.commands) {
            var spaces = ' '.repeat(Math.abs(biggestLength - commandKey.length));

            // Show command info
            var help = _this.commands[commandKey].description || 'No description specified.';
            _this.echo('    ' + commandKey.toString() + ' ' + spaces + ' ' + help);
          }
        }
      }
    };

    // Create exit command
    this.commands.exit = {
      description: 'Exits the process with code 0.',
      usage: 'exit',
      method: function method(args) {
        return new Promise(function (resolve) {
          // Get confirmation on exit
          _this.cmd.clearLine();
          _this.cmd.question("Confirm exit (y/n): ", function (answer) {
            if (answer.match(/^o(ui)?$/i) || answer.match(/^y(es)?$/i)) {
              _this.echo(_this.options.bye);
              process.exit(0);
            } else {
              resolve();
            }
          });
        });
      }
    };

    // Logging commands
    // Create log command
    this.commands.log = {
      description: 'Logs info to the terminal window.',
      usage: 'log <message>',
      method: function method(args) {
        _this.log(args.filter(function (arg, index) {
          return index != 0;
        }).join(' '));
      }
    };

    // Create warn command
    this.commands.warn = {
      description: 'Logs warning to the terminal window.',
      usage: 'warn <message>',
      method: function method(args) {
        _this.warn(args.filter(function (arg, index) {
          return index != 0;
        }).join(' '));
      }
    };

    // Create success command
    this.commands.success = {
      description: 'Logs success message to the terminal window.',
      usage: 'success <message>',
      method: function method(args) {
        _this.success(args.filter(function (arg, index) {
          return index != 0;
        }).join(' '));
      }
    };

    // Create error command
    this.commands.error = {
      description: 'Logs error to the terminal window.',
      usage: 'error <message>',
      method: function method(args) {
        _this.error(args.filter(function (arg, index) {
          return index != 0;
        }).join(' '));
      }
    };

    // Create error command
    this.commands.echo = {
      description: 'Writes text to the terminal window.',
      usage: 'echo <message>',
      method: function method(args) {
        _this.echo(args.filter(function (arg, index) {
          return index != 0;
        }).join(' '));
      }
    };

    // Set prompt
    this.cmd.setPrompt(this.options.prefix, 2);

    // Called on line
    this.cmd.on('line', function (line) {
      // Remove linebreaks at end of commands and then split into arguments
      var args = line.replace(/\r?\n|\r/g, '').split(' ');

      // Base promise is "resolved" so prompt gets triggered,
      // if no other promise is returned
      var promise = Promise.resolve();

      if (args.length > 0 && args[0] in _this.commands) {
        // If arguments arent empty and first argument is valid command
        if (_this.commands[args[0]].method) {
          var returnedPromise = _this.commands[args[0]].method(args, _this.cmd);

          // If function returns anything at all, we assume its a Promise
          // TODO: Add proper Promise vaidation
          if (returnedPromise) {
            promise = returnedPromise;
          }
        }
      } else if (args[0] != '') {
        // Command not found
        _this.echo('\u001b[31mCommand \'' + args[0] + '\' was not found. Try \'help\' for a list of commands.\n\u001b[0m');
      }

      promise.then(function () {
        return _this.cmd.pause();
      }).then(function () {
        return _this.cmd.write('\n');
      }).then(function () {
        return _this.cmd.resume();
      }).then(function () {
        return _this.cmd.prompt();
      }).catch(function () {
        return _this.error('An error occured during the command.');
      });
    });

    // On close, show exit message
    this.cmd.on('close', function () {
      _this.echo(_this.options.bye);
      return process.exit(0);
    });

    // Display prompt
    this.cmd.prompt();

    // LEGACY: works, dont touch... This function keeps the prompt at the bottom of the terminal window
    var privateLog = function privateLog(type, args) {
      var t = Math.ceil((_this.cmd.line.length + 3) / process.stdout.columns);
      var text = util.format.apply(console, args);
      _this.cmd.output.write("\n\x1B[" + t + "A\x1B[0J");
      _this.cmd.output.write(text + "\n");
      _this.cmd.output.write(Array(t).join("\n\x1B[E"));
      _this.cmd._refreshLine();
    };

    // Write all log functions to use privateLog
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
  }

  _createClass(clinterface, [{
    key: 'command',
    value: function command(name, _command) {
      if (name in this.commands) {
        this.warn('Command ' + name + ' is already in use.');
      } else {
        this.commands[name] = _command;

        if (!this.hideRegisterLogs) this.success('Command ' + name + ' was registered.');
      }

      return this;
    }
  }, {
    key: 'echo',
    value: function echo() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      console.log(args.join(' '));
    }
  }, {
    key: 'log',
    value: function log() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      console.log('' + this.options.logPrefix, args.join(' '));
    }
  }, {
    key: 'warn',
    value: function warn() {
      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      console.log('\u001b[33m' + this.options.warningPrefix, args.join(' '), '\x1b[0m');
    }
  }, {
    key: 'success',
    value: function success() {
      for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      console.warn('\u001b[32m' + this.options.successPrefix, args.join(' '), '\x1b[0m');
    }
  }, {
    key: 'error',
    value: function error() {
      for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }

      console.error('\u001b[31m' + this.options.errorPrefix, args.join(' '), '\x1b[0m');
    }
  }]);

  return clinterface;
}();

exports = module.exports = clinterface;
