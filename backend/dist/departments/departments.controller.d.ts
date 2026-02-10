import { DepartmentsService } from './departments.service';
declare class CreateDepartmentDto {
    name: string;
}
export declare class DepartmentsController {
    private readonly departmentsService;
    constructor(departmentsService: DepartmentsService);
    findAll(): any;
    findOne(id: string): any;
    create(dto: CreateDepartmentDto): any;
    update(id: string, dto: CreateDepartmentDto): any;
    remove(id: string): any;
}
export {};
