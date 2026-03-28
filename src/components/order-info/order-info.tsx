import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { selectIngredients } from '../../services/slices/ingredientSlice/ingredientSlice';
import { selectFeed } from '../../services/slices/feedSlice/feedSlice';
import {
  fetchOrderByNumber,
  selectCurrentOrder,
  selectOrderData
} from '../../services/slices/orderSlice/orderSlice';
import { useParams } from 'react-router-dom';
import styles from '../ui/order-info/order-info.module.css';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  const feedData = useSelector(selectFeed);
  const userOrders = useSelector(selectOrderData);
  const currentOrder = useSelector(selectCurrentOrder);
  const ingredients = useSelector(selectIngredients);

  const orderNumber = Number(number);

  const orderData =
    feedData?.orders.find((order) => order.number === orderNumber) ||
    userOrders.find((order) => order.number === orderNumber) ||
    currentOrder;

  useEffect(() => {
    if (number && !orderData) {
      dispatch(fetchOrderByNumber(orderNumber));
    }
  }, [dispatch, number, orderData, orderNumber]);

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

  return (
    <>
      <p className={`text text_type_digits-default mb-10 ${styles.number}`}>
        #{number}
      </p>
      <OrderInfoUI orderInfo={orderInfo} />
    </>
  );
};
