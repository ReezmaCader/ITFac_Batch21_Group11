Feature: Admin Plant API Management
  As an Admin
  I want to manage plants via API
  So that I can create, update, and validate plant data programmatically

  Background:
    Given the API service is running
    And I am authenticated as an Admin

  # TC_Plant_Management_API_Admin_016
  Scenario: Verify API response when mandatory fields are missing
    Given I get a valid sub-category ID from the system
    When I send a POST request to "/api/plants/category/{categoryId}" with incomplete payload
      """
      {
        "name": "IncompletePlant"
      }
      """
    Then the response status code should be 400
    And the response should contain validation errors for "quantity" and "price"

  # TC_Plant_Management_API_Admin_017
  Scenario: Verify API response when quantity is negative
    Given I get a valid sub-category ID from the system
    When I send a POST request to "/api/plants/category/{categoryId}" with payload
      """
      {
        "name": "NegativeQtyPlant",
        "price": 50,
        "quantity": -10
      }
      """
    Then the response status code should be 400
    And the response should contain validation error for "quantity" with message "Quantity cannot be negative"

  # TC_Plant_Management_API_Admin_018
  Scenario: Verify API response when price is zero
    Given I get a valid sub-category ID from the system
    When I send a POST request to "/api/plants/category/{categoryId}" with payload
      """
      {
        "name": "InvalidPricePlant",
        "price": 0,
        "quantity": 10
      }
      """
    Then the response status code should be 400
    And the response should contain validation error for "price" with message "Price must be greater than 0"

  # TC_Plant_Management_API_Admin_019
  Scenario: Verify API response when User tries to delete a plant
    Given I am authenticated as a User
    And I get a valid plant ID from the system
    When I send a DELETE request to plant endpoint "/api/plants/{plantId}"
    Then the response status code should be 403
    And the response should contain a "Forbidden" error message

  # TC_Plant_Management_API_Admin_020
  Scenario: Verify successful plant creation by Admin in sub-category
    Given I get a valid sub-category ID from the system
    When I send a POST request to "/api/plants/category/{categoryId}" with payload
      """
      {
        "name": "SuccessPlant",
        "price": 100,
        "quantity": 10
      }
      """
    Then the response status code should be 201
    And the plant should be created successfully
