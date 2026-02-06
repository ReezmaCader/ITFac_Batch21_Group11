Feature: Plant Management UI
  Tests are based on TestCaseDocument__11__v0.1.pdf

  @TC_Plant_Management_UI_User_001
  Scenario: User can view plant list after login
    Given a plant exists in the system
    And I am logged in as user
    When I navigate to the "plants" page
    Then I should see the "plants" page heading
    And the Plants search input should be visible
    And the category filter should be visible
    And the Edit and Delete actions should not be visible

  @TC_Plant_Management_UI_User_002
  Scenario: User can search for an existing plant name
    Given a plant named "AutoPlant-Search" exists in the system
    And I am logged in as user
    When I navigate to the "plants" page
    And I search for the plant name "AutoPlant-Search"
    Then the plant should appear in results with name "AutoPlant-Search"

  @TC_Plant_Management_UI_User_003
  Scenario: User search for a non-existing plant returns no results
    Given I am logged in as user
    When I navigate to the "plants" page
    And I search for the plant name "NoSuchPlant-XYZ"
    Then no plant results should be shown

  @TC_Plant_Management_UI_User_004
  Scenario: User can filter plants by category
    Given plants exist in multiple categories
    And I am logged in as user
    When I navigate to the "plants" page
    And I filter plants by category
    Then all listed plants should belong to the selected category

  @TC_Plant_Management_UI_User_005
  Scenario: User can sort plants by price
    Given plants exist in multiple categories
    And I am logged in as user
    When I navigate to the "plants" page
    And I sort plants by price
    Then plant prices should be sorted

  @TC_Plant_Management_UI_Admin_006
  Scenario: Admin sees Add Plant button
    Given a plant exists in the system
    And I am logged in as admin
    When I navigate to the "plants" page
    Then I should see the Add Plant button

  @TC_Plant_Management_UI_Admin_007
  Scenario: Admin sees Edit button
    Given a plant exists in the system
    And I am logged in as admin
    When I navigate to the "plants" page
    Then the Edit button should be visible for plants

  @TC_Plant_Management_UI_Admin_008
  Scenario: Admin sees Delete button
    Given a plant exists in the system
    And I am logged in as admin
    When I navigate to the "plants" page
    Then the Delete button should be visible for plants

  @TC_Plant_Management_UI_Admin_009
  Scenario: Admin can delete a plant from the list
    Given a plant named "AutoPlant-Delete" exists in the system
    And I am logged in as admin
    When I navigate to the "plants" page
    And I delete the plant from the list
    Then the plant should be removed from the list

  @TC_Plant_Management_UI_Admin_010
  Scenario: Admin can cancel Add Plant
    Given I am logged in as admin
    When I navigate to the "plants" page
    And I open the Add Plant form
    And I click Cancel on the Add Plant form
    Then I should be back on the plant list page
