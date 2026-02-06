# API_ADMIN_030 through API_ADMIN_038
# These scenarios test Category API from an Admin perspective

@admin @category @api
Feature: Category API - Admin Operations
  As an admin user
  I want to interact with the Category API
  So that I can perform full CRUD operations on categories

  Background:
    Given the API service is running

  @API_ADMIN_030 @get @filter @positive
  Scenario: API_ADMIN_030 - Verify that an admin can retrieve all categories using correct parameter
    Given the admin has a valid authentication token
    When the admin sends a GET request to "/api/categories" with name parameter "Test"
    Then the API should return HTTP status code 200
    And the response body should contain a list of categories matching the parameter
    And no error message should be returned

  @API_ADMIN_031 @get @all @positive
  Scenario: API_ADMIN_031 - Verify that an admin can retrieve all categories without providing parameters
    Given the admin has a valid authentication token
    When the admin sends a GET request to "/api/categories" without parameters
    Then the API should return HTTP status code 200
    And the response body should contain a list of all categories
    And no error message should be returned

  @API_ADMIN_032 @get @filter @negative
  Scenario: API_ADMIN_032 - Verify the API response when the admin provides invalid query parameters while retrieving categories
    Given the admin has a valid authentication token
    When the admin sends a GET request to "/api/categories" with invalid parameter "InvalidParam!@#"
    Then the API should return HTTP status code 400 or empty result
    And if error, the response body should contain a clear error message indicating invalid parameter
    And no categories should be returned or empty list

  @API_ADMIN_033 @get @summary @positive
  Scenario: API_ADMIN_033 - Verify that an admin can successfully retrieve the summary of all categories
    Given the admin has a valid authentication token
    When the admin sends a GET request to "/api/categories/summary"
    Then the API should return HTTP status code 200
    And the response body should contain category summary information
    And no error message should be returned

  @API_ADMIN_034 @get @subcategories @positive
  Scenario: API_ADMIN_034 - Verify that an admin can successfully retrieve all sub-categories when providing valid authorization
    Given the admin has a valid authentication token
    When the admin sends a GET request to "/api/categories/sub-categories"
    Then the API should return HTTP status code 200
    And the response body should contain a list of all sub-categories with expected fields
    And no error message should be returned

  @API_ADMIN_035 @get @pagination @positive
  Scenario: API_ADMIN_035 - Verify that an admin can successfully search categories by name or parent ID with Pagination and sorting using valid authorization
    Given the admin has a valid authentication token
    When the admin sends a GET request to "/api/categories/page" with page "0" and name parameter
    Then the API should return HTTP status code 200
    And the response body should contain a paginated and sorted list
    And categories should match the search input
    And no error message should be returned

  @API_ADMIN_036 @get @main @positive
  Scenario: API_ADMIN_036 - Verify that an admin can successfully retrieve main categories only when providing valid authorization
    Given the admin has a valid authentication token
    When the admin sends a GET request to "/api/categories/main"
    Then the API should return HTTP status code 200
    And the response body should contain a list of main categories only
    And the returned categories should not contain sub-categories
    And no error message should be returned

  @API_ADMIN_037 @post @create @positive
  Scenario: API_ADMIN_037 - Verify that an admin can successfully create a category by providing a valid name
    Given the admin has a valid authentication token
    When the admin sends a POST request to "/api/categories" with valid category name "APITest"
    Then the API should return HTTP status code 201
    And the response body should contain newly created category details
    And the category should be saved successfully in the database
    And no error message should be returned

  @API_ADMIN_038 @post @create @negative @validation
  Scenario: API_ADMIN_038 - Verify that the API does not allow creating a category when the name field is missing or empty
    Given the admin has a valid authentication token
    When the admin sends a POST request to "/api/categories" with invalid request body
    Then the API should return HTTP status code 400
    And the response body should contain a clear error message indicating invalid request body
    And no category should be created
