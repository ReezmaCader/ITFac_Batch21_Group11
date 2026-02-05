class SalesClient {
  constructor(apiClient) {
    this.apiClient = apiClient;
    this.basePath = '/api/sales';
  }

  async getAllSales() {
    return await this.apiClient.get(this.basePath);
  }

  async getSalesWithPagination(page, size) {
    return await this.apiClient.get(this.basePath, { page, size });
  }

  async getSaleById(id) {
    return await this.apiClient.get(`${this.basePath}/${id}`);
  }

  async createSale(saleData) {
    return await this.apiClient.post(this.basePath, saleData);
  }

  async updateSale(id, saleData) {
    return await this.apiClient.put(`${this.basePath}/${id}`, saleData);
  }

  async deleteSale(id) {
    return await this.apiClient.delete(`${this.basePath}/${id}`);
  }
}

module.exports = SalesClient;
