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
    if (!commands) {

      return
    }

    this.options = options || {}

    // Create readline interface
    this.cmd = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })

    // Get commands
    this.commands = commands || {}
    this.commands.help = {
      description: 'Shows all available commands.',
      method: args => {
        if (args.length > 1 && args[1]) {
          if (args[1] in this.commands) {
            const command = this.commands[args[1]]
            console.log(`${args[1]}\n   ${command.description}`)
          } else {
            console.error(`Command '${args[1]}' was not found. Try 'help' for a list of commands.\n`);
          }
        } else {
          console.log(this.options.available || '⌨️  Available commands:')

          for (let commandKey in this.commands) {
            const help = this.commands[commandKey].description || 'No description specified.'
            console.log('   ' + commandKey.toString() + '  ' + help)
          }
        }
      }
    }
    this.commands.exit = {
      description: 'Exits the process with code 0.',
      method: args => {
        this.cmd.clearLine();
        this.cmd.question("Confirm exit (y/n): ", function(answer) {
            return (answer.match(/^o(ui)?$/i) || answer.match(/^y(es)?$/i)) ? process.exit(0) : rl.output.write(this.options.prefix || '🤖 > ');
        });
      }
    }

    // Set prompt
    this.cmd.setPrompt(this.options.prefix || '🤖 > ', 2);

    // Called on line
    this.cmd.on('line', line => {
      // Remove linebreaks at end of commands and then split into arguments
      const args = line.replace(/\r?\n|\r/g, '').split(' ')
      if (args.length > 0 && args[0] in this.commands) {
        this.commands[args[0]].method(args)
      } else {
        // Command not found
        console.error(`Command '${args[0]}' was not found. Try 'help' for a list of commands.\n`);
      }

      this.cmd.prompt()
    });
    this.cmd.on('close', () => {
        console.log(this.options.bye || '🖖  Bye bye!')
        return process.exit(0);
    });
    this.cmd.prompt()

    const privateLog = (type, args) => {
      var t = Math.ceil((this.cmd.line.length + 3) / process.stdout.columns);
      var text = util.format.apply(console, args);
      this.cmd.output.write("\n\x1B[" + t + "A\x1B[0J");
      this.cmd.output.write(text + "\n");
      this.cmd.output.write(Array(t).join("\n\x1B[E"));
      this.cmd._refreshLine();
    };

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
