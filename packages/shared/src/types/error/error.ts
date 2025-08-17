type BadRequest = {
  error: string;
  statusCode: 400;
  message: string[] | string;
};

export type HttpError =
  | {
      error: string;
      statusCode: number;
      message: string;
    }
  | BadRequest;

export function isBadRequest(error: HttpError): error is BadRequest {
  return error.statusCode === 400;
}
