export interface IErrorDetails {
  code?: string;
  description?: string;
  field?: string;
}

export interface IErrorHandler extends Error {
  statusCode?: number;
  details?: IErrorDetails;
}

export const errorHandler = (
  statusCode: number = 500,
  message: string = "An error occured",
  details?: IErrorDetails
): IErrorHandler => {
  const error = new Error() as IErrorHandler;
  error.statusCode = statusCode;
  error.message = message;
  error.details = details;
  return error;
};
