class Logger {
  static success(message: string, ...optionalParams: any[]) {
    console.log(
      `%c✔️ SUCCESS: ${message}`,
      'color: green; font-weight: bold;',
      ...optionalParams
    );
  }

  static info(message: string, ...optionalParams: any[]) {
    console.log(
      `%cℹ️ INFO: ${message}`,
      'color: blue; font-weight: bold;',
      ...optionalParams
    );
  }

  static warning(message: string, ...optionalParams: any[]) {
    console.warn(
      `%c⚠️ WARNING: ${message}`,
      'color: orange; font-weight: bold;',
      ...optionalParams
    );
  }

  static error(message: string, ...optionalParams: any[]) {
    console.error(
      `%c❌ ERROR: ${message}`,
      'color: red; font-weight: bold;',
      ...optionalParams
    );
  }
}

export { Logger };
