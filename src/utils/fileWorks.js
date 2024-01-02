const fs = require('fs');


const readFile = (filePath) => {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return fileContent;
  } catch (error) {
    console.error(`Error reading file: ${error.message}`);
    return null;
  }
};

const getLines = (fileContent) => {
  return fileContent.split('\n');
};

const getAccountsFromFile = (filePath) => {
  const fileContent = readFile(filePath);
  if (!fileContent) {
    return null;
  }

  const lines = getLines(fileContent);

  // Assuming each line in the file represents an account in the format email:password
  const accounts = lines.map(line => {
    const [username, password] = line.split(':');
    return { username, password };
  });

  return accounts;
};

module.exports = { readFile, getLines, getAccountsFromFile };
