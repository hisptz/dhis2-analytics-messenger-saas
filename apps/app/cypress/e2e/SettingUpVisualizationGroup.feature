Feature: Testing Visualization groups

  Scenario: Testing if creating a new visualization group works
    Given an authorized user
    When navigating to homepage
    When click on Configuration tab
    Then I should be able to access the app confiuration
    When I click the Visualization Groups link on the left pane
    Then I should be able to access the Visualization Groups menu
    When I click the Add visualization group button 
    Then I should be able to access the Add group window
    When I enter the Name for the visualization group
    When I search for appropriate visualization in the search bar
    Then Matching visualizations should appear in the list below
    When I select one or more visualizations
    When I click the side arrow to move items to left 
    Then I should be able to see the visualizations that are going to be saved in the group
    When I click the Save button
    Then I should be  able to save the new Visualization Group
    Then I should be able to get an alert bar



  Scenario: Testing if editing a visualization group works
    Given an authorized user
    When navigating to homepage
    When click on Configuration tab
    Then I should be able to access the app confiuration
    When I click the Visualization Groups link on the left pane
    Then I should be able to access the Visualization Groups menu
    When I click on the three dots for actions
    Then I should be able to access the available actions
    When I click on the Edit action
    Then I should be able to edit the selected visualization group 
    When I edit the name of the visualization group
    When I change the selection of visualization by removing and adding
    When I click on the update button
    Then I should be able to save the changes made
    Then I should be able to get an alert bar

  Scenario: Testing if deleting a visualization group works
      Given an authorized user
    When navigating to homepage
    When click on Configuration tab
    Then I should be able to access the app confiuration
    When I click the Visualization Groups link on the left pane
    Then I should be able to access the Visualization Groups menu
    When I click on the three dots for actions
    Then I should be able to access the available actions
    When I click on the Delete action
    Then I should get a pop up window to confirm deletion
    When I click on the Delete button 
    Then I should be able to delete the visualization group
    Then I should be able to get an alert bar 