/**
 * Measures the execution time of an asynchronous function.
 * @param fn - The asynchronous function to measure.
 * @param name - The name of the measurement (optional).
 * @returns A promise that resolves to the result of the function.
 */
export const measureAsync = async (fn: Function, name: string) => {
  console.time(name || 'Execution time');
  try {
    return await fn();
  } finally {
    console.timeEnd(name || 'Execution time');
  }
};

/**
 * Measures the execution time of a function.
 * @param fn - The function to be measured.
 * @param name - Optional name for the measurement. If not provided, 'Execution time' will be used.
 * @returns The result of the function.
 */
export const measure = (fn: Function, name: string) => {
  console.time(name || 'Execution time');
  try {
    return fn();
  } finally {
    console.timeEnd(name || 'Execution time');
  }
};
