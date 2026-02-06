const reporter = require('cucumber-html-reporter');

const options = {
    theme: 'bootstrap',
    jsonFile: 'reports/cucumber_report.json', // JSON file eka thiyena thana
    output: 'reports/cucumber_report.html',   // HTML report eka save wena thana
    reportSuiteAsScenarios: true,
    scenarioTimestamp: true,
    launchReport: true, // Report eka hadunu gaman auto open wenna
    metadata: {
        "App Version": "1.0.0",
        "Test Environment": "STAGING",
        "Browser": "Chromium",
        "Platform": "Windows 10",
        "Parallel": "Scenarios",
        "Executed": "Remote"
    }
};

reporter.generate(options);