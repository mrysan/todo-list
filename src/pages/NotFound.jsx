import styles from './About.module.css';
import { NavLink } from 'react-router';
function NotFound() {
  return (
    <div className={styles.aboutContainer}>
      <p>Page Not Found!</p>
      <nav>
        <NavLink to={'/'}>Return Home</NavLink>
      </nav>
    </div>
  );
}

export default NotFound;
