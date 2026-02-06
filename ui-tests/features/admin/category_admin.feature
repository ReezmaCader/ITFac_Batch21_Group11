@admin @category @dashboard
Feature: Dashboard and Category Module - Admin Tests
  As an admin user
  I want to manage the dashboard and categories
  So that I can view summary information and perform CRUD operations on categories

  Background:
    Given the admin is on the login page

  @TC_DASHBOARD_UI_ADMIN_007 @search @negative
  Scenario: TC_DASHBOARD_UI_ADMIN_007 - Verify search functionality when an incorrect category name is entered
    Given the admin logs in with valid credentials
    When the admin navigates to the Categories page
    And the admin clicks on the search input field
    And the admin enters an incorrect category name "XYZ123NonExistent"
    And the admin clicks the Search button
    Then the system should not return any matching categories
    And a user friendly message should be displayed such as "No results found"
    And the system should not crash or show incorrect results

  @TC_DASHBOARD_UI_ADMIN_008 @login @positive
  Scenario: TC_DASHBOARD_UI_ADMIN_008 - Verify whether the Admin dashboard is loaded after successful login
    When the admin enters correct username and password
    And the admin clicks on the Login button
    Then the system should navigate to the Dashboard
    And the Dashboard elements should be visible without any error message

  @TC_DASHBOARD_UI_ADMIN_009 @navigation @positive
  Scenario: TC_DASHBOARD_UI_ADMIN_009 - Verify whether the Admin Dashboard navigation menu is highlighted correctly
    Given the admin logs in with valid credentials
    Then the navigation menu should be visible on the dashboard
    When the admin clicks on the Categories menu item
    Then the Categories menu should be highlighted
    And only one menu item should be highlighted at a time
    When the admin clicks on the Plants menu item
    Then the Plants menu should be highlighted
    When the admin clicks on the Dashboard menu item
    Then the Dashboard menu should be highlighted
    And the navigation should be smooth without UI misalignment

  @TC_DASHBOARD_UI_ADMIN_010 @dashboard @summary @positive
  Scenario: TC_DASHBOARD_UI_ADMIN_010 - Verify the display of Category, Plants, and Sales Summary information on the Admin Dashboard
    Given the admin logs in with valid credentials
    When the admin navigates to the Dashboard
    Then the dashboard should display category summary information
    And the dashboard should display plants summary information
    And the dashboard should display sales summary information
    And the displayed values should be accurate without UI errors

  @TC_DASHBOARD_UI_ADMIN_011 @category @button @positive
  Scenario: TC_DASHBOARD_UI_ADMIN_011 - Verify whether the Add category button is visible on the admin category page
    Given the admin logs in with valid credentials
    When the admin navigates to the Categories page
    Then the Add Category button should be clearly visible
    And the Add Category button should be enabled and properly aligned

  @TC_DASHBOARD_UI_ADMIN_012 @category @cancel @positive
  Scenario: TC_DASHBOARD_UI_ADMIN_012 - Verify the functionality of the Cancel button on the Add category page
    Given the admin logs in with valid credentials
    When the admin navigates to the Categories page
    And the admin clicks on the Add Category button
    And the admin clicks on the Cancel button
    Then the system should cancel the operation
    And the admin should be redirected to the category page
    And no new category should be added

  @TC_DASHBOARD_UI_ADMIN_013 @category @validation @negative
  Scenario: TC_DASHBOARD_UI_ADMIN_013 - Verify that the category name field does not accept fewer than 3 characters
    Given the admin logs in with valid credentials
    When the admin navigates to the Categories page
    And the admin clicks on the Add Category button
    And the admin enters a category name with less than 3 characters "ab"
    And the admin clicks the Save button
    Then the system should not accept the category name
    And a validation error message should be displayed
    And the category should not be saved

  @TC_DASHBOARD_UI_ADMIN_014 @category @validation @positive
  Scenario: TC_DASHBOARD_UI_ADMIN_014 - Verify whether the category name field accepts characters between 3 and 10
    Given the admin logs in with valid credentials
    When the admin navigates to the Categories page
    And the admin clicks on the Add Category button
    And the admin enters a category name with 3 to 10 characters "TestCat"
    And the admin selects a parent category
    And the admin clicks the Save button
    Then the system should accept the category name
    And no validation error should be displayed
    And the category should be saved successfully

  @TC_DASHBOARD_UI_ADMIN_015 @category @validation @negative
  Scenario: TC_DASHBOARD_UI_ADMIN_015 - Verify whether the category name field does not accept more than 10 characters
    Given the admin logs in with valid credentials
    When the admin navigates to the Categories page
    And the admin clicks on the Add Category button
    And the admin enters a category name with more than 10 characters "Abcdefghijk"
    And the admin clicks the Save button
    Then the system should not accept the category name
    And a validation error message should be displayed
    And the category should not be saved

  @TC_DASHBOARD_UI_ADMIN_016 @category @actions @positive
  Scenario: TC_DASHBOARD_UI_ADMIN_016 - Verify whether the edit and delete actions are enabled on the category page
    Given the admin logs in with valid credentials
    When the admin navigates to the Categories page
    Then at least one category should exist in the system
    And the Edit action should be visible and enabled for each category
    And the Delete action should be visible and enabled for each category
    And the admin can initiate Edit or Delete actions without errors

  @TC_DASHBOARD_UI_ADMIN_017 @category @edit @positive
  Scenario: TC_DASHBOARD_UI_ADMIN_017 - Verify whether clicking on the Edit button allows editing a particular category
    Given the admin logs in with valid credentials
    When the admin navigates to the Categories page
    And at least one category exists in the system
    And the admin clicks the Edit button for a specific category
    And the admin modifies the category name to "Updated"
    And the admin clicks the Save button
    Then the category details should be updated successfully
    And the updated category name should reflect in the category list
    And no errors or validation issues should occur
