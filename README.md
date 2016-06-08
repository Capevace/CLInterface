# Clinterface
 A very simple library to create a runtime CLI for your Node.js application.

## Usage
To use Clinterface, simply install it using NPM and require the instance.
```bash
npm install clinterface --save
```
```javascript
var clinterface = require('clinterface')
```

Then, initialize it using the following two arguments:
```javascript
var cli = new clinterface(<Commands>, <Options (optional)>)
```

## Commands
The commands parameter has to look like this:
```javascript
{
  commandName: {}, // Command object
  test: {} // Command object
}
```

Each *command object* has a description, a usage and a method field.

```javascript
// Command object
{
  description: 'Simple description of command',
  usage: 'commandName <name> <password>',
  method: function (args) {
    // Do your call handling here
  }
}
```

Now you can use the commands in your running node.js application.

### Other ways

You can also add commands using the .command() function. This can be done at any point during runtime.
```javascript
cli.command(<name>, <command>)

cli.command(
  'test',
  {
    description: 'Simple test command',
    usage: 'test',
    method: function (args) { /* Test method */ }
  }
)
```

### Standard commands
There are a few Standard commands.

#### Exit:
Exits the application with code 0.
```bash
$ exit
```

#### Help:
Lists all the available commands.
```bash
$ help
⌨️  Available commands:
   help  Shows all available commands.
   exit  Exits the process with code 0.

$ help exit
exit
   Exits the process with code 0.
```

#### Echo, log, warn, error, success
Helper functions to display text in the console. Each with respective coloring and formatting.
```bash
$ echo This is a test!
This is a test!

$ success This is good!
[Clinterface 🎉 ] This is good!
```

## Options
You can pass the option parameter. You can modify these parameters:
```javascript
{
  available: '⌨️  Available commands:',
  bye: '🖖  Bye bye!',
  prefix: '🤖 > ',
  errorPrefix: '[Clinterface ⚡️ ]',
  successPrefix: '[Clinterface 🎉 ]',
  warningPrefix: '[Clinterface 🕵 ]',
  logPrefix: '[Clinterface 📝 ]',
  hideRegisterLogs: true
}
```
