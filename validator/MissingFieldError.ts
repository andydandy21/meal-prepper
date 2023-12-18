export class MissingFieldError extends Error {
  constructor(missingFieldError: string) {
    super(`Value for ${missingFieldError} expected.`);
  }
}
