Feature: Admin Category Management
  As an Admin
  I want to manage categories
  So that I can organize the plant inventory system

  Background:
    Given I navigate to the login page
    And I login as "admin" with password "admin123"

  # TC_Category_Management_UI_Admin_001
  Scenario: Admin should be able to search categories by name
    Given categories exist in the system
    And a category "Flowers" exists in the system
    When I navigate to the Category management page
    And I enter "Flowers" in the category search field
    And I click on Search button
    Then I should see only categories matching "Flowers" in the results

  # TC_Category_Management_UI_Admin_002
  Scenario: Admin should be able to add a category with both Category Name and Parent Category
    When I navigate to the Category management page
    And I click on "Add Category" button
    And I enter "Roses" as Category Name
    And I select "Flowers" as Parent Category
    And I click on Add button
    Then I should see a success message
    And the category "Roses" should be added to the list

  # TC_Category_Management_UI_Admin_003
  Scenario: Admin should not be able to add a category without Category Name
    When I navigate to the Category management page
    And I click on "Add Category" button
    And I leave Category Name field empty
    And I select "Flowers" as Parent Category
    And I click on Add button
    Then I should see an error message below Category Name field
    And the category should not be added

  # TC_Category_Management_UI_Admin_004
  Scenario: Admin should be able to add a category with Category Name without Parent Category
    When I navigate to the Category management page
    And I click on "Add Category" button
    And I enter "MainCat" as Category Name
    And I leave Parent Category field empty
    And I click on Add button
    Then I should see a success message
    And the category "MainCat" should be added to the list

  # TC_Category_Management_UI_Admin_005
  Scenario: Admin should be able to delete a category from the list
    Given a category "TestCat" exists in the system
    When I navigate to the Category management page
    And I click on Delete action for "TestCat"
    And I confirm the deletion
    Then I should see a success message
    And the category "TestCat" should not appear in the list