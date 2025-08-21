import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../../../widgets/header';
import Loading from '../../../shared/ui/loading/view/Loading';
import { Footer } from '../../../widgets/footer';

export const Layout = () => {
  return (
    <>
      <Header />
      <main>
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </>
  );
};
