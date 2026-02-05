/**
 * Sale data for test automation
 * Contains sale-related test data and constants
 */

const saleData = {
  validSale: {
    plantId: '1',
    quantity: '2'
  },
  invalidSale: {
    plantId: '',
    quantity: '0'
  },
  largeSale: {
    plantId: '1',
    quantity: '9999'
  }
};

// Column headers as displayed in the Sales UI (matching actual application)
const salesTableColumns = {
  plant: 'Plant',
  quantity: 'Quantity',
  totalPrice: 'Total Price',
  soldAt: 'Sold At'
};

// Validation messages as displayed in the UI
const validationMessages = {
  plantRequired: 'Plant is required',
  quantityRequired: 'Value must be greater than or equal to 1.',
  noSalesFound: 'No sales found'
};

module.exports = {
  saleData,
  salesTableColumns,
  validationMessages
};
