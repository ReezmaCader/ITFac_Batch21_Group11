Feature: Plant Viewing - User

  @ui
  Scenario: TC_PlantView_UI_User_001 View plant list as User
    Given the user is logged in as User
    When the user navigates to the plant list page
    Then the plant list should be displayed
