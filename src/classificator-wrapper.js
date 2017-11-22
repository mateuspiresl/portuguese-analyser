const path = require('path');
const spawn = require('child_process').spawn;


const classificatorPath = path.join(__dirname, '../classificator/classificator.py');

class ClassificatorWrapper
{
  constructor (onClose)
  {
    this.exe = spawn('python', [classificatorPath]);
    this.input = this.exe.stdin;
    this.output = [];
    
    this.exe.stdout.on('data', data => {
      if (this.output.length > 0)
        this.output.splice(0, 1)[0].resolve(data.toString().trim());
    });

    this.exe.stdout.on('end', () => { if (onClose) onClose() });

    this.exe.stderr.on('data', data => {
      if (this.output.length > 0)
        this.output.splice(0, 1)[0].reject(data.toString().trim());
    });
  }

  get (text)
  {
    return new Promise(
      (resolve, reject) => {
        this.output.push({ resolve, reject });
        this.input.write(text + '\n');
      })
      .then(data => {
        return data.substring(4, data.length - 4).split('\'), (\'').reduce((result, token) => {
          const tokens = token.split('\', \'');
          result.push({ token: tokens[0], class: tokens[1] });
          return result;
        }, []);
      });
  }

  close () {
    this.input.end();
  }
}


module.exports = ClassificatorWrapper;