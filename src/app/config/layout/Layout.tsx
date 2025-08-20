import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../../../widgets/header';

export const Layout = () => {
  return (
    <>
      <Header />
      <main>
        <Suspense fallback={<h1>Loading...</h1>}>
          <Outlet />
        </Suspense>
      </main>
      <footer />
    </>
  );
};
