import { OvertimeService } from './overtime.service';
import { CreateOvertimeDto, ApproveOvertimeDto, RejectOvertimeDto, QueryOvertimeDto } from './dto/overtime.dto';
export declare class OvertimeController {
    private readonly overtimeService;
    constructor(overtimeService: OvertimeService);
    create(req: any, createOvertimeDto: CreateOvertimeDto): any;
    findAll(req: any, query: QueryOvertimeDto): any;
    getPendingApprovals(req: any): any;
    getStats(req: any): any;
    findOne(id: string, req: any): any;
    approve(id: string, req: any, approveDto: ApproveOvertimeDto): any;
    reject(id: string, req: any, rejectDto: RejectOvertimeDto): any;
}
