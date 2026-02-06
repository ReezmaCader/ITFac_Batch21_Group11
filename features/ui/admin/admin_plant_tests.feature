Feature: Admin Plant Management UI
  As an Admin
  I want to manage plants in the system
  So that I can add, edit, and validate plant data

  Background:
    Given I navigate to the login page
    And I login as "admin" with password "admin123"

  # TC_Plant_Management_UI_Admin_006
  Scenario: Admin should see validation messages when mandatory fields are empty
    When I navigate to the Plant management page
    And I click on Add Plant button
    And I click on Save button without entering any data
    Then I should see validation messages under all required fields

  # TC_Plant_Management_UI_Admin_007
  Scenario: Admin should see error message when price is zero
    When I navigate to the Plant management page
    And I click on Add Plant button
    And I enter "TestPlant" as Plant Name
    And I select a valid category
    And I enter "0" as Price
    And I enter "10" as Quantity
    And I click on Save button
    Then I should see an error message stating "Price must be greater than 0"

  # TC_Plant_Management_UI_Admin_008
  Scenario: Admin should see error message when quantity is negative
    When I navigate to the Plant management page
    And I click on Add Plant button
    And I enter "TestPlant" as Plant Name
    And I select a valid category
    And I enter "100" as Price
    And I enter "-1" as Quantity
    And I click on Save button
    Then I should see an error message stating "Quantity cannot be negative"

  # TC_Plant_Management_UI_Admin_009
  Scenario: Admin should see validation error when selecting main category
    When I navigate to the Plant management page
    And I click on Add Plant button
    And I enter "TestPlant" as Plant Name
    And I select a main category
    And I enter "100" as Price
    And I enter "10" as Quantity
    And I click on Save button
    Then I should see a validation error

  # TC_Plant_Management_UI_Admin_010
  Scenario: Admin should be able to edit plant details successfully
    Given a plant "EditPlant" exists in the system
    When I navigate to the Plant management page
    And I click on Edit action for plant "EditPlant"
    And I change the plant name to "Plant"
    And I click on Save button
    Then I should see a plant success message
    And the plant "Plant" should appear in the list
