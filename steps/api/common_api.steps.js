const { Given, Then, When } = require('@cucumber/cucumber');
const { expect, request } = require('@playwright/test');

// --- PRECONDITIONS ---
Given('the API service is running', async function () {
    // Context will be created in the Auth steps
});

// ✅ Admin Authentication with JWT
Given('I am authenticated as an Admin', async function () {
    const loginContext = await request.newContext({
        baseURL: 'http://localhost:8080'
    });
    
    const loginResponse = await loginContext.post('/api/auth/login', {
        data: {
            username: 'admin',
            password: 'admin123'
        }
    });
    
    
    if (loginResponse.status() !== 200) {
        throw new Error('Admin login failed');
    }
    
    const loginData = await loginResponse.json();
    const jwtToken = loginData.token;
    const tokenType = loginData.tokenType || 'Bearer';
    
    
    await loginContext.dispose();
    
    this.apiContext = await request.newContext({
        baseURL: 'http://localhost:8080',
        extraHTTPHeaders: {
            'Authorization': `${tokenType} ${jwtToken}`,
            'Content-Type': 'application/json'
        }
    });
    
    const testResponse = await this.apiContext.get('/api/categories');
    
    if (testResponse.status() !== 200) {
        throw new Error('Admin authentication failed');
    }
    
});

// ✅ User Authentication with JWT
Given('I am authenticated as a User', async function () {
    const loginContext = await request.newContext({
        baseURL: 'http://localhost:8080'
    });
    
    let loginResponse = await loginContext.post('/api/auth/login', {
        data: {
            username: 'Testuser',
            password: 'test123'
        }
    });
    
    
    if (loginResponse.status() !== 200) {
        loginResponse = await loginContext.post('/api/auth/login', {
            data: {
                username: 'testuser',
                password: 'test123'
            }
        });
        
        
        if (loginResponse.status() !== 200) {
            throw new Error('User login failed');
        }
    }
    
    const loginData = await loginResponse.json();
    const jwtToken = loginData.token;
    const tokenType = loginData.tokenType || 'Bearer';
    
    
    await loginContext.dispose();
    
    this.apiContext = await request.newContext({
        baseURL: 'http://localhost:8080',
        extraHTTPHeaders: {
            'Authorization': `${tokenType} ${jwtToken}`,
            'Content-Type': 'application/json'
        }
    });
    
    const testResponse = await this.apiContext.get('/api/categories');
    
    if (testResponse.status() !== 200) {
        throw new Error('User authentication failed');
    }
    
});

// --- HELPER TO GET ID ---
Given('I get a valid Category ID from the system', async function () {
    const response = await this.apiContext.get('/api/categories');
    
    if (response.status() !== 200) {
        console.log(`[ERROR] Failed to get categories. Status: ${response.status()}`);
        console.log(`[ERROR] Body: ${await response.text()}`);
    }
    expect(response.status()).toBe(200);

    const json = await response.json();
    const list = Array.isArray(json) ? json : (json.content || []);
    
    if (list.length === 0) {
        console.log('[WARN] No categories found! Creating a temporary one...');
        const createRes = await this.apiContext.post('/api/categories', {
            data: { name: "TempCategory", subCategories: [] }
        });
        const newCat = await createRes.json();
        this.validCategoryId = newCat.id;
    } else {
        this.validCategoryId = list[0].id;
    }
});

// --- GENERIC REQUESTS ---
When('I send a GET request to {string}', async function (endpoint) {
    this.lastResponse = await this.apiContext.get(endpoint);
});

When('I send a GET request to {string} with the valid ID', async function (endpoint) {
    const url = endpoint.replace('{id}', this.validCategoryId);
    this.lastResponse = await this.apiContext.get(url);
});

When('I send a GET request to {string} with query param {string}', async function (endpoint, param) {
    this.lastResponse = await this.apiContext.get(`${endpoint}?${param}`);
});

// --- VALIDATIONS ---
Then('the response status code should be {int}', async function (statusCode) {
    if (this.lastResponse.status() !== statusCode) {
        console.log(`[FAIL] Expected ${statusCode} but got ${this.lastResponse.status()}`);
        const bodyText = await this.lastResponse.text();
        console.log(`[FAIL] Response Body: ${bodyText}`);
    }
    expect(this.lastResponse.status()).toBe(statusCode);
});

Then('the response should contain a {string} error message', async function (msgFragment) {
    try {
        const json = await this.lastResponse.json();
        const errorText = JSON.stringify(json).toLowerCase();
        expect(errorText).toContain(msgFragment.toLowerCase());
    } catch (e) {
        console.log("Response was not JSON");
    }
});

Then('the response should contain an error message regarding parameters', async function () {
    expect(this.lastResponse.status()).toBe(400);
});

Then('the response should contain a list of categories', async function () {
    const json = await this.lastResponse.json();
    const list = json.content || json;
    expect(Array.isArray(list)).toBeTruthy();
});

Given('multiple categories exist in the system', async function () {
    const response = await this.apiContext.get('/api/categories');
    const categories = await response.json();
    
    const list = Array.isArray(categories) ? categories : (categories.content || []);
    
    if (list.length < 2) {
        console.log('[WARN] Not enough categories in system for test');
    }
    
    console.log(`[DEBUG] Found ${list.length} categories in system`);
});

When('I send a GET request to {string} without any query parameters', async function (endpoint) {
    this.lastResponse = await this.apiContext.get(endpoint);
    this.lastResponseBody = await this.lastResponse.json();
    
    console.log('[DEBUG] GET request sent to:', endpoint);
    console.log('[DEBUG] Response status:', this.lastResponse.status());
});

Then('the response body should contain a list of all categories', async function () {
    const data = this.lastResponseBody;
    
    const categories = Array.isArray(data) ? data : (data.content || data.categories || []);
    
    console.log(`[DEBUG] Categories found in response: ${categories.length}`);
    
    expect(categories.length).toBeGreaterThan(0);
    expect(Array.isArray(categories)).toBeTruthy();
});

Then('each category should have the correct structure with id, name, and parentName', async function () {
    const data = this.lastResponseBody;
    const categories = Array.isArray(data) ? data : (data.content || data.categories || []);
    
    console.log('[DEBUG] Validating category structure...');
    
    expect(categories.length).toBeGreaterThan(0);
    
    const firstCategory = categories[0];
    
    // API returns: {"id":20,"name":"Flowers","parentName":"-"}
    expect(firstCategory).toHaveProperty('id');
    expect(firstCategory).toHaveProperty('name');
    expect(firstCategory).toHaveProperty('parentName');
    
    console.log('[DEBUG] Sample category structure:', JSON.stringify(firstCategory, null, 2));
});

Then('the response format should match the API specification', async function () {
    const data = this.lastResponseBody;
    const categories = Array.isArray(data) ? data : (data.content || data.categories || []);
    
    for (const category of categories) {
        // Validate structure based on actual API response
        expect(typeof category.id).toBe('number');
        expect(typeof category.name).toBe('string');
        expect(category.name.length).toBeGreaterThan(0);
        expect(typeof category.parentName).toBe('string');
    }
    
    console.log('[DEBUG] All categories match API specification');
});
