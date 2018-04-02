const fs = require('fs');
const path = require('path');
const root = __dirname.split("src")[0];
const logFilePath = path.join(root, '/output.log'); // Amateur hour shit

var log_file = fs.createWriteStream(logFilePath, {
  flags: 'a'
});

exports.logMotion = (data) => {
  console.log(data);
  const destDir = `${root}/log/`;
  const filename = data.filename;
  const timestamp = data.timestamp;

  fs.access(destDir, (err) => {
    if (err) {
      // If the directory does not exist, create a directory
      fs.mkdirSync(destDir);
    }

    transferFile(`${__dirname}/output/${filename}`, path.join(destDir, `${timestamp}.jpg`));
  });
  log_file.write(`${filename} was logged at ${new Date(timestamp).toLocaleString()}\n`);
}

const transferFile = (src, dest) => {
  var readStream = fs.createReadStream(src);

  readStream.once('error', (err) => {
    console.log(err);
  });

  readStream.once('end', () => {
    console.log('done copying');
  });

  readStream.pipe(fs.createWriteStream(dest));
}