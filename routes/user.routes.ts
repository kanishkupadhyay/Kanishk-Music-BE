import { Router } from "express";
import UserController from '../controllers/user.controller.ts';
import upload from "../multer/multer.ts";

class UserRoutes {
  public router: Router;
  private userController: UserController;

  constructor() {
    this.router = Router();
    this.userController = new UserController();
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.post("/register", upload.single("imageUrl"), this.userController.register);

    this.router.post("/login", this.userController.login);
  }
}

export default UserRoutes;
