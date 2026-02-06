// Categories-specific client (uses ApiClient)
// Based on Swagger: GET /api/categories, GET /api/categories/{id}, POST /api/categories,
// PUT /api/categories/{id}, DELETE /api/categories/{id}, GET /api/categories/sub-categories,
// GET /api/categories/page, GET /api/categories/main, GET /api/categories/summary

class CategoryClient {
  constructor(apiClient) {
    this.apiClient = apiClient;
    this.basePath = '/api/categories';
  }

  /**
   * GET /api/categories - Get all categories (with optional name filter)
   * @param {Object} params - Optional parameters (e.g., { name: 'categoryName' })
   */
  async getAllCategories(params = {}) {
    return await this.apiClient.get(this.basePath, params);
  }

  /**
   * GET /api/categories/{id} - Get specific category by ID
   * @param {number} id - Category ID
   */
  async getCategoryById(id) {
    return await this.apiClient.get(`${this.basePath}/${id}`);
  }

  /**
   * GET /api/categories/sub-categories - Get all sub-categories
   */
  async getSubCategories() {
    return await this.apiClient.get(`${this.basePath}/sub-categories`);
  }

  /**
   * GET /api/categories/main - Get main categories only
   */
  async getMainCategories() {
    return await this.apiClient.get(`${this.basePath}/main`);
  }

  /**
   * GET /api/categories/summary - Get category summary
   */
  async getCategorySummary() {
    return await this.apiClient.get(`${this.basePath}/summary`);
  }

  /**
   * GET /api/categories/page - Search with pagination and sorting
   * @param {Object} params - Pagination params (page, size, name, parentId, sort)
   */
  async getCategoriesWithPagination(params = {}) {
    const defaultParams = {
      page: 0,
      size: 10,
      ...params
    };
    return await this.apiClient.get(`${this.basePath}/page`, defaultParams);
  }

  /**
   * POST /api/categories - Create a new category
   * @param {Object} categoryData - Category data { name, parentId? }
   */
  async createCategory(categoryData) {
    return await this.apiClient.post(this.basePath, categoryData);
  }

  /**
   * PUT /api/categories/{id} - Update a category
   * @param {number} id - Category ID
   * @param {Object} categoryData - Updated category data
   */
  async updateCategory(id, categoryData) {
    return await this.apiClient.put(`${this.basePath}/${id}`, categoryData);
  }

  /**
   * DELETE /api/categories/{id} - Delete a category
   * @param {number} id - Category ID
   */
  async deleteCategory(id) {
    return await this.apiClient.delete(`${this.basePath}/${id}`);
  }
}

module.exports = CategoryClient;
