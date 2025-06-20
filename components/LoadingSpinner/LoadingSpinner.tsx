import styles from "./LoadingSpinner.module.css";

interface LoadingSpinnerProps {
  overlay?: boolean;
}

function LoadingSpinner({ overlay = false }: LoadingSpinnerProps) {
  return (
    <div
      className={`${styles.spinnerContainer} ${overlay ? styles.overlay : ""}`}
    >
      {" "}
      <div className={styles.spinner}></div>
      <p>Loading...</p>
    </div>
  );
}

export default LoadingSpinner;