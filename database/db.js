const fs = require("fs");
const { join } = require("node:path");

const databaseDirectory = join(__dirname);

async function saveData(filename, data) {
  const usersFilePath = join(databaseDirectory, filename);
  let dataJSON = JSON.stringify(data, null, 2);
  if (!fs.existsSync(usersFilePath)) {
    fs.writeFileSync(usersFilePath, dataJSON, "utf8");
  } else {
    fs.writeFileSync(usersFilePath, dataJSON, "utf8");
  }
}

async function readData(filename) {
  const data = await fs.readFileSync(join(databaseDirectory, filename));
  return JSON.parse(data);
}

module.exports = {
  saveData,
  readData,
};
