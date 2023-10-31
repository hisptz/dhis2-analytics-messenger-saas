Feature: Testing Scheduling Push Analytics

  Scenario: Testing if scheduling using a Predefined setting works
    Given an authorized user
    When navigating to homepage
    When I click on Push Analytics tab
    Then I should be able to access the Push Analytics
    When I click on the three dots for actions
    Then I should be able to access the available actions
    When I click on the Schedule action
    When I click on Add Schedule
#    When I click on Add Predefined Schedule
    When I select a predefined time
    When I click on Add button
    Then I should be able to schedule the selected push analytics configuration
    Then I should be able to get an alert bar


  Scenario: Testing if scheduling using a Custom Every Day setting works
    Given an authorized user
    When navigating to homepage
    When I click on Push Analytics tab
    Then I should be able to access the Push Analytics
    When I click on the three dots for actions
    Then I should be able to access the available actions
    When I click on the Schedule action
    When I click on Add Schedule
    When I select a Custom of Every Day
    When I click on Add button
    Then I should be able to schedule the selected push analytics configuration
    Then I should be able to get an alert bar

  Scenario: Testing if scheduling using a Custom Every Hour setting works
    Given an authorized user
    When navigating to homepage
    When I click on Push Analytics tab
    Then I should be able to access the Push Analytics
    When I click on the three dots for actions
    Then I should be able to access the available actions
    When I click on the Schedule action
    When I click on Add Schedule
    When I select a Custom of Every Hour
    When I click on Add button
    Then I should be able to schedule the selected push analytics configuration
    Then I should be able to get an alert bar

  Scenario: Testing if scheduling using a Custom Every Week setting works
    Given an authorized user
    When navigating to homepage
    When I click on Push Analytics tab
    Then I should be able to access the Push Analytics
    When I click on the three dots for actions
    Then I should be able to access the available actions
    When I click on the Schedule action
    When I click on Add Schedule
    When I select a Custom of Every Week
    When I click on Add button
    Then I should be able to schedule the selected push analytics configuration
    Then I should be able to get an alert bar

  Scenario: Testing if scheduling using a Custom Every Month setting works
    Given an authorized user
    When navigating to homepage
    When I click on Push Analytics tab
    Then I should be able to access the Push Analytics
    When I click on the three dots for actions
    Then I should be able to access the available actions
    When I click on the Schedule action
    When I click on Add Schedule
    When I select a Custom of Every Month
    When I click on Add button
    Then I should be able to schedule the selected push analytics configuration
    Then I should be able to get an alert bar

  Scenario: Testing if scheduling using a Custom Every Year setting works
    Given an authorized user
    When navigating to homepage
    When I click on Push Analytics tab
    Then I should be able to access the Push Analytics
    When I click on the three dots for actions
    Then I should be able to access the available actions
    When I click on the Schedule action
    When I click on Add Schedule
    When I select a Custom of Every Year
    When I click on Add button
    Then I should be able to schedule the selected push analytics configuration
    Then I should be able to get an alert bar


  Scenario: Testing if scheduling using a Cron setting works
    Given an authorized user
    When navigating to homepage
    When I click on Push Analytics tab
    Then I should be able to access the Push Analytics
    When I click on the three dots for actions
    Then I should be able to access the available actions
    When I click on the Schedule action
    When I click on Add Schedule
    When I select a Cron
    When I click on Add button
    Then I should be able to schedule the selected push analytics configuration
    Then I should be able to get an alert bar

  Scenario: Testing if deleting a schedule works
    Given an authorized user
    When navigating to homepage
    When I click on Push Analytics tab
    Then I should be able to access the Push Analytics
    When I click on the three dots for actions
    Then I should be able to access the available actions
    When I click on the Schedule action
    When I click on Delete Icon
    Then I should get a pop up window to confirm deletion
    When I click on the Delete button
    Then I should be able to schedule the selected push analytics configuration
    # Then I should be able to get an alert bar
