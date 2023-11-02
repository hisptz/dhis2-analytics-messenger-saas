import {Given, Then, When} from "@badeball/cypress-cucumber-preprocessor";

Given(/^an authorized user$/, function () {
    cy.visit("/");
});
When(/^navigating to homepage$/, () => {
    cy.get("[data-test=\"d2-am-Configuration-tab\"]").should("be.visible");
});
When(/^I click on Push Analytics tab$/, () => {
    cy.get("[data-test=\"d2-am-Push Analytics-tab\"]").should("be.visible").click();
});

Then(/^I should be able to access the Push Analytics$/, function () {
    cy.url().should("include", "/push-analytics");
});

When(/^I click on the three dots for actions$/, () => {
    cy.get(
        "[data-test=\"dhis2-uicore-tablebody\"] > :nth-child(1) > :nth-child(5) > button "
    ).click();
});

Then(/^I should be able to access the available actions$/, () => {
    cy.get("[data-test=\"dhis2-uicore-menu\"]").should("be.visible");
});

When(/^I click on the Schedule action$/, () => {
    cy.get(
        "[data-test=\"dhis2-uicore-menu\"] > [data-test=\"dhis2-uicore-menulist\"] > :nth-child(2) "
    ).click();
});

When(/^I click on Add Schedule$/, () => {
    cy.get(".row > [data-test=\"dhis2-uicore-button\"]").should("exist").click();
});
When(/^I click on Add Predefined Schedule$/, () => {
    cy.get(".column > [data-test=\"dhis2-uicore-button\"]").should("exist").click();
});

When(/^I select a predefined time$/, () => {
    cy.get(".segmented-control > :nth-child(1)")
        .click()
        .get("[data-test=\"dhis2-uicore-select-input\"]")
        .click()
        .get("[data-value=\"0 * * * *\"]")
        .click();
});

When(/^I click on Add button$/, () => {
    cy.get(":nth-child(2) > [data-test=\"dhis2-uicore-button\"]").click();
});

Then(/^I should be able to get an alert bar$/, () => {
    cy.get("[data-test=\"dhis2-uicore-alertbar\"]").should("be.visible");
});

Then(
    /^I should be able to schedule the selected push analytics configuration$/,
    () => {
    }
);

When(/^I select a Custom of Every Day$/, () => {
    cy.get(".segmented-control > :nth-child(2)")
        .click()
        .get("[data-test=\"dhis2-uicore-select-input\"]")
        .click()
        .get("[data-value=\"day\"]")
        .click()
        .get(
            "[style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 8px; align-items: end;\"] > :nth-child(1) > [data-test=\"dhis2-uiwidgets-singleselectfield-content\"] > [data-test=\"dhis2-uicore-box\"] > [data-test=\"dhis2-uicore-singleselect\"] > .jsx-114080822 > [data-test=\"dhis2-uicore-select\"] > [data-test=\"dhis2-uicore-select-input\"]"
        )
        .click()
        .get("[data-value=\" 8\"]")
        .click()
        .get(
            ":nth-child(2) > [data-test=\"dhis2-uiwidgets-singleselectfield-content\"] > [data-test=\"dhis2-uicore-box\"] > [data-test=\"dhis2-uicore-singleselect\"] > .jsx-114080822 > [data-test=\"dhis2-uicore-select\"] > [data-test=\"dhis2-uicore-select-input\"]"
        )
        .click()
        .get("[data-value=\"30\"]")
        .click();
});
When(/^I select a Custom of Every Hour$/, () => {
    cy.get(".segmented-control > :nth-child(2)")
        .click()
        .get("[data-test=\"dhis2-uicore-select-input\"]")
        .click()
        .get("[data-value=\"hour\"]")
        .click()
        .get(
            "[style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 8px; align-items: end;\"] > [data-test=\"dhis2-uiwidgets-singleselectfield\"] > [data-test=\"dhis2-uiwidgets-singleselectfield-content\"] > [data-test=\"dhis2-uicore-box\"] > [data-test=\"dhis2-uicore-singleselect\"] > .jsx-114080822 > [data-test=\"dhis2-uicore-select\"] > [data-test=\"dhis2-uicore-select-input\"]"
        )
        .click()
        .get("[data-value=\"40\"]")
        .click();
});
When(/^I select a Custom of Every Week$/, () => {
    cy.get(".segmented-control > :nth-child(2)")
        .click()
        .get("[data-test=\"dhis2-uicore-select-input\"]")
        .click()
        .get("[data-value=\"week\"]")
        .click()
        .get(
            "[data-test=\"dhis2-uicore-multiselect\"] > .jsx-114080822 > [data-test=\"dhis2-uicore-select\"] > [data-test=\"dhis2-uicore-select-input\"]"
        )
        .click()
        .get("[data-value=\"thu\"] > [data-test=\"dhis2-uicore-checkbox\"]")
        .click()
        .get("body")
        .click()
        .get(
            ":nth-child(2) > [data-test=\"dhis2-uiwidgets-singleselectfield-content\"] > [data-test=\"dhis2-uicore-box\"] > [data-test=\"dhis2-uicore-singleselect\"] > .jsx-114080822 > [data-test=\"dhis2-uicore-select\"] > [data-test=\"dhis2-uicore-select-input\"]"
        )
        .click()
        .get("[data-value=\" 6\"]")
        .click()
        .get(
            ":nth-child(3) > [data-test=\"dhis2-uiwidgets-singleselectfield-content\"] > [data-test=\"dhis2-uicore-box\"] > [data-test=\"dhis2-uicore-singleselect\"] > .jsx-114080822 > [data-test=\"dhis2-uicore-select\"] > [data-test=\"dhis2-uicore-select-input\"]"
        )
        .click()
        .get("[data-value=\"40\"]")
        .click();
});
When(/^I select a Custom of Every Month$/, () => {
    cy.get(".segmented-control > :nth-child(2)")
        .click()
        .get("[data-test=\"dhis2-uicore-select-input\"]")
        .click()
        .get("[data-value=\"month\"]")
        .click()
        .get(
            "[style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 8px; align-items: end;\"] > :nth-child(1) > [data-test=\"dhis2-uiwidgets-singleselectfield-content\"] > [data-test=\"dhis2-uicore-box\"] > [data-test=\"dhis2-uicore-singleselect\"] > .jsx-114080822 > [data-test=\"dhis2-uicore-select\"] > [data-test=\"dhis2-uicore-select-input\"]"
        )
        .click()
        .get("[data-value=\"21\"]")
        .click()
        .get(
            ":nth-child(2) > [data-test=\"dhis2-uiwidgets-singleselectfield-content\"] > [data-test=\"dhis2-uicore-box\"] > [data-test=\"dhis2-uicore-singleselect\"] > .jsx-114080822 > [data-test=\"dhis2-uicore-select\"] > [data-test=\"dhis2-uicore-select-input\"]"
        )
        .click()
        .get("[data-value=\"10\"]")
        .click()
        .get(
            ":nth-child(3) > [data-test=\"dhis2-uiwidgets-singleselectfield-content\"] > [data-test=\"dhis2-uicore-box\"] > [data-test=\"dhis2-uicore-singleselect\"] > .jsx-114080822 > [data-test=\"dhis2-uicore-select\"] > [data-test=\"dhis2-uicore-select-input\"]"
        )
        .click()
        .get("[data-value=\"42\"]")
        .click();
});

When(/^I select a Custom of Every Year$/, () => {
    cy.get(".segmented-control > :nth-child(2)")
        .click()
        .get("[data-test=\"dhis2-uicore-select-input\"]")
        .click()
        .get("[data-value=\"year\"]")
        .click()
        .get(
            "[data-test=\"dhis2-uicore-multiselect\"] > .jsx-114080822 > [data-test=\"dhis2-uicore-select\"] > [data-test=\"dhis2-uicore-select-input\"]"
        )
        .click()
        .get("[data-value=\"jul\"] > [data-test=\"dhis2-uicore-checkbox\"]")
        .click()

        .get("body")
        .click()
        .get(
            ":nth-child(2) > [data-test=\"dhis2-uiwidgets-singleselectfield-content\"] > [data-test=\"dhis2-uicore-box\"] > [data-test=\"dhis2-uicore-singleselect\"] > .jsx-114080822 > [data-test=\"dhis2-uicore-select\"] > [data-test=\"dhis2-uicore-select-input\"]"
        )
        .click()
        .get("[data-value=\"27\"]")
        .click()
        .get(
            ":nth-child(3) > [data-test=\"dhis2-uiwidgets-singleselectfield-content\"] > [data-test=\"dhis2-uicore-box\"] > [data-test=\"dhis2-uicore-singleselect\"] > .jsx-114080822 > [data-test=\"dhis2-uicore-select\"] > [data-test=\"dhis2-uicore-select-input\"]"
        )
        .click()
        .get("[data-value=\" 5\"]")
        .click()
        .get(
            ":nth-child(4) > [data-test=\"dhis2-uiwidgets-singleselectfield-content\"] > [data-test=\"dhis2-uicore-box\"] > [data-test=\"dhis2-uicore-singleselect\"] > .jsx-114080822 > [data-test=\"dhis2-uicore-select\"] > [data-test=\"dhis2-uicore-select-input\"]"
        )
        .click()
        .get("[data-value=\"34\"]")
        .click();
});

When(/^I select a Cron$/, () => {
    cy.get(".segmented-control > :nth-child(3)")
        .click()
        .get("[data-test=\"dhis2-uicore-input\"] > .jsx-3353877153")
        .type("0 2 * * 1-5");
});

When(/^I click on Delete Icon$/, () => {
    cy.get(
        "[data-test=\"dhis2-uicore-modalcontent\"]>>table>tbody>:nth-child(1)>>>"
    ).click();
});

Then(/^I should get a pop up window to confirm deletion$/, () => {
    cy.get("[data-test=\"dhis2-uicore-card\"]").should("be.visible");
});

When(/^I click on the Delete button$/, () => {
    cy.get(":nth-child(3) > [data-test=\"dhis2-uicore-button\"]")
        .should("be.visible")
        .click();
});
