
export type Query = {
  text: string;
  values?: any[];
}


export interface ErrorWithStatus extends Error {
  httpStatusCode: number,
  detail: string
}