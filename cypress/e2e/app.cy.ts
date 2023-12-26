describe("Navigation", () => {
  it("should navigate to the about page", () => {
    cy.visit("/");

    cy.get("h1").contains("Problems");
  });
});
