import { Router } from "express";
import SingerController from "../controllers/singer.controller.ts";
import upload from "../multer/multer.ts";
import authMiddleware from "../middlewares/auth-middleware.ts";

class SingerRoutes {
  public router: Router;
  private singerController: SingerController;

  constructor() {
    this.router = Router();
    this.singerController = new SingerController();
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.get("/", this.singerController.getSingers);

    this.router.post(
      "/",
      authMiddleware,
      upload.single("profileImage"),
      this.singerController.createSinger,
    );

    this.router.get("/:slug", this.singerController.getSingerDetailBySlug);
  };
}

export default SingerRoutes;
