Feature: Admin Category API Management
  As an Admin
  I want to Create, Update and Delete categories
  So that I can manage the system inventory

  Background:
    Given the API service is running
    And I am authenticated as an Admin

  # TC_Category_Management_API_Admin_026
  Scenario: Verify API retrieves all categories when no parameters are provided
    Given multiple categories exist in the system
    And I am authenticated as a User
    When I send a GET request to "/api/categories" without any query parameters
    Then the response status code should be 200
    And the response body should contain a list of all categories
    And each category should have the correct structure with id, name, and parentName
    And the response format should match the API specification


  # TC_Category_Management_API_Admin_027
  Scenario: Verify API functionality of updating a category using an existing ID
    Given I get a valid Category ID from the system
    When I send a PUT request to "/api/categories/{id}" with a new name "UpdatedCat"
    Then the response status code should be 200
    And the response should confirm the name is "UpdatedCat"

  # TC_Category_Management_API_Admin_028
  Scenario: Verify API response when updating a non-existing category ID
    When I send a PUT request to "/api/categories/99999" with a new name "GhostCat"
    Then the response status code should be 404
    And the response should contain a "Category not found" error message

  # TC_Category_Management_API_Admin_029
  Scenario: Verify API functionality of deleting a category using an existing ID
    Given I create a temporary category to delete
    When I send a DELETE request to the created category endpoint
    Then the response status code should be 204
    And the category should no longer exist in the system

  # TC_Category_Management_API_Admin_030
  Scenario: Verify API response when deleting a non-existing category ID
    When I send a DELETE request to "/api/categories/99999"
    Then the response status code should be 404
    And the response should contain a "Category not found" error message