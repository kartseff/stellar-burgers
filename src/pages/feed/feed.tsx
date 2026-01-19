import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getFeed, selectFeed } from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const feed = useSelector(selectFeed);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFeed());
  }, [dispatch]);

  const handleUpdate = () => {
    dispatch(getFeed());
  };

  if (!feed) {
    return <Preloader />;
  }

  return <FeedUI orders={feed.orders} handleGetFeeds={handleUpdate} />;
};
