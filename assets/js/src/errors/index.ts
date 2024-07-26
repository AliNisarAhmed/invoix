export class ApiFormError extends Error {
  errorInfo: FormErrorInfo;
  constructor(errorInfo: FormErrorInfo) {
    super(errorInfo?.message || "Something went wrong");
    this.errorInfo = errorInfo;
  }
}

export type FormErrorInfo = {
  message: string;
  field?: string;
};
