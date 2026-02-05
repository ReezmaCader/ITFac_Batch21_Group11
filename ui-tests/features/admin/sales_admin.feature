@admin @sales
Feature: Sales Module - Admin Tests
  As an admin user
  I want to manage sales
  So that I can create, view, and delete sales records

  Background:
    Given the admin is logged in to the system
    And the admin navigates to the Sales page

  @TC_Sales_UI_Admin_006
  Scenario: Verify the functionality of navigating to the Sell Plant page
    Then the system should allow the admin to click on Sell Plant
    And the system should redirect to the Sell Plant page

  @TC_Sales_UI_Admin_007
  Scenario: Verify the functionality of mandatory field validation on Sell Plant page
    When the admin navigates to Sell Plant page
    And the admin leaves fields empty and clicks Sell
    Then the system should show validation for plant selection
    And the system should display "Value must be greater than or equal to 1."

  @TC_Sales_UI_Admin_008
  Scenario: Verify the functionality of the Plant dropdown displaying current stock
    When the admin navigates to Sell Plant page
    And the admin clicks on Plant dropdown
    Then the system should display a list of available plants
    And the system should display current stock for each plant

  @TC_Sales_UI_Admin_009
  Scenario: Verify the functionality of the delete confirmation prompt
    When the admin clicks on Delete for a sale record
    Then the system should display a confirmation prompt before deletion

  @TC_Sales_UI_Admin_010
  Scenario: Verify the functionality of recording a sale successfully
    When the admin navigates to Sell Plant page
    And the admin selects a Plant
    And the admin enters Quantity "2"
    And the admin clicks on Sell
    Then the system should reduce the stock
    And the system should redirect to the sales list
