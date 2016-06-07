# Clinterface
 A very simple library to create a runtime CLI for your Node.js application.

## Usage
To use Clinterface, simply require the instance.
```javascript
var clinterface = require('clinterface')
```

Then, initialize it using the following two arguments:
```javascript
var cli = new clinterface(<Commands>, <Options (optional)>)
```

## Commands
The command parameter has to look like this:
```javascript
{
  commandName: {
    description: 'Simple description of command',
    method: function (args) {
      // Do your call handling here
    }
  },
  test: {
    description: 'Simple test',
    method: function (args) {
      console.log('Hello world!');
    }
  },
}
```

Now you can use the commands in your running node.js application.

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

## Options
You can pass the option parameter. You can modify these parameters:
```javascript
{
  available: '⌨️  Available commands', // String shown when using help command.
  prefix: '🤖 > ', // Prompt indicator,
  bye: '🖖  Bye bye!' // Message shown when closing application.
}
```
