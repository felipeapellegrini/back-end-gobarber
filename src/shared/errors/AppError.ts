/**
 * Exception handling
 * Here I'm creating a custom handler to the exceptions that receives a message and statusCode
 */

export default class Error {
  public readonly message: string;

  public readonly statusCode: number;

  constructor(message: string, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
}
