import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <>
      <header />
      <main>
        <Suspense fallback={<h1>Loading</h1>}>
          <Outlet />
        </Suspense>
        <footer />
      </main>
    </>
  );
};
