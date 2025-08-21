import { Instagram, Linkedin, Twitter } from 'lucide-react';
import { footerNavigation } from '../../../shared/constants/constants';
import { Container, Typography } from '../../../shared/ui';
import styles from './Footer.module.scss';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const socialMediaLinks = [
    {
      id: 1,
      name: 'Twitter',
      url: 'https://www.twitter.com',
      icon: <Twitter />,
    },
    {
      id: 2,
      name: 'LinkedIn',
      url: 'https://www.linkedin.com',
      icon: <Linkedin />,
    },
    {
      id: 3,
      name: 'Instagram',
      url: 'https://www.instagram.com',
      icon: <Instagram />,
    },
  ];
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.footerContent}>
          <div className={styles.firstBlock}>
            <div className={styles.footerLinks}>
              {footerNavigation.map((item) => (
                <Link
                  key={item.id}
                  to={item.path!}
                  className={styles.footerLink}
                >
                  <Typography variant="largeT" color="dark">
                    {item.key}
                  </Typography>
                </Link>
              ))}
            </div>
            <div className={styles.footerText}>
              <Typography variant="bodyT" color="moreGray">
                © {new Date().getFullYear()} Smart Cardiologist. All rights
                reserved.
              </Typography>
            </div>
          </div>
          <div className={styles.secondBlock}>
            <div className={styles.socialMedia}>
              {socialMediaLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};
