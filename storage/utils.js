const path = require("path");

function generatePreserveMetadata(name, description, files, attributes = {}) {
  const filenames = files.map((file) => path.basename(file));

  return JSON.stringify({
    name,
    description,
    created: Date.now(),
    filenames,
    attributes,
  });
}

module.exports = generatePreserveMetadata;
