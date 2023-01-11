/// <reference types="cypress" />
const fixture1 = {
  status: 'not expected',
  message: undefined,
  obj: { foo: 'not expected' },
  array: ['not', 'expected'],
}
const fixture2 = {
  status: 'expected',
  message: undefined,
  obj: { foo: 'expected' },
  array: ['expected'],
}
describe('page', () => {
  it('not working', () => {
    cy.intercept('https://dog.ceo/api/breeds/image/random', (req) => {
      req.on('response', (res) => {
        const result = Object.assign({}, res.body, fixture2);
        res.body = result
        // Object.assign(res.body, result) <----- works see below
      });
    });
    cy.intercept('https://dog.ceo/api/breeds/image/random', (req) => {
      req.on('response', (res) => {
        const result = Object.assign({}, res.body, fixture1);
        res.body = result
        // Object.assign(res.body, result) <----- works see below
      });
    });
    
    cy.visit('index.html')
    cy.get('#actual').invoke('text').should('have.length.above', 1)
    cy.get('#actual').should(($el) => {
      expect($el).have.text(Cypress.$('#expected').text())
    })
  })
  it('working', () => {
    cy.intercept('https://dog.ceo/api/breeds/image/random', (req) => {
      req.on('response', (res) => {
        const result = Object.assign({}, res.body, fixture2);
        // res.body = result <----- does not work, see above
        Object.assign(res.body, result)
      });
    });
    cy.intercept('https://dog.ceo/api/breeds/image/random', (req) => {
      req.on('response', (res) => {
        const result = Object.assign({}, res.body, fixture1);
        // res.body = result <----- does not work, see above
        Object.assign(res.body, result)
      });
    });
    
    cy.visit('index.html')
    cy.get('#actual').invoke('text').should('have.length.above', 1)
    cy.get('#actual').should(($el) => {
      expect($el).have.text(Cypress.$('#expected').text())
    })
  })
})
