@user @category
Feature: Category Module - User Tests
  As a regular user
  I want to view and navigate categories
  So that I can browse category information with pagination and filtering

  Background:
    Given the user is logged in to the system as User
    And the user navigates to the Categories page

  @TC_DASHBOARD_UI_USER_001 @pagination @positive
  Scenario: TC_DASHBOARD_UI_USER_001 - Verify the functionality whether the list of categories are loading with the pagination
    Then the categories should be displayed on the page
    And the pagination controls should be visible including Next and Previous buttons
    When the user clicks on the Next button or page number 2
    Then the categories should be loaded and should not repeat from the first page
    When the user clicks on the Previous button
    Then the first page of categories should be loaded
    And navigating through each page should load categories correctly

  @TC_DASHBOARD_UI_USER_002 @search @positive
  Scenario: TC_DASHBOARD_UI_USER_002 - Verify the functionality of searching by category name
    Then the search field should be visible and enabled
    When the user enters a valid category name "asb" in the search field
    And the user clicks the Search button
    Then the category list should display categories matching the search input
    And no non-matching categories should be displayed
    When the user clears the search input
    And the user clicks the Search button
    Then all categories should be displayed

  @TC_DASHBOARD_UI_USER_003 @filter @positive
  Scenario: TC_DASHBOARD_UI_USER_003 - Verify the functionality of filtering by parent category
    Then the parent category filter dropdown should be visible
    When the user clicks the parent category dropdown
    And the user selects a parent category from the dropdown
    Then the category list should display only categories related to the selected parent
    And no non-matching categories should be displayed
    When the user resets or clears the filter
    Then all categories should be displayed

  @TC_DASHBOARD_UI_USER_004 @sorting @positive
  Scenario: TC_DASHBOARD_UI_USER_004 - Verify the functionality of sorting by ID
    Then the ID column should be visible and clickable
    When the user clicks on the ID column header
    Then the categories should be sorted in ascending order of ID
    When the user clicks on the ID column header again
    Then the categories should be sorted in descending order of ID
    When the user resets the page
    Then the default order should be restored

  @TC_DASHBOARD_UI_USER_005 @sorting @positive
  Scenario: TC_DASHBOARD_UI_USER_005 - Verify the functionality of sorting by Name
    Then the Name column should be visible and clickable
    When the user clicks on the Name column header
    Then the categories should be sorted in ascending alphabetical order
    When the user clicks on the Name column header again
    Then the categories should be sorted in descending alphabetical order
    When the user resets the page
    Then the default order should be restored

  @TC_DASHBOARD_UI_USER_006 @sorting @positive
  Scenario: TC_DASHBOARD_UI_USER_006 - Verify the functionality of sorting by Parent category
    Then the Parent column should be visible and clickable
    When the user clicks on the Parent column header
    Then the categories should be sorted by parent category
    When the user clicks on the Parent column header again
    Then the categories should be sorted in reverse order by parent category
    When the user resets the page
    Then the default order should be restored
