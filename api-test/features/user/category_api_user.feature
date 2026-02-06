# API_USER_018 through API_USER_029
# These scenarios test Category API from a User perspective

@user @category @api
Feature: Category API - User Operations
  As a regular user
  I want to interact with the Category API
  So that I can view categories but not modify them

  Background:
    Given the API service is running

  @API_USER_018 @get @subcategories @positive
  Scenario: API_USER_018 - Verify the API response when retrieving all sub-categories with valid authorization
    Given the user has a valid authentication token
    When the user sends a GET request to "/api/categories/sub-categories"
    Then the API should return HTTP status code 200
    And the response body should contain a list of all sub-categories
    And each sub-category should include expected fields
    And no error message should be returned

  @API_USER_019 @get @subcategories @negative @unauthorized
  Scenario: API_USER_019 - Verify the API response when retrieving all sub-categories without authorization
    Given the user does not have an authentication token
    When the user sends a GET request to "/api/categories/sub-categories"
    Then the API should return HTTP status code 401
    And the response body should contain a proper error message

  @API_USER_020 @get @pagination @positive
  Scenario: API_USER_020 - Verify the API response when searching by name or parent ID with Pagination and sorting using valid authorization
    Given the user has a valid authentication token
    When the user sends a GET request to "/api/categories/page" with pagination parameters
    Then the API should return HTTP status code 200
    And the response body should contain a paginated and sorted list
    And categories should match the search input
    And no error message should be returned

  @API_USER_021 @get @pagination @negative @unauthorized
  Scenario: API_USER_021 - Verify the API response when searching by name or parent ID with Pagination and sorting without authorization
    Given the user does not have an authentication token
    When the user sends a GET request to "/api/categories/page" with pagination parameters
    Then the API should return HTTP status code 401
    And the response body should contain a proper error message
    And no category data should be returned

  @API_USER_022 @get @main @positive
  Scenario: API_USER_022 - Verify the API response when retrieving main categories only using valid authorization
    Given the user has a valid authentication token
    When the user sends a GET request to "/api/categories/main"
    Then the API should return HTTP status code 200
    And the response body should contain a list of main categories only
    And no sub-categories should be included
    And no error message should be returned

  @API_USER_023 @get @main @negative @unauthorized
  Scenario: API_USER_023 - Verify the API response when retrieving main categories only without authorization
    Given the user does not have an authentication token
    When the user sends a GET request to "/api/categories/main"
    Then the API should return HTTP status code 401
    And the response body should contain a proper error message
    And no category data should be returned

  @API_USER_024 @put @update @negative @forbidden
  Scenario: API_USER_024 - Verify that an authorized user is not allowed to update categories
    Given the user has a valid authentication token
    When the user sends a PUT request to "/api/categories/{id}" with category data
    Then the API should return HTTP status code 403
    And the response body should contain a proper error message
    And the category details should not be updated

  @API_USER_025 @put @update @negative @unauthorized
  Scenario: API_USER_025 - Verify that an unauthorized user cannot update categories
    Given the user does not have an authentication token
    When the user sends a PUT request to "/api/categories/{id}" with category data
    Then the API should return HTTP status code 401
    And the response body should contain a proper error message
    And the category should not be updated

  @API_USER_026 @delete @negative @forbidden
  Scenario: API_USER_026 - Verify that an authorized user is not allowed to delete a category
    Given the user has a valid authentication token
    When the user sends a DELETE request to "/api/categories/{id}"
    Then the API should return HTTP status code 403
    And the response body should contain a proper error message
    And the category should not be deleted

  @API_USER_027 @delete @negative @unauthorized
  Scenario: API_USER_027 - Verify that an unauthorized user cannot delete a category
    Given the user does not have an authentication token
    When the user sends a DELETE request to "/api/categories/{id}"
    Then the API should return HTTP status code 401
    And the response body should contain a proper error message
    And the category should not be deleted

  # @API_USER_028 @post @create @negative @forbidden
  # Scenario: API_USER_028 - Verify that an authorized user cannot create a new category
  #   Given the user has a valid authentication token
  #   When the user sends a POST request to "/api/categories" with category data
  #   Then the API should return HTTP status code 403
  #   And the response body should contain a proper error message
  #   And the category should not be created

  @API_USER_029 @post @create @negative @unauthorized
  Scenario: API_USER_029 - Verify that an unauthorized user cannot create a new category
    Given the user does not have an authentication token
    When the user sends a POST request to "/api/categories" with category data
    Then the API should return HTTP status code 401
    And the response body should contain a proper error message
    And the category should not be created
