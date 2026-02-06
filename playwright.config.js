// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  
  /* Test timeout */
  timeout: 30000,
  
  /* Run tests in files in parallel */
  fullyParallel: true,
  
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  
  /* Configure parallel workers */
  workers: process.env.CI ? 1 : 2,  // 2 workers locally
  
  /* Reporter configuration */
  reporter: [
    ['list'],  // Terminal output
    ['html', { 
      open: 'never',  // Don't auto-open report (blocks npm test from running cucumber)
      outputFolder: 'playwright-report'
    }],
    ['json', { outputFile: 'playwright-report/report.json' }],  // For Allure
    ['allure-playwright', { outputFolder: 'allure-results' }]  // Allure results
  ],
  
  /* Shared settings */
  use: {
    baseURL: 'http://localhost:8080',
    
    /* Show browsers */
    headless: false,
    
    /* Viewport */
    viewport: { width: 1280, height: 720 },
    
    /* Slow down actions to see them */
    slowMo: 100,  // Add this to see actions more clearly
    
    /* Screenshots and videos */
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },

  /* Configure projects - ONLY CHROMIUM */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});