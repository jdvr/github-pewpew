const fs = require('fs');
const path = require('path');

const Github = require('./github');
const Utils = require('./utils');

const { package: PACKAGE, author: PACKAGE_AUTHOR } = Utils.getPackageDetails();
const HOME_DIR = require('os').homedir();

const CONFIG_PATH_BY_PLATFORM = {
  'win32': path.join('AppData', 'Roaming', PACKAGE_AUTHOR, PACKAGE.name),
  'darwin': path.join('Library', `com.${PACKAGE_AUTHOR}.${PACKAGE.name}`)
}
const DEFAULT_CONFIG_PATH = path.join('.config', `com.${PACKAGE_AUTHOR}.${PACKAGE.name}`)
const CONFIG_DIR = getConfigDir(HOME_DIR);
const CONFIG_FILE = path.join(CONFIG_DIR, 'auth.json');

function save(token) {
  const configuration = {
    _: `This is your ${PACKAGE.name} credentials. DO NOT SHARE!`,
    token: token,
  };

  if (!fs.existsSync(CONFIG_DIR)) fs.mkdirSync(CONFIG_DIR, { recursive: true });
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(configuration), 'utf8');

  return true;
}

function load() {
  const configExists = fs.existsSync(CONFIG_FILE);

  if (!configExists) return false;

  const config = fs.readFileSync(CONFIG_FILE, 'utf8');
  const token = JSON.parse(config).token;

  return Github.setToken(token);
}

function deleteFile() {
  const configExists = fs.existsSync(CONFIG_FILE);

  if (!configExists) return false;

  return fs.unlinkSync(CONFIG_FILE);
}

function getConfigDir(homeDir) {
  const configPath = CONFIG_PATH_BY_PLATFORM[process.platform] || DEFAULT_CONFIG_PATH
  const configDir = path.join(
    homeDir,
    configPath
  );

  return configDir;
}

module.exports = {
  save,
  load,
  deleteFile,
};
