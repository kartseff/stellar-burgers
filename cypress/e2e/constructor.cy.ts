const selectors = {
  ingredientCard: '[data-cy="ingredient-card"]',
  constructorBunTop: '[data-cy="burger-constructor-bun-top"]',
  constructorBunBottom: '[data-cy="burger-constructor-bun-bottom"]',
  constructorFillings: '[data-cy="burger-constructor-fillings"]',
  placeOrderButton: '[data-cy="place-order-button"]',
  modal: '[data-cy="app-modal"]',
  modalCloseButton: '[data-cy="app-modal-close"]',
  modalOverlay: '[data-cy="app-modal-overlay"]'
};

const testData = {
  bun: 'Краторная булка N-200i',
  filling: 'Биокотлета из марсианской Магнолии',
  sauce: 'Соус Spicy-X'
};

describe('Конструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  describe('добавление ингредиентов в конструктор', () => {
    it('в конструктор должна добавиться булка', () => {
      cy.contains(testData.bun)
        .parents(selectors.ingredientCard)
        .find('button')
        .click();

      cy.get(selectors.constructorBunTop).should('contain', testData.bun);
      cy.get(selectors.constructorBunBottom).should('contain', testData.bun);
    });

    it('в конструктор должна добавиться начинка', () => {
      cy.contains(testData.filling)
        .parents(selectors.ingredientCard)
        .find('button')
        .click();

      cy.get(selectors.constructorFillings).should('contain', testData.filling);
    });

    it('в конструктор должен добавиться соус', () => {
      cy.contains(testData.sauce)
        .parents(selectors.ingredientCard)
        .find('button')
        .click();

      cy.get(selectors.constructorFillings).should('contain', testData.sauce);
    });

    it('в конструктор должны добавиться несколько ингредиентов', () => {
      cy.contains(testData.bun)
        .parents(selectors.ingredientCard)
        .find('button')
        .click();

      cy.contains(testData.filling)
        .parents(selectors.ingredientCard)
        .find('button')
        .click();

      cy.contains(testData.sauce)
        .parents(selectors.ingredientCard)
        .find('button')
        .click();

      cy.get(selectors.constructorBunTop).should('contain', testData.bun);
      cy.get(selectors.constructorFillings).should('contain', testData.filling);
      cy.get(selectors.constructorFillings).should('contain', testData.sauce);
      cy.get(selectors.constructorBunBottom).should('contain', testData.bun);
    });
  });

  describe('работа модальных окон', () => {
    it('модальное окно ингредиента должно открыться при клике на него', () => {
      cy.contains(testData.bun).click();
      cy.get(selectors.modal).should('be.visible');
      cy.get(selectors.modal).should('contain', 'Детали ингредиента');
      cy.get(selectors.modal).should('contain', testData.bun);
    });

    it('модальное окно ингредиента должно закрыться при клике на крестик', () => {
      cy.contains(testData.bun).click();
      cy.get(selectors.modal).should('be.visible');
      cy.get(selectors.modalCloseButton).click();
      cy.get(selectors.modal).should('not.exist');
    });

    it('модальное окно ингредиента должно закрыться при клике на оверлей', () => {
      cy.contains(testData.bun).click();
      cy.get(selectors.modal).should('be.visible');
      cy.get(selectors.modalOverlay).click({ force: true });
      cy.get(selectors.modal).should('not.exist');
    });
  });

  describe('создание заказа', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/api/auth/user', {
        fixture: 'user.json'
      }).as('getUser');

      cy.intercept('POST', '**/api/orders', {
        fixture: 'order.json'
      }).as('createOrder');

      cy.window().then((win) => {
        win.localStorage.setItem('refreshToken', 'mock-refresh-token');
      });
      
      cy.setCookie('accessToken', 'mock-access-token');
      cy.reload();
      cy.wait('@getIngredients');
    });

    afterEach(() => {
      cy.window().then((win) => {
        win.localStorage.removeItem('refreshToken');
      });

      cy.clearCookies();
    });

    it('заказ должен создаться, а его номер должен быть показан в модальном окне', () => {
      cy.contains(testData.bun)
        .parents(selectors.ingredientCard)
        .find('button')
        .click();

      cy.contains(testData.filling)
        .parents(selectors.ingredientCard)
        .find('button')
        .click();

      cy.get(selectors.placeOrderButton).click();
      cy.wait('@createOrder');
      cy.get(selectors.modal).should('be.visible');
      cy.get(selectors.modal).should('contain', '12345');
      cy.get(selectors.modalCloseButton).click();
      cy.get(selectors.modal).should('not.exist');
      cy.get(selectors.constructorBunTop).should('not.exist');
      cy.get(selectors.constructorBunBottom).should('not.exist');
      cy.get(selectors.constructorFillings).should('contain', 'Выберите начинку');
    });
  });
});