import { BaseRepository } from "./base.repository.ts";
import { User } from "../models/user.ts";

class UserRepository extends BaseRepository<any> {
  constructor() {
    super(User);
  }

  public createUser = async (userInfo) => {
    const user = await this.model.create(userInfo);
    return user;
  };
}

export default UserRepository;
