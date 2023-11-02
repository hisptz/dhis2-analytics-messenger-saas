Feature: Testing Gateway Configuration

  Scenario: Testing if creating a new gateway configuration works
    Given an authorized user
    When navigating to homepage
    When click on Configuration tab
    Then I should be able to access the app confiuration
    When I click the Gateway link on the left pane
    Then I should be able to access the Gateway menu
    When I click the Add gateway button 
    Then I should be able to access the gateway configuration window
    When I enter the Name
    When I enter the URL
    When I enter the API Key
    When I click the Save button 
    Then I should be  able to save the new configuration
    Then I should be able to get an alert bar 


  Scenario: Testing if editing a gateway configuration works
    Given an authorized user
    When navigating to homepage
    When  click on Configuration tab
    Then I should be able to access the app confiuration
    When I click the Gateway link on the left pane
    Then I should be able to access the Gateway menu
    When I click on the three dots for actions
    Then I should be able to access the available actions
    When I click on the Edit action
    Then I should be able to edit the selected gateway
    When I edit the values of the input fields
    When I click on the update button
    Then I should be able to save the changes made
    Then I should be able to get an alert bar

  Scenario: Testing if deleting a gateway configuration works
    Given an authorized user
    When navigating to homepage
    When click on Configuration tab
    Then I should be able to access the app confiuration
    When I click the Gateway link on the left pane
    Then I should be able to access the Gateway menu
    When I click on the three dots for actions
    Then I should be able to access the available actions
    When I click on the Delete action
    Then I should get a pop up window to confirm deletion
    When I click on the Delete button 
    Then I should be able to delete the gateway configuration
    Then I should be able to get an alert bar 