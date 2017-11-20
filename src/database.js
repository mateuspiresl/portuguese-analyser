const fs = require('fs');


class Database
{
  constructor (path, options)
  {
    this.path = path;
    this.data = this.load();
    this.saving = { event: null, interval: 2000, lazy: false };

    if (options) {
      if (options.lazySaving) this.saving.lazy = !!options.lazySaving;
      if (options.savingInterval) this.saving.interval = options.savingInterval;
    }
  }

  load () {
    return fs.existsSync(this.path) ? JSON.parse(fs.readFileSync(this.path)) : {};
  }

  save ()
  {
    this.saving.event = null;
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }

  schedule ()
  {
    if (!this.saving.lazy) return this.save();

    if (this.saving.event !== null) clearTimeout(this.saving.event);
    this.saving.event = setTimeout(this.save.bind(this), this.saving.interval);
  }

  clear ()
  {
    if (this.saving.event !== null)
    {
      clearTimeout(this.saving.event);
      this.save();
    }
  }

  reset ()
  {
    this.data = {};
    this.schedule();
  }

  getValue (key) {
    return this.data[key] !== undefined ? this.data[key] : null;
  }

  setValue (key, value)
  {
    this.data[key] = value;
    this.schedule();
  }
}


module.exports = Database;