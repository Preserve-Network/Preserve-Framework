const path = require("path");

function generatePreserveMetadata(name, description, files) {
  const filenames = files.map((file) => path.basename(file));

  return JSON.stringify({
    name,
    description,
    filenames,
  });
}

module.exports = generatePreserveMetadata;
