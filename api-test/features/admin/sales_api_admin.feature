# TC_Sales_API_Admin_006 through TC_Sales_API_Admin_010
# These scenarios test Sales API from an Admin perspective

Feature: Sales API - Admin Operations
  As an admin user
  I want to manage sales via the API
  So that I can create, update, and delete sales records

  Background:
    Given the admin has a valid authentication token

  @admin @post @positive
  Scenario: TC_Sales_API_Admin_006 - Create a sale successfully
    Given a plant with available stock exists
    When the admin sends a POST request to create a sale for available plant
    Then the API should return HTTP status code 201 or 400
    And if successful the response body should contain the newly created sale details

  @admin @post @negative
  Scenario: TC_Sales_API_Admin_007 - Validate quantity cannot be zero or negative
    When the admin sends a POST request with quantity 0
      | plantId | quantity | price |
      | 3       | 0        | 500   |
    Then the API should return HTTP status code 400
    And the response body should return a validation error for quantity
    And the response should contain error "BAD_REQUEST"
    And the response should contain message "Quantity must be greater than 0"

  @admin @post @negative
  Scenario: TC_Sales_API_Admin_008 - Validate stock availability before sale creation
    When the admin sends a POST request with quantity exceeding available stock
      | plantId | quantity | price |
      | 1       | 9999     | 800   |
    Then the API should return HTTP status code 400
    And the response body should indicate insufficient stock
    And the response should contain error "BAD_REQUEST"

  @admin @delete @positive
  Scenario: TC_Sales_API_Admin_009 - Delete a sale record successfully
    Given the admin has a valid authentication token
    And a sale record exists in the system
    When the admin sends a DELETE request for a sale ID
    Then the API should return HTTP status code 200 or 204
    And the sale record should be removed from the database successfully

  @admin @post @negative
  Scenario: TC_Sales_API_Admin_010 - Validate missing plant ID in request
    When the admin sends a POST request with no plant ID
      | quantity | price |
      | 5        | 400   |
    Then the API should return HTTP status code 400 or 500
    And the response body should indicate that plant ID is mandatory
