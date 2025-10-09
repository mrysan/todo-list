import styles from './About.module.css';
function About() {
  return (
    <div className={styles.aboutContainer}>
      <p>
        This Todo App is built with React and powered by Airtable for fast cloud
        storage!
      </p>
      <p>
        It includes smart tools like search, pagination, and filtering to help
        you organize tasks effortlessly.
      </p>
      <p>Built by Martin Rysan as part of the Code The Dream Kiwi Cohort ❤️ </p>
      <p>Powered by caffeine ☕ and curiosity 🚀</p>
    </div>
  );
}

export default About;
