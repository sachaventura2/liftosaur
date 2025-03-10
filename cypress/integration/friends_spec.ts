import { clearAll, g, login } from "../support/utils";

describe("Friends", () => {
  beforeEach(() => {
    clearAll();
  });

  it("works", () => {
    // TEST 1
    login("test1@example.com");

    g("footer-settings").click();
    g("menu-item-friends").click();
    cy.contains("You have no friends yet").should("exist");

    cy.contains("Add Friend").click();
    g("add-friend-filter").clear().type("test");

    g("menu-item-test2").find("[data-cy=button-friend-add]").click();
    g("modal-add-friend-input").clear().type("Hi!");
    g("modal-add-friend-invite").click();

    g("menu-item-test2").should("contain.text", "Invited");

    // TEST 2
    login("test2@example.com");

    g("footer-settings").click();
    g("menu-item-friends").click();
    g("menu-item-test1").find("[data-cy=button-friend-accept-invitation]").click();
    g("menu-item-test1").should("contain.text", "Added");

    cy.contains("Back").click();
    cy.contains("Back").click();
    g("menu-item-strong-curves-week-1-4").click();

    cy.get(".history-record-test1", { timeout: 10000 }).eq(0).click();
    cy.get("[data-cy^=exercise-]:contains('Overhead Press')").should("exist");
    cy.get("[data-cy^=exercise-]:contains('Deadlift')").should("exist");
    cy.get("[data-cy^=exercise-]:contains('Bent Over Row')").should("exist");

    cy.contains("Back").click();

    g("history-record").eq(1).should("contain.text", "test1");
    g("history-record").eq(2).should("not.contain.text", "test1");
    g("history-record").eq(3).should("contain.text", "test1");
    g("history-record").eq(4).should("not.contain.text", "test1");

    g("like").eq(0).click();
    cy.get(".history-record-test1").eq(0).click();
    g("like").eq(0).should("have.class", "liked");
    g("new-comment-input").clear().type("Hi there!");
    g("new-comment-submit").click();

    // TEST 1
    login("test1@example.com");
    g("menu-item-gzclp").click();
    cy.get("[data-cy=history-record]:eq(1) [data-cy=like]").should("have.class", "liked");
    cy.get("[data-cy=history-record]:eq(1) [data-cy=like]").click();
    cy.get("[data-cy=history-record]:eq(1) [data-cy=like]").should("have.class", "liked");
    g("history-record").eq(1).click();
    g("like").should("have.class", "liked");
    g("like").click();
    g("like").should("have.class", "liked");
    g("comment-user").should("contain.text", "test2");
    g("comment-text").should("contain.text", "Hi there!");
    g("comment-delete").should("not.exist");

    // TEST 2
    login("test2@example.com");
    g("menu-item-strong-curves-week-1-4").click();
    cy.get(".history-record-test1", { timeout: 10000 }).eq(0).click();
    g("comment-user").should("contain.text", "test2");
    g("comment-text").should("contain.text", "Hi there!");
    g("comment-delete").click();
    g("comment-text").should("not.exist");
    g("like").click();

    g("footer-settings").click();
    g("menu-item-friends").click();
    g("button-friend-remove").click();

    cy.contains("You have no friends yet").should("exist");
  });
});
