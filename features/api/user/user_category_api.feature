Feature: User Category API Management
  As a User
  I want to retrieve category details
  So that I can view available categories

  Background:
    Given the API service is running
    And I am authenticated as a User

  # TC_Category_Management_API_User_018
  Scenario: Verify API response when requesting a category using a valid category ID
    Given I get a valid Category ID from the system
    When I send a GET request to "/api/categories/{id}" with the valid ID
    Then the response status code should be 200
    And the response should contain the category details with the correct ID

  # TC_Category_Management_API_User_019
  Scenario: Verify API response when requesting a category using an invalid category ID
    When I send a GET request to "/api/categories/99999"
    Then the response status code should be 404
    And the response should contain a "Category Not Found" error message

  # TC_Category_Management_API_User_020
  Scenario: Verify API functionality of retrieving all categories (No params)
    When I send a GET request to "/api/categories"
    Then the response status code should be 200
    And the response should contain a list of categories

  # TC_Category_Management_API_User_021
  Scenario: Verify API functionality of retrieving categories with valid query parameters
    Given I get a valid Category ID from the system
    When I send a GET request to "/api/categories" with query param "page=0"
    Then the response status code should be 200
    And the response should contain a list of categories

# TC_Category_Management_API_User_022
  Scenario: Verify API functionality when invalid query parameters are provided
    When I send a GET request to "/api/categories" with query param "invalidParam=xyz"
    Then the response status code should be 200
    And the response should contain a list of categories

  # TC_Category_Management_API_User_023
  Scenario: Verify API functionality of retrieving category summary
    When I send a GET request to "/api/categories/summary"
    Then the response status code should be 200
    And the response should contain the category summary structure