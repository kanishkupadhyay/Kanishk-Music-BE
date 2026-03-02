import UserService from "../services/user.service.ts";

class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public register = async (req, res) => {
    const userInfo = await this.userService.registerUser(req, res);
    return userInfo;
  };

  public login = async (req, res) => {
    const user = await this.userService.login(req, res);
    return user;
  };
}

export default UserController;
