/*

clinterface License

The MIT License (MIT)
Copyright (c) 2016 Lukas von Mateffy (@Capevace)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/
const readline = require('readline')
const util = require('util')

class clinterface {

  // Command:
  // {
  //   method: function (args),
  //   description: string
  // }

  constructor (commands, options) {
    this.options = Object.assign({
      available: '⌨️  Available commands:',
      bye: '🖖  Bye bye!',
      prefix: '🤖 > '
    }, options || {})

    // Create readline interface
    this.cmd = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })

    // Get commands
    this.commands = commands || {}

    // Create help command
    this.commands.help = {
      description: 'Shows all available commands.',
      method: args => {
        if (args.length > 1 && args[1]) { // If arg for command wanted is given.

          if (args[1] in this.commands) { // If argument is in commands

            // Show command info
            const command = this.commands[args[1]]
            console.log(`${args[1]}\n   ${command.description}`)

          } else { // If argument is not in commands
            console.error(`Command '${args[1]}' was not found. Try 'help' for a list of commands.\n`);
          }
        } else { // If no arg for command is given

          // Show available commands text
          console.log(this.options.available)

          // Loop through all commands
          for (let commandKey in this.commands) {

            // Show command info
            const help = this.commands[commandKey].description || 'No description specified.'
            console.log('   ' + commandKey.toString() + '  ' + help)
          }
        }
      }
    }

    // Create exit command
    this.commands.exit = {
      description: 'Exits the process with code 0.',
      method: args => {
        // Get confirmation on exit
        this.cmd.clearLine();
        this.cmd.question("Confirm exit (y/n): ", (answer) => {
          if (answer.match(/^o(ui)?$/i) || answer.match(/^y(es)?$/i)) {
            console.log(this.options.bye)
            process.exit(0)
          } else {
            this.cmd.output.write(this.options.prefix)
          }
        });
      }
    }

    // Set prompt
    this.cmd.setPrompt(this.options.prefix, 2);

    // Called on line
    this.cmd.on('line', line => {
      // Remove linebreaks at end of commands and then split into arguments
      const args = line.replace(/\r?\n|\r/g, '').split(' ')

      if (args.length > 0 && args[0] in this.commands) { // If arguments arent empty and first argument is valid command
        this.commands[args[0]].method(args)
      } else { // Command not found
        console.error(`Command '${args[0]}' was not found. Try 'help' for a list of commands.\n`);
      }

      this.cmd.prompt()
    })

    // On close, show exit message
    this.cmd.on('close', () => {
      console.log(this.options.bye)
      return process.exit(0);
    })

    // Display prompt
    this.cmd.prompt()

    // LEGACY: works, dont touch... This function keeps the prompt at the bottom of the terminal window
    const privateLog = (type, args) => {
      var t = Math.ceil((this.cmd.line.length + 3) / process.stdout.columns);
      var text = util.format.apply(console, args);
      this.cmd.output.write("\n\x1B[" + t + "A\x1B[0J");
      this.cmd.output.write(text + "\n");
      this.cmd.output.write(Array(t).join("\n\x1B[E"));
      this.cmd._refreshLine();
    };

    // Write all log functions to use privateLog
    console.log = function() {
      privateLog("log", arguments);
    };
    console.warn = function() {
      privateLog("warn", arguments);
    };
    console.info = function() {
      privateLog("info", arguments);
    };
    console.error = function() {
      privateLog("error", arguments);
    };
  }
}

exports = module.exports = clinterface
