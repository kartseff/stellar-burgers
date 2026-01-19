import { getOrdersApi, orderBurgerApi } from '@api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { RootState } from '../store';

type TCreateOrderResponse = {
  success: boolean;
  order: TOrder;
  name: string;
};

interface OrdersState {
  order: TOrder[];
  isLoading: boolean;
  error: string | null;

  orderRequest: boolean;
  orderModalData: TOrder | null;
}

const initialState: OrdersState = {
  order: [],
  isLoading: true,
  error: null,

  orderRequest: false,
  orderModalData: null
};

export const fetchOrders = createAsyncThunk<TOrder[]>(
  'order/getOrders',
  async () => getOrdersApi()
);

export const createOrder = createAsyncThunk<TCreateOrderResponse, string[]>(
  'order/createOrder',
  async (ingredients) => orderBurgerApi(ingredients)
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderModal: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.order = action.payload;
        state.isLoading = false;
      })

      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Error';
      });

    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.error = action.error.message ?? 'Error';
        state.orderRequest = false;
      });
  }
});

export const orderReducer = orderSlice.reducer;
export const selectOrderRequest = (state: RootState) =>
  state.order.orderRequest;
export const selectOrderModalData = (state: RootState) =>
  state.order.orderModalData;
export const selectOrderData = (state: RootState) => state.order.order;
export const { clearOrderModal } = orderSlice.actions;
