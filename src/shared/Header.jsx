import { NavLink, useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import styles from './Header.module.css';
function Header() {
  const location = useLocation();
  const [title, setTitle] = useState('Todo List');
  useEffect(() => {
    switch (location.pathname) {
      case '/': {
        setTitle('Todo List');
        return;
      }
      case '/about': {
        setTitle('About');
        return;
      }
      default: {
        setTitle('Not Found');
        return;
      }
    }
  }, [location]);

  return (
    <div className={styles.header}>
      {/* spacer div */}
      <div></div>
      <div className={styles.title}>
        <img src="./public/favicon.svg" alt="todo-icon" />
        <h1>{title}</h1>
      </div>
      <div>
        <nav className={styles.navigation}>
          <NavLink
            to={'/'}
            className={({ isActive }) => {
              return isActive ? styles.active : styles.inactive;
            }}
          >
            Home
          </NavLink>
          <NavLink
            to={'/about'}
            className={({ isActive }) => {
              return isActive ? styles.active : styles.inactive;
            }}
          >
            About
          </NavLink>
        </nav>
      </div>
    </div>
  );
}

export default Header;
