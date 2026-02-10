import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): unknown;
    register(registerDto: RegisterDto): unknown;
    getProfile(req: any): unknown;
}
