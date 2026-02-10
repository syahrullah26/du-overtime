import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): any;
    findByRole(role: string): any;
    findByDepartment(deptId: string): any;
    findOne(id: string): any;
}
