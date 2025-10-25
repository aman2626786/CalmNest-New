const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * A simple logger that only outputs messages in the development environment.
 */
export const logger = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  error: (...args: any[]) => {
    if (isDevelopment) {
      console.error(...args);
    }
  },
};