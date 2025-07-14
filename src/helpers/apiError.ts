const httpStatus = require("http-status");

/**
 * @extends Error
 */
class ExtendableError extends Error {
  public status: number;
  public isPublic: boolean;
  public errorCode: number;
  public errors: any[];
  public originalStacks: string[] = []; // Initialize originalStacks with an empty array

  constructor(
    message: string,
    status: number,
    isPublic: boolean,
    { errors = null, errorCode = null, stack = null }:
      { errors?: any[] | null, errorCode?: number | null, stack?: string | null } = {}
  ){
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.status = status;
    this.isPublic = isPublic;
    this.errorCode = errorCode || status;
    this.errors = errors || [];
   if (stack && typeof stack === 'string') {
    this.originalStacks = stack.split("\n");
  }
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Class representing an API error.
 * @extends ExtendableError
 */
class ApiError extends ExtendableError {
  /**
   * Creates an API error.
   * @param {string} message - Error message.
   * @param {number} status - HTTP status code of error.
   * @param {boolean} isPublic - Whether the message should be visible to user or not.
   * @param {string[]} errors - List of error list
   * @param {?string} errorCode - errorcode
   * @param stack
   */
  constructor(
    message: string,
    status = httpStatus.INTERNAL_SERVER_ERROR,
    isPublic = false,
    { errors = null, errorCode = null, stack = null } : { errors?: any[] | null , errorCode?: number | null, stack?: string | null } = {}
  ) {
    super(message, status, isPublic, { errors, errorCode, stack });
  }
}

export default ApiError;
