import { EntityRepository, Repository } from "typeorm";
import { User } from "../domain/user.entity";
import { CustomRepository } from "src/typeorm-ex.decorator";

@CustomRepository(User)
export class UserRepository extends Repository<User>{}