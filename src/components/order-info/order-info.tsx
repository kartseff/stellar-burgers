import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useSelector } from '../../services/store';
import { selectIngredients } from '../../services/slices/ingredientSlice';
import { selectFeed } from '../../services/slices/feedSlice';
import {
  selectOrderData,
  selectOrderModalData
} from '../../services/slices/orderSlice';
import { useParams } from 'react-router-dom';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const orderModalData = useSelector(selectOrderModalData);
  const feedData = useSelector(selectFeed);
  const userOrders = useSelector(selectOrderData);
  const ingredients = useSelector(selectIngredients);

  let orderData = orderModalData;

  if (!orderData && number) {
    const orderNumber = Number(number);

    orderData =
      feedData?.orders.find((order) => order.number === orderNumber) || null;

    if (!orderData) {
      orderData =
        userOrders.find((order) => order.number === orderNumber) || null;
    }
  }

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
