import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor"

Given(/^an authorized user$/, function () {
  cy.visit("/")
})
When(/^navigating to homepage$/, () => {
  cy.get('[data-test="d2-am-Configuration-tab"]').should("be.visible")
})
When(/^click on Configuration tab$/, () => {
  cy.get('[data-test="d2-am-Configuration-tab"]').should("be.visible").click()
})

Then(/^I should be able to access the app confiuration$/, function () {
  cy.url().should("include", "/configuration/gateway")
})

When(/^I click the Gateway link on the left pane$/, () => {
  cy.get('[data-test="Gateway-menu"] > a.jsx-2002348738 > .jsx-2002348738')
    .should("be.visible")
    .click()
})
Then(/^I should be able to access the Gateway menu$/, () => {
  cy.url().should("include", "/configuration/gateway")
})

When(/^I click the Add gateway button$/, () => {
  cy.get('[data-test="dhis2-uicore-button"]').should("be.visible").click()
})
Then(/^I should be able to access the gateway configuration window$/, () => {
  cy.get('[data-test="dhis2-uicore-card"]').should("be.visible")
})

When(/^I enter the Name$/, () => {
  cy.get(
    ':nth-child(1) > [data-test="dhis2-uiwidgets-inputfield-content"] > [data-test="dhis2-uicore-box"] > [data-test="dhis2-uicore-input"]'
  )
    .should("be.visible")
    .type("Test Gateway")
})

When(/^I enter the URL$/, () => {
  cy.get(
    ':nth-child(2) > [data-test="dhis2-uiwidgets-inputfield-content"] > [data-test="dhis2-uicore-box"] > [data-test="dhis2-uicore-input"]'
  )
    .should("be.visible")
    .type("https://test.gateway.com/config/api")
})

When(/^I enter the API Key$/, () => {
  cy.get(
    ':nth-child(3) > [data-test="dhis2-uiwidgets-inputfield-content"] > [data-test="dhis2-uicore-box"] > [data-test="dhis2-uicore-input"]'
  )
    .should("be.visible")
    .type("7aef99a9-8fb4-4fc3-a878-735b58ef962c")
})

When(/^I click the Save button$/, () => {
  cy.get(':nth-child(2) > [data-test="dhis2-uicore-button"]')
    .should("be.visible")
    .click()
})

Then(/^I should be  able to save the new configuration$/, () => {})
Then(/^I should be able to get an alert bar$/, () => {
  cy.get('[data-test="dhis2-uicore-alertbar"]').should("be.visible")
})

When(/^I click on the three dots for actions$/, () => {
  cy.get(
    '[data-test="dhis2-uicore-tablebody"] > :nth-child(1) > :nth-child(4) > button'
  ).click()
})

Then(/^I should be able to access the available actions$/, () => {
  cy.get('[data-test="dhis2-uicore-menu"]').should("be.visible")
})

When(/^I click on the Edit action$/, () => {
  cy.get(
    '[data-test="dhis2-uicore-menu"] > [data-test="dhis2-uicore-menulist"] > :nth-child(1) '
  ).click()
})

Then(/^I should be able to edit the selected gateway$/, () => {
  cy.get('[data-test="dhis2-uicore-card"]').should("be.visible")
})

When(/^I edit the values of the input fields$/, () => {
  cy.get(
    ':nth-child(1) > [data-test="dhis2-uiwidgets-inputfield-content"] > [data-test="dhis2-uicore-box"] > [data-test="dhis2-uicore-input"] > .jsx-3353877153'
  )
    .should("exist")
    .clear()
    .type("UpdatedName")

  cy.get(
    ':nth-child(2) > [data-test="dhis2-uiwidgets-inputfield-content"] > [data-test="dhis2-uicore-box"] > [data-test="dhis2-uicore-input"] > .jsx-3353877153'
  )
    .should("exist")
    .clear()
    .type("UpdatedURL")

  cy.get(
    ':nth-child(3) > [data-test="dhis2-uiwidgets-inputfield-content"] > [data-test="dhis2-uicore-box"] > [data-test="dhis2-uicore-input"] > .jsx-3353877153'
  )
    .should("exist")
    .clear()
    .type("UpdatedAPIKey")

  cy.get(
    ':nth-child(1) > [data-test="dhis2-uiwidgets-inputfield-content"] > [data-test="dhis2-uicore-box"] > [data-test="dhis2-uicore-input"] > .jsx-3353877153'
  ).should("have.value", "UpdatedName")
  cy.get(
    ':nth-child(2) > [data-test="dhis2-uiwidgets-inputfield-content"] > [data-test="dhis2-uicore-box"] > [data-test="dhis2-uicore-input"] > .jsx-3353877153'
  ).should("have.value", "UpdatedURL")
  cy.get(
    ':nth-child(3) > [data-test="dhis2-uiwidgets-inputfield-content"] > [data-test="dhis2-uicore-box"] > [data-test="dhis2-uicore-input"] > .jsx-3353877153'
  ).should("have.value", "UpdatedAPIKey")
})

When(/^I click on the update button$/, () => {
  cy.get(':nth-child(2) > [data-test="dhis2-uicore-button"]').click()
})

When(/^I should be able to save the changes made$/, () => {})

When(/^I click on the Delete action$/, () => {
  cy.get(
    '[data-test="dhis2-uicore-menu"] > [data-test="dhis2-uicore-menulist"] > :nth-child(2)'
  ).click()
})

Then(/^I should get a pop up window to confirm deletion$/, () => {
  cy.get('[data-test="dhis2-uicore-card"]').should("be.visible")
})

When(/^I click on the Delete button$/, () => {
  cy.get(':nth-child(3) > [data-test="dhis2-uicore-button"]')
    .should("be.visible")
    .click()
})

Then(/^I should be able to delete the gateway configuration$/, () => {})
