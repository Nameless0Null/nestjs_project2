import { Body, Controller, Post, Get, Res, Req, UseGuards, ValidationPipe, UsePipes} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDTO } from './dto/user.dto';

import { Response, Request } from 'express';

import { AuthGuard } from './security/auth.guard';
import { RolesGuard } from './security/roles.guard';
import { RoleType } from './role-type';
import { Roles } from './decorator/role.decorator';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('/signup')
    @UsePipes(ValidationPipe)
    async registerAccount(@Req() req: Request, @Body() userDTO: UserDTO): Promise<any> {
        return await this.authService.registerNewUser(userDTO);
    }

    @Post('/login')
    async login(@Body() userDTO: UserDTO, @Res() res: Response): Promise<any> {
        const jwt = await this.authService.validateUser(userDTO);
        res.setHeader('Authorization', 'Bearer '+jwt.accessToken);
        
        res.cookie('jwt', jwt.accessToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        })
        
        
        return res.send({
            message: 'success'
        });
    }

    @Get('/authenticate')
    @UseGuards(AuthGuard)
    isAuthenticated(@Req() req: Request): any {
        const user: any = req.user;
        return user;
    }

    @Get('/admin-role')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RoleType.ADMIN)
    adminRoleCheck(@Req() req: Request): any {
        const user: any = req.user;
        return user;
    }

    @Get('/cookies')
    getCookies(@Req() req: Request, @Res() res: Response): any {
        const jwt = req.cookies['jwt'];
        return res.send(jwt);
    }

    @Post('/logout')
    logout(@Res() res: Response): any {
        res.cookie('jwt', '', {
            maxAge: 0
        });
        return res.send({
            message: 'success'
        })
    }
}