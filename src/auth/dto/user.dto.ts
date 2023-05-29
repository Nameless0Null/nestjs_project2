import { IsNotEmpty } from "class-validator";

export class UserDTO {
    @IsNotEmpty()
    userid: string;
    @IsNotEmpty()
    password: string;
}