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

function readData(filename) {
  try {
    const data = fs.readFileSync(join(databaseDirectory, filename), "utf8");
    if (data) {
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    return null;
  }
}

module.exports = {
  saveData,
  readData,
};
