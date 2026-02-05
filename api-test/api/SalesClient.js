// Sales-specific client (uses ApiClient)
// Based on Swagger: POST /api/sales/plant/{plantId}?quantity=X, GET /api/sales, GET /api/sales/page, DELETE /api/sales/{id}

class SalesClient {
  constructor(apiClient) {
    this.apiClient = apiClient;
    this.basePath = '/api/sales';
  }

  async getAllSales() {
    return await this.apiClient.get(this.basePath);
  }

  // Swagger: GET /api/sales/page - Get sales with pagination and sorting
  async getSalesWithPagination(page, size) {
    return await this.apiClient.get(`${this.basePath}/page`, { page, size });
  }

  async getSaleById(id) {
    return await this.apiClient.get(`${this.basePath}/${id}`);
  }

  // Swagger: POST /api/sales/plant/{plantId}?quantity=X - Sell plant
  // The plantId goes in the URL, quantity goes as query parameter
  async createSale(saleData) {
    const { plantId, quantity } = saleData;
    // POST to /api/sales/plant/{plantId}?quantity=X (quantity as query param)
    return await this.apiClient.post(`${this.basePath}/plant/${plantId}`, {}, { quantity });
  }

  // For creating sale without plantId (for validation testing)
  async createSaleWithoutPlantId(saleData) {
    // Try to POST to /api/sales/plant/ without plantId - should fail with 400
    return await this.apiClient.post(`${this.basePath}/plant/`, {}, { quantity: saleData.quantity });
  }

  async updateSale(id, saleData) {
    return await this.apiClient.put(`${this.basePath}/${id}`, saleData);
  }

  async deleteSale(id) {
    return await this.apiClient.delete(`${this.basePath}/${id}`);
  }
}

module.exports = SalesClient;
