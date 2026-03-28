import { Navigate, useLocation } from 'react-router-dom';
import {
  selectUser,
  selectIsLoading
} from '../services/slices/userSlice/userSlice';
import { useSelector } from '../services/store';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: ProtectedRouteProps) => {
  const isLoding = useSelector(selectIsLoading);
  const user = useSelector(selectUser);
  const location = useLocation();

  if (isLoding) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  return children;
};
