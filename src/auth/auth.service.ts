import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './dto/user.dto';

import * as bcrypt from 'bcrypt';
import { User } from './domain/user.entity';
import { Payload } from './security/payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    jwtService: any;
    constructor(
        private userService: UserService
    ){}

    async registerNewUser(newUser: UserDTO): Promise<UserDTO> {
    let userFind: UserDTO = await this.userService.findByFields({ where: {userid: newUser.userid } });
        if(userFind){
            throw new HttpException('Userid already used!', HttpStatus.BAD_REQUEST);
        }
        return this.userService.save(newUser);
    }
    async validateUser(userDTO: UserDTO): Promise<{accessToken: string} | undefined> {
        let userFind: User = await this.userService.findByFields({
            where: { userid: userDTO.userid}
        });
        const validatePassword = await bcrypt.compare(userDTO.password, userFind.password);
        if(!userFind || !validatePassword) {
            throw new UnauthorizedException();
        }
    
        const payload: Payload = { id: userFind.id, userid: userFind.userid };
    
        return {
            accessToken: this.jwtService.sign(payload),
        };
    }
    async tokenValidateUser(payload: Payload): Promise<User| undefined> {
        const userFind = await this.userService.findByFields({
            where: { userid: payload.userid }
        });
        this.flatAuthorities(userFind);
        return userFind;
    }
    
    private flatAuthorities(user: any): User {
        if (user && user.authorities) {
            const authorities: string[] = [];
            user.authorities.forEach(authority => authorities.push(authority.authorityName));
            user.authorities = authorities;
        }
        return user;
    }
    
    private convertInAuthorities(user: any): User {
        if (user && user.authorities) {
            const authorities: any[] = [];
            user.authorities.forEach(authority => authorities.push({ name: authority.authorityName }));
            user.authorities = authorities;
        }
        return user;
    }
}