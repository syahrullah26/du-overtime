export declare class CreateOvertimeDto {
    date: string;
    startTime: string;
    endTime: string;
    reason?: string;
}
export declare class ApproveOvertimeDto {
    signature?: string;
    note?: string;
}
export declare class RejectOvertimeDto {
    note: string;
}
export declare class QueryOvertimeDto {
    status?: string;
    employeeId?: string;
    page?: number;
    limit?: number;
}
