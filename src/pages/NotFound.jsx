import styles from './About.module.css';
import { NavLink } from 'react-router';
function NotFound() {
  return (
    <div className={styles.aboutContainer}>
      <p>Page Not Found!</p>
      <nav>
        <h2>
          {' '}
          <NavLink to={'/'}>Return Home</NavLink>
        </h2>
      </nav>
    </div>
  );
}

export default NotFound;
