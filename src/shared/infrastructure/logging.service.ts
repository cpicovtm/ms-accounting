export class LoggingServiceImpl {
  log(message: string, context?: unknown) {
    console.log(`[LOG] ${message}`, context);
  }
  error(message: string, context?: unknown) {
    console.error(`[ERROR] ${message}`, context);
  }
}
