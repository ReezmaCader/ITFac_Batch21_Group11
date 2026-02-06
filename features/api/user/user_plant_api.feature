Feature: User Plant API Management
  As a User
  I want to retrieve plant information via API
  So that I can view plant data programmatically

  Background:
    Given the API service is running

  # TC_Plant_Management_API_User_011
  Scenario: Verify API response when accessing plant list without authentication
    When I send a GET request to "/api/plants" without authentication
    Then the response status code should be 401
    And the response should contain an "UNAUTHORIZED" error message

  # TC_Plant_Management_API_User_012
  Scenario: Verify API response when no plant records exist
    Given I am authenticated as a User
    And no plant records exist in the system
    When I send a GET request to "/api/plants"
    Then the response status code should be 200
    And the response should contain an empty plant list

  # TC_Plant_Management_API_User_013
  Scenario: Verify API returns plants sorted by price
    Given I am authenticated as a User
    And multiple plant records with different prices exist
    When I send a GET request to "/api/plants" with query param "sortBy=price&direction=asc"
    Then the response status code should be 200
    And the response should contain plants sorted by price in ascending order

  # TC_Plant_Management_API_User_014
  Scenario: Verify User cannot add a plant using API
    Given I am authenticated as a User
    And I get a valid sub-category ID from the system
    When I send a POST request to "/api/plants/category/{categoryId}" with plant data
    Then the response status code should be 403
    And the response should contain a "FORBIDDEN" error message

  # TC_Plant_Management_API_User_015
  Scenario: Verify API supports pagination parameters
    Given I am authenticated as a User
    And more than 10 plant records exist
    When I send a GET request to "/api/plants" with query param "page=1&size=10"
    Then the response status code should be 200
    And the response should return only 10 plant records
