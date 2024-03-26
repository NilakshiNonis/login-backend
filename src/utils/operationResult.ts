import { IOperationResult } from "../generic/interfaces/result.interface";

class OperationResult<T> {
    constructor() {}

    /**
     * Define the results for failed scenario
     * @param status
     * @param message
     * @param additionalInfo
     * @returns {{status: boolean, additionalInformation: *, message: *, value: null}|{status: boolean, additionalInformation: null, message: *, value: null}}
     */
    static failed<T>(
        status: number,
        message: string,
        additionalInfo?: string,
    ) : IOperationResult {
        if (typeof additionalInfo !== 'undefined') {
            return {
                status: status,
                message: message,
                additionalInformation: additionalInfo,
            };
        }

        return {
            status: status,
            message: message,
            additionalInformation: null,
        };
    }

    /**
     * Define the results for success scenario
     * @param data
     * @param message
     * @returns {{status: boolean, additionalInformation: null, message: *, value: *}}
     */
    static success<T>(data: T, message: string | null = null) : IOperationResult {
        return {
            status: true,
            value: data,
            message: message,
            additionalInformation: null,
        };
    }
}

export default OperationResult;
