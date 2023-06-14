/// <reference types="cypress" />

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress

describe('TBD App', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:5173/');
  });

  it('Should have header and searchEntries should default to hidden', () => {
    cy.get('header').should('have.length', 1);
    cy.get('.searchEntries').should('have.css', 'display', 'none');
    // cy.get('.searchEntries').should('not.be.visible');
  });
});
