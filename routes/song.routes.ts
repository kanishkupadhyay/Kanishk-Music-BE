import { Router } from "express";
import SongController from "../controllers/song.controller.ts";
import upload from "../multer/multer.ts";
import authMiddleware from "../middlewares/auth-middleware.ts";

class SongRoutes {
  public router: Router;
  private songController: SongController;

  constructor() {
    this.songController = new SongController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.post(
      "/",
      upload.fields([
        { name: "audio", maxCount: 1 },
        { name: "coverImage", maxCount: 1 },
      ]),
      this.songController.createSong,
    );

    this.router.get("/by-singer/:singerId", authMiddleware, this.songController.getSongsBySingerId);
  };
}

export default SongRoutes;
