import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '../../layout/Layout';
import { privateRouter } from '../private/privateRouter';
import { paths } from '../../../../shared/constants/constants';
import { publicRouter } from '../public/publicRouter';
import { authRouter } from '../auth/authRouter';

export const router = () =>
  createBrowserRouter([
    {
      path: paths.homePage,
      element: <Layout />,
      children: [...publicRouter, ...privateRouter],
    },
    ...authRouter,
  ]);
