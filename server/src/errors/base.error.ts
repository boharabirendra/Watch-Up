export class BaseError extends Error {
  message: string;
  statusCode: number;
  constructor(message = "", statusCode = 500) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}