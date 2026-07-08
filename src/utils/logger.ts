export class Logger {
  public static info(message: string, ...args: unknown[]): void {
    console.info(`[INFO] ${message}`, ...args);
  }

  public static warn(message: string, ...args: unknown[]): void {
    console.warn(`[WARN] ${message}`, ...args);
  }

  public static error(message: string, ...args: unknown[]): void {
    console.error(`[ERROR] ${message}`, ...args);
  }

  public static debug(message: string, ...args: unknown[]): void {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }
}
