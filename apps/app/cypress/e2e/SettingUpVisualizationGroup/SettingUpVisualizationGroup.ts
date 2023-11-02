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

When(/^I click the Visualization Groups link on the left pane$/, () => {
  cy.get(
    '[data-test="Visualization groups-menu"] > a.jsx-2002348738 > .jsx-2002348738'
  )
    .should("be.visible")
    .click()
})
Then(/^I should be able to access the Visualization Groups menu$/, () => {
  cy.url().should("include", "/configuration/visualization-groups")
})

When(/^I click the Add visualization group button$/, () => {
  cy.get('[data-test="dhis2-uicore-button"]').should("be.visible").click()
})
Then(/^I should be able to access the Add group window$/, () => {
  cy.get('[data-test="dhis2-uicore-card"]').should("be.visible")
})

When(/^I enter the Name for the visualization group$/, () => {
  cy.get(
    ':nth-child(1) > [data-test="dhis2-uiwidgets-inputfield-content"] > [data-test="dhis2-uicore-box"] > [data-test="dhis2-uicore-input"]'
  )
    .should("be.visible")
    .type("Test Visualization Group")
})

When(/^I search for appropriate visualization in the search bar$/, () => {
  cy.get(
    '[data-test="dhis2-uicore-transfer-filter-input"] > .jsx-3353877153'
  ).type("RMNCAH")
})

Then(/^Matching visualizations should appear in the list below$/, () => {
  cy.get('[data-test="dhis2-uicore-transfer-leftside"] > .optionsContainer')
    .should("be.visible")
    .contains("RMNCAH")
})

When(/^I select one or more visualizations$/, () => {
  cy.get('[data-value="tS2gIIWVf6K"]').click({ shiftKey: true })
  cy.get('[data-value="epDMnD25ywG"]').click({ shiftKey: true })
  cy.get('[data-value="DAcHlw4KYPS"]').click({ shiftKey: true })
})

When(/^I click the side arrow to move items to left$/, () => {
  cy.get('[data-test="dhis2-uicore-transfer-actions-addindividual"]').click()
})

When(
  /^I should be able to see the visualizations that are going to be saved in the group$/,
  () => {
    cy.get('[data-test="dhis2-uicore-transfer-pickedoptions"]')
      .should("not.be.NaN")
      .contains("RMNCAH")
  }
)

When(/^I click the Save button$/, () => {
  cy.get(':nth-child(2) > [data-test="dhis2-uicore-button"]')
    .should("be.visible")
    .click()
})

Then(/^I should be  able to save the new Visualization Group$/, () => {})
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

Then(/^I should be able to edit the selected visualization group$/, () => {
  cy.get('[data-test="dhis2-uicore-card"]').should("be.visible")
})

When(/^I edit the name of the visualization group$/, () => {
  cy.get('[data-test="dhis2-uicore-input"] > .jsx-3353877153')
    .should("exist")
    .clear()
    .type("UpdatedName")

  cy.get('[data-test="dhis2-uicore-input"] > .jsx-3353877153').should(
    "have.value",
    "UpdatedName"
  )
})

When(/^I change the selection of visualization by removing and adding$/, () => {
  cy.get('[data-value="dxRdII7wS6j"]').click({ shiftKey: true })
  cy.get('[data-value="DAcHlw4KYPS"]').click({ shiftKey: true })
  cy.get('[data-test="dhis2-uicore-transfer-actions-removeindividual"]').click()
  cy.get('[data-value="V06KKMj8k8H"]').click({ shiftKey: true })
  cy.get('[data-value="dR0AIXF98ds"]').click({ shiftKey: true })
  cy.get('[data-test="dhis2-uicore-transfer-actions-addindividual"]').click()
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

Then(/^I should be able to delete the visualization group$/, () => {})
