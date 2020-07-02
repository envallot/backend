
export type Query = {
  text: string;
  values?: [string];
}


export interface ErrorWithStatus extends Error {
  httpStatusCode: number,
  detail: string
}