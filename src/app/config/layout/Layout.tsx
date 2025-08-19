import { useEffect } from 'react';
import { Suspense } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { paths } from '../../../shared/constants/constants';
import { useAuth } from '../../../shared/hooks/useAuth';

export const Layout = () => {
  const { isAuth, user, isLoadingUser, fetchUserData, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuth && !user) {
      fetchUserData();
    }
  }, [isAuth, user, fetchUserData]);

  const handleLogout = () => {
    logout();
    navigate(paths.loginPage);
  };

  return (
    <>
      <header>
        {isAuth ? (
          <>
            {isLoadingUser ? (
              <span>Loading user...</span>
            ) : (
              <span>{user?.email}</span>
            )}{' '}
            | <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to={paths.loginPage}>Login</Link> |{' '}
            <Link to={paths.registerPage}>Register</Link> |{' '}
          </>
        )}
      </header>

      <main>
        <Suspense fallback={<h1>Loading...</h1>}>
          <Outlet />
        </Suspense>
      </main>

      <footer />
    </>
  );
};
