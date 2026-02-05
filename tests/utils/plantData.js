/**
 * Plant data for test automation
 * Contains plant-related test data, constants, and setup functions
 */

const { request } = require('@playwright/test');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';

const plantData = {
  defaultPlantId: '1',
  defaultQuantity: '5',
  testPlant: {
    id: '1',
    name: 'Plant 001'
  },
  secondPlant: {
    id: '2',
    name: 'Plant 002'
  }
};

// Column headers as displayed in the UI
const plantTableColumns = {
  name: 'Name',
  category: 'Category',
  price: 'Price',
  quantity: 'Quantity'
};

/**
 * Login and get JWT token for API calls
 */
async function getAuthToken(username = 'admin', password = 'admin123') {
  const context = await request.newContext({
    baseURL: API_BASE_URL,
    extraHTTPHeaders: { 'Content-Type': 'application/json' }
  });

  try {
    const response = await context.post('/api/auth/login', {
      data: { username, password }
    });

    if (response.status() === 200) {
      const data = await response.json();
      return data.token;
    }
  } catch (error) {
    console.log('Auth error:', error.message);
  } finally {
    await context.dispose();
  }
  return null;
}

/**
 * Ensure test plants exist with sufficient stock before tests run
 */
async function ensureTestPlantsExist() {
  console.log('Setting up test plant data...');
  
  const token = await getAuthToken();
  if (!token) {
    console.log('Warning: Could not get auth token for test data setup');
    return false;
  }

  const context = await request.newContext({
    baseURL: API_BASE_URL,
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  try {
    // Check existing plants
    const plantsResponse = await context.get('/api/plants');
    
    if (plantsResponse.status() === 200) {
      const plantsData = await plantsResponse.json();
      const plants = Array.isArray(plantsData) ? plantsData : plantsData.content || [];
      
      // Find plants with stock > 0
      const plantsWithStock = plants.filter(p => p.quantity > 0);
      
      if (plantsWithStock.length > 0) {
        console.log(`✓ Found ${plantsWithStock.length} plants with stock`);
        return true;
      }
      
      // If plants exist but no stock, update stock
      if (plants.length > 0) {
        const plant = plants[0];
        console.log(`Plant ${plant.name} has quantity: ${plant.quantity}`);
        console.log(`Updating stock for: ${plant.name}`);
        
        // API expects categoryId, not nested category object
        const updateData = {
          name: plant.name,
          price: plant.price,
          quantity: 100,
          categoryId: plant.category?.id || plant.categoryId
        };
        
        const updateResponse = await context.put(`/api/plants/${plant.id}`, {
          data: updateData
        });
        
        console.log(`Update response status: ${updateResponse.status()}`);
        
        if (updateResponse.status() === 200) {
          console.log('✓ Plant stock updated to 100');
          return true;
        } else {
          const errorText = await updateResponse.text();
          console.log('Update failed:', errorText);
        }
      }
    } else {
      console.log(`Plants API returned status: ${plantsResponse.status()}`);
    }
    
    console.log('Warning: Could not verify test plants');
    return false;
  } catch (error) {
    console.log('Test data setup error:', error.message);
    return false;
  } finally {
    await context.dispose();
  }
}

module.exports = {
  plantData,
  plantTableColumns,
  getAuthToken,
  ensureTestPlantsExist
};
