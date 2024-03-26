export interface IOperationResult {
    status: boolean | number,
    value?: any | null,
    message: string | null,
    additionalInformation: string | null,
}