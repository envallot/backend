export {}
declare global {
  interface ErrorWithStatus {
    stack: string,
    name: string,
    message: string, 
    httpStatusCode: number,
    detail: string
  }
  
}