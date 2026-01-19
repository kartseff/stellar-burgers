import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';
import {
  fetchIngredients,
  selectIngredients
} from '../../services/slices/ingredientSlice';
import { useDispatch } from '../../services/store';

export const IngredientDetails: FC = () => {
  const dispatch = useDispatch();
  const ingredients = useSelector(selectIngredients);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (!ingredients.length) {
      dispatch(fetchIngredients());
    }
  }, [dispatch]);

  const ingredientData = ingredients.find((item) => item._id === id);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
