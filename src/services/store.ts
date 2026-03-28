import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { ingredientReducer } from './slices/ingredientSlice/ingredientSlice';
import { orderReducer } from './slices/orderSlice/orderSlice';
import { userReducer } from './slices/userSlice/userSlice';
import { feedReducer } from './slices/feedSlice/feedSlice';
import { constructorReducer } from './slices/constructorSlice/constructorSlice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

export const rootReducer = combineReducers({
  ingredients: ingredientReducer,
  order: orderReducer,
  user: userReducer,
  feed: feedReducer,
  burgerConstructor: constructorReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;
export default store;
