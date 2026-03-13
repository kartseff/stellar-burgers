import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';
import { selectIngredients } from '../../services/slices/ingredientSlice';

export const IngredientDetails: FC = () => {
  const ingredients = useSelector(selectIngredients);
  const { id } = useParams<{ id: string }>();

  if (!ingredients.length) {
    return <Preloader />;
  }

  const ingredientData = ingredients.find((item) => item._id === id);

  if (!ingredientData) {
    return <Preloader />;
  }

  return (
    <>
      <h2 className='text text_type_main-large mt-10 mb-5'>
        Детали ингредиента
      </h2>
      <IngredientDetailsUI ingredientData={ingredientData} />
    </>
  );
};
