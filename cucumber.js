const common = [
  'features/**/*.feature',
  '--require src/**/*.js',
  '--publish-quiet',
  '--format progress',
  '--format html:reports/cucumber-report.html',
  '--format json:reports/cucumber-report.json'
].join(' ');

module.exports = {
  default: common
};
