import { rootReducer } from './store';

describe('rootReducer test', () => {
  it('должен возвращать начальное состояние приложения', () => {
    const newState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(newState).toEqual({
      user: {
        user: null,
        isAuth: false,
        isLoading: true,
        error: undefined
      },
      burgerConstructor: {
        bun: null,
        ingredients: []
      },
      ingredients: {
        ingredients: [],
        isLoading: true,
        error: null
      },
      feed: {
        data: null,
        isLoading: true,
        error: null
      },
      order: {
        order: [],
        isLoading: true,
        error: null,
        currentOrder: null,
        orderRequest: false,
        orderModalData: null
      }
    });
  });
});
