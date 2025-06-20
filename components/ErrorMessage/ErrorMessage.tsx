import styles from './ErrorMessage.module.css';

interface ErrorMessageProps {
  message: string;
}

function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className={styles.errorContainer}>
      <p className={styles.errorMessage}>Error: {message}</p>
      <p>Please try again later.</p>
    </div>
  );
}

export default ErrorMessage;