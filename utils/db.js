const fs = require("fs");

module.exports = {
  read(file) {
    return JSON.parse(fs.readFileSync(`./db/${file}.json`, "utf8"));
  },
  write(file, data) {
    fs.writeFileSync(`./db/${file}.json`, JSON.stringify(data, null, 2));
  }
};
