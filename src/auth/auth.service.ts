import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './dto/user.dto';

import * as bcrypt from 'bcrypt';
import { User } from './domain/user.entity';
import { Payload } from './security/payload.interface';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './repository/user.repository';
import { UserAuthority } from './domain/user-authority.entity';
import { UserAuthorityRepository } from './repository/user-authority.repository';

import {DataSource} from 'typeorm';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        
        private userRepository: UserRepository,
        private userAuthorityRepository: UserAuthorityRepository,
        private dataSource: DataSource,
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
    
        const payload: Payload = { id: userFind.id, userid: userFind.userid, authorities: userFind.authorities };
    
        return {
            accessToken: this.jwtService.sign(payload),
        };
    }
    async tokenValidateUser(payload: Payload): Promise<User| undefined> {
        const userFind = await this.userService.findByFields({
            where: { id: payload.id }
        });
        this.flatAuthorities(userFind);
        return userFind;
    }

    private flatAuthorities(user: any): User {
        if(user && user.authorities){
            const authorities: string[] = [];
            user.authorities.forEach(authority => authorities.push(authority.authorityName));
            user.authorities = authorities;
        }
        return user;
    }

    private convertInAuthorities(user: any): User {
        if( user && user.authorities ){
            const authorities: any[] = [];
            user.authorities.forEach(authority => {
                authorities.push({name: authority.authorityName});
            });
            user.authorities = authorities;
        }
        return user;
    }



    
    async deleteUser(user: User): Promise<any>{
        return await this.userRepository.createQueryBuilder()
            .delete()
            .from(User, 'user')
            .where('id = :id', { id: user.id })
            .execute();
    }

    async deleteUserAuthorities(user: User): Promise<any>{
        return await this.userAuthorityRepository.createQueryBuilder()
            .delete()
            .from(UserAuthority, 'userAuthority')
            .where('userId = :userId', { userId: user.id })
            .execute();
    }

    async cancelUser(user: User): Promise<any>{
        // transaction 처리
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try{
            // 사용자 삭제
            await this.deleteUser(user);
            // 사용자 권한 삭제
            await this.deleteUserAuthorities(user);
            // commit
            await queryRunner.commitTransaction()
        } catch (err) {
            // 실패시 rollback
            await queryRunner.rollbackTransaction();
        } finally {
            // release
            await queryRunner.release();
        }
    }
}