import { Navigate } from 'react-router-dom';
import { selectUser, selectIsLoading } from '../services/slices/userSlice';
import { useSelector } from '../services/store';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  children: React.ReactElement;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isLoding = useSelector(selectIsLoading);
  const user = useSelector(selectUser);

  if (isLoding) {
    return <Preloader />;
  }

  if (!user) {
    return <Navigate replace to='/login' />;
  }

  return children;
};
