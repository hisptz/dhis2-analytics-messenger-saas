Feature: Testing Configuring Push Analytics

  Scenario: Testing if configuring a new push analytics group works
    Given an authorized user
    When navigating to homepage
    When I click on Push Analytics tab
    Then I should be able to access the Push Analytics
    When I click the Add push analytics configuration button 
    Then I should be able to access the Send Push Analytics window
    When I enter the Name for the push analytics
    When I select a gateway from the dropdown list on the Gateway field
    When I select a visualization group from the dropdown list on the Visualization group field
    Then From the Visualization field I choose one or more visualizations that need to be sent to specific user, groups or phone number
    When I enter the Description for the push analytics
    Then I select atleast one recipients based on the user type either Group Type, User Type or Phone Number Type
    When I click the Save button
    Then I should be  able to save the new push analytic
    Then I should be able to get an alert bar


  Scenario: Testing if editing a push analytic configuration works
 Given an authorized user
    When navigating to homepage
    When I click on Push Analytics tab
    Then I should be able to access the Push Analytics
    When I click on the three dots for actions
    Then I should be able to access the available actions
    When I click on the Edit action
    Then I should be able to edit the selected push analytics configuration 
    When I edit the name
    When I change the Gateway selection
    When I change the Visualization group selection
    When I change the selected visualizations selection
    When I edit the description
    When I change the selected recipients
    When I click on the update button
    Then I should be able to save the changes made
    Then I should be able to get an alert bar

  Scenario: Testing if sending a push analytic configuration works
   Given an authorized user
    When navigating to homepage
    When I click on Push Analytics tab
    Then I should be able to access the Push Analytics
    When I click on the three dots for actions
    Then I should be able to access the available actions
    When I click on the Send action
    When I click on the Send button
    Then I should be able to send the selected push analytics configuration 
    Then I should be able to get an alert bar 

  Scenario: Testing if deleting a push analytic configuration works
   Given an authorized user
    When navigating to homepage
    When I click on Push Analytics tab
    Then I should be able to access the Push Analytics
    When I click on the three dots for actions
    Then I should be able to access the available actions
    When I click on the Delete action
    Then I should get a pop up window to confirm deletion
    When I click on the Delete button 
    Then I should be able to delete the push analytic configuration
    Then I should be able to get an alert bar 