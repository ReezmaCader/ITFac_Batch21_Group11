# TC_Sales_API_User_001 through TC_Sales_API_User_005
# These scenarios test Sales API from a User perspective

Feature: Sales API - User Operations
  As a regular user
  I want to interact with the Sales API
  So that I can view sales data but not modify it

  Background:
    Given the user has a valid authentication token

  @user @get @positive
  Scenario: TC_Sales_API_User_001 - Get sales list successfully
    When the user sends a GET request to the sales API
    Then the API should return HTTP status code 200
    And the response body should contain a list of sales records
    And each sale object should include required fields such as id, plantId, quantity, price, and saleDate
    And the response data structure should match the API specification

  @user @post @negative
  Scenario: TC_Sales_API_User_002 - Restrict sale creation for regular users
    Given the user has been logged in as User
    When the user sends a POST request to the sales API
    Then the API should return HTTP status code 403
    And the response body should indicate that the user is not authorized to perform this action
    And the response should contain error "Forbidden"
    And the response should contain message "Access denied"

  @user @delete @negative
  Scenario: TC_Sales_API_User_003 - Restrict sale deletion for regular users
    Given the user has been logged in as User
    When the user sends a DELETE request to the sales API
    Then the API should return HTTP status code 403
    And the response body should indicate insufficient permissions
    And the response should contain error "Forbidden"
    And the response should contain message "User is not allowed to delete sales"

  @user @pagination @positive
  Scenario: TC_Sales_API_User_004 - Get sales with pagination parameters
    When the user sends a GET request with page "0" and size "10" params
    Then the API should return HTTP status code 200
    And the response should return only the requested number of records based on page and size parameters
    And pagination metadata should be present if applicable
    And the response should contain page "0"
    And the response should contain size "10"
    And the response should contain totalElements greater than 0

  @user @security @negative
  Scenario: TC_Sales_API_User_005 - Verify API security for unauthenticated requests
    Given the user does not have an authentication token
    When the user sends a GET request to the sales API
    Then the API should return HTTP status code 401
    And the response body should indicate missing or invalid authentication
    And the response should contain status 401
    And the response should contain error "Unauthorized"
    And the response should contain message "Authentication token is missing or invalid"
