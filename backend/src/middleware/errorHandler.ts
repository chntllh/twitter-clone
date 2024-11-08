export interface IerrorHandler extends Error {
  statusCode?: number;
}

export const errorHandler = (
  statusCode: number = 500,
  message: string = "An error occured"
): IerrorHandler => {
  const error = new Error() as IerrorHandler;
  error.statusCode = statusCode;
  error.message = message;
  return error;
};
