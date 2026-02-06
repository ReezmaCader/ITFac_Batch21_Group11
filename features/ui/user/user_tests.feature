Feature: Category Management User Functionality
  As a Normal User
  I want to view the category management page
  So that I can check categories without modifying them

  Background:
    Given I navigate to the login page
    And I login as "Testuser" with password "test123"

  # TC_Category_Management_UI_User_001
  Scenario: User should see Dashboard immediately after successful login
    Then I should be on the Dashboard page
    And I should see the page header "Dashboard"

  # TC_Category_Management_UI_User_002
  Scenario: User should see navigation menu highlighting the active page
    When I click on "Categories" in the sidebar
    Then the navigation menu should highlight "Categories" as active
    When I click on "Plants" in the sidebar
    Then the navigation menu should highlight "Plants" as active

  # TC_Category_Management_UI_User_003
  Scenario: User should see Category, Plants, and Sales summary on Dashboard
    When I am on the Dashboard page
    Then I should see "Categories" summary card
    And I should see "Plants" summary card
    And I should see "Sales" summary card

  # TC_Category_Management_UI_User_004
  Scenario: User should see appropriate message when searching for non-existent category
    When I navigate to the Category management page
    And I search for a category with name "NonExistentCategoryXYZ123"
    Then I should see "No category found" message in the table

  # TC_Category_Management_UI_User_005
  Scenario: User should see Add Category button is disabled
    When I navigate to the Category management page
    Then I should NOT see the "Add Category" button

  # TC_Category_Management_UI_User_006
  Scenario: User should see Edit and Delete actions are disabled
    When I navigate to the Category management page
    Then the "Edit" buttons should be disabled
    And the "Delete" buttons should be disabled