const report = require('multiple-cucumber-html-reporter');

report.generate({
    jsonDir: './reports',
    reportPath: './reports/cucumber-html-report',
    metadata: {
        browser: {
            name: 'chrome',
            version: '120'
        },
        device: 'Local test machine',
        platform: {
            name: 'Windows',
            version: '11'
        }
    },
    customData: {
        title: 'Test Execution Report',
        data: [
            {label: 'Project', value: 'QA Training Tests'},
            {label: 'Test Type', value: 'UI & API Tests'},
            {label: 'Execution Time', value: new Date().toLocaleString()}
        ]
    }
});

console.log('✅ Report generated at: ./reports/cucumber-html-report/index.html');