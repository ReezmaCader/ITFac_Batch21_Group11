Feature: User Plant Management UI
  As a Normal User
  I want to view plants in the system
  So that I can see available plant inventory

  Background:
    Given I navigate to the login page
    And I login as "Testuser" with password "test123"

  # TC_Plant_Management_UI_User_001
  Scenario: User should see "Low" badge for plants with quantity less than 5
    Given plants exist in the system with quantity less than 5
    When I navigate to the Plant management page
    Then I should see plants with quantity less than 5 displaying a "Low" badge

  # TC_Plant_Management_UI_User_002
  Scenario: User should NOT see "Low" badge for plants with quantity 5 or more
    Given plants exist in the system with quantity 5 or more
    When I navigate to the Plant management page
    Then I should NOT see a "Low" badge for plants with quantity 5 or more

  # TC_Plant_Management_UI_User_003
  Scenario: User should be able to sort plants by name
    Given multiple plants exist in the system
    When I navigate to the Plant management page
    And I sort plants by "Name"
    Then the plant list should be displayed in alphabetical order

  # TC_Plant_Management_UI_User_004
  Scenario: User should be able to sort plants by quantity
    Given multiple plants exist in the system
    When I navigate to the Plant management page
    And I sort plants by "Quantity"
    Then the plant list should be ordered by quantity

  # TC_Plant_Management_UI_User_005
  Scenario: User should see pagination working in plant list
    Given more than one page of plants exist in the system
    When I navigate to the Plant management page
    And I click on the next page option
    Then I should see the next set of plant records
