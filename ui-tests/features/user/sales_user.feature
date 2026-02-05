@user @sales
Feature: Sales Module - User Tests
  As a regular user
  I want to view the sales list
  So that I can see sales records without admin privileges

  Background:
    Given the user is logged in to the system
    And the user navigates to the Sales page

  @TC_Sales_UI_User_001
  Scenario: Verify the functionality of the Sales List page displaying records correctly
    Then the system should allow to click on Sales
    And the system should display records with Plant name, Quantity, Total price, and Sold date

  @TC_Sales_UI_User_002
  Scenario: Verify the functionality of the default sorting by sold date
    Then the system should allow to click on Sales
    And the system should display records sorted by sold date descending by default

  @TC_Sales_UI_User_003
  Scenario: Verify the functionality of the "Sell Plant" button being hidden for User
    Then the system should allow to click on Sales
    And the system should hide the "Sell Plant" button for User role

  @TC_Sales_UI_User_004
  Scenario: Verify the functionality of the "Delete" action being hidden for User
    Then the system should allow to click on Sales
    And the system should hide the "Delete" action for User role

  @TC_Sales_UI_User_005
  Scenario: Verify the functionality of displaying an appropriate message when no sales exist
    Then the system should allow to click on Sales
    And the system should display a message as "No sales found" when no records exist
