Feature: Plant Management API
  Tests are based on TestCaseDocument__11__v0.1.pdf

  @TC_Plant_Management_API_User_011
  Scenario: User can retrieve plant list with valid token
    Given I am authenticated via API as "user"
    And a plant exists in the system
    When I request all plants via API
    Then the API response status should be 200
    And the API response should be a list
    And the API response items should include fields "id,name,category,price,quantity"

  @TC_Plant_Management_API_User_012
  Scenario: User can retrieve plant by id
    Given I am authenticated via API as "user"
    And a plant exists in the system
    When I request the plant by id via API
    Then the API response status should be 200
    And the API response should include field "id"

  @TC_Plant_Management_API_User_013
  Scenario: User requests plant by invalid id
    Given I am authenticated via API as "user"
    When I request the plant by invalid id via API
    Then the API response status should be 404

  @TC_Plant_Management_API_User_014
  Scenario: User can retrieve plants by category id
    Given I am authenticated via API as "user"
    And a plant exists in the system
    When I request plants by category via API
    Then the API response status should be 200
    And the API response should be a list

  @TC_Plant_Management_API_User_015
  Scenario: User requests plants by invalid category id
    Given I am authenticated via API as "user"
    When I request plants by invalid category id via API
    Then the API response status should be 404

  @TC_Plant_Management_API_Admin_016
  Scenario: Admin updates a plant with a valid id
    Given I am authenticated via API as "admin"
    And a plant exists in the system
    When I update the plant via API
    Then the API response status should be 200

  @TC_Plant_Management_API_Admin_017
  Scenario: Admin updates a plant with invalid id
    Given I am authenticated via API as "admin"
    When I update a plant with an invalid id via API
    Then the API response status should be 404

  @TC_Plant_Management_API_Admin_018
  Scenario: Admin deletes a plant with valid id
    Given I am authenticated via API as "admin"
    And a plant exists in the system
    When I delete the plant via API
    Then the API response status should be 204

  @TC_Plant_Management_API_Admin_019
  Scenario: Admin deletes a plant with invalid id
    Given I am authenticated via API as "admin"
    When I delete a plant with an invalid id via API
    Then the API response status should be 404

  @TC_Plant_Management_API_Admin_020
  Scenario: Admin adds a new plant
    Given I am authenticated via API as "admin"
    When I create a plant via API
    Then the API response status should be 201
    And the API response should include an id
