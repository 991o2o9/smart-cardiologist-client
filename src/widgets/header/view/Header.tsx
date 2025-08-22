import { Link, useNavigate } from 'react-router-dom';
import { navigation, paths } from '../../../shared/constants/constants';
import styles from './Header.module.scss';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../../shared/hooks/useAuth';
import { SquareActivity, User, LogOut, ChevronDown } from 'lucide-react';
import { Typography } from '../../../shared/ui/typography/view/Typography';
import { Container } from '../../../shared/ui/container/view/Container';
import { Button } from '../../../shared/ui/button/view/Button';
import { Avatar } from '../../../shared/ui/avatar';

export const Header: React.FC = () => {
  const { isAuth, user, isLoadingUser, fetchUserData, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isAuth && !user) {
      fetchUserData();
    }
  }, [isAuth, user, fetchUserData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate(paths.loginPage);
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleProfileClick = () => {
    setDropdownOpen(false);
    console.log('Profile clicked');
  };

  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.headerContent}>
          <Link to={paths.homePage}>
            <div className={styles.logoPart}>
              <SquareActivity color="#0092a8ff" size={36} />
              <Typography variant="h4" color="ocean-blue" weight="bold">
                PulseAI
              </Typography>
            </div>
          </Link>

          <nav className={styles.navigation}>
            <ul>
              {navigation
                .filter((item) => !item.isAuth || isAuth)
                .map((item) => (
                  <li key={item.id}>
                    <Link to={item.path} className={styles.navLink}>
                      <Typography
                        variant="largeT"
                        color="ocean-blue"
                        weight="semiBold"
                      >
                        {item.key}
                      </Typography>
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>

          <div className={styles.userPart}>
            {isAuth && !isLoadingUser ? (
              <div className={styles.userDropdown} ref={dropdownRef}>
                <button onClick={toggleDropdown} className={styles.userButton}>
                  <Avatar email={user?.email} size="medium" />
                  <ChevronDown
                    size={16}
                    className={`${styles.chevron} ${
                      dropdownOpen ? styles.chevronOpen : ''
                    }`}
                  />
                </button>

                {dropdownOpen && (
                  <div className={styles.dropdownMenu}>
                    <div className={styles.dropdownHeader}>
                      <Avatar email={user?.email} size="small" />
                      <div className={styles.userInfo}>
                        <Typography variant="bodyT" color="ocean-blue">
                          {user?.email}
                        </Typography>
                        <span className={styles.userStatus}>Active</span>
                      </div>
                    </div>

                    <div className={styles.dropdownItems}>
                      <button
                        onClick={handleProfileClick}
                        className={styles.dropdownItem}
                      >
                        <User size={16} />
                        <span>Profile</span>
                      </button>

                      <button
                        onClick={handleLogout}
                        className={`${styles.dropdownItem} ${styles.logoutItem}`}
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.btnArea}>
                <Button variant="primary" to={paths.loginPage}>
                  <Typography variant="buttonT" color="white">
                    Login
                  </Typography>
                </Button>
                <Button variant="primary" to={paths.registerPage}>
                  <Typography variant="buttonT" color="white">
                    Sign Up
                  </Typography>
                </Button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
};
