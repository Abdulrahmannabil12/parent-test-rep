export class ResponseData<T> {
  data: T;
  statusCode?: number;
  responseMessage?: string;
  isSuccess?: boolean;
  referenceNumber?: number;
  total: number;
}
