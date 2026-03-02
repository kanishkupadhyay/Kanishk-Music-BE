import { Router } from "express";
import SongLikeController from "../controllers/song-like.controller.ts";

class SongLikeRoutes {
  private songLikeController;
  public router: Router;

  constructor() {
    this.router = Router();
    this.songLikeController = new SongLikeController();
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.get("/:userId", this.songLikeController.getLikedSongsByUser);
    this.router.post("/", this.songLikeController.likeSongByUser)
  };
}

export default SongLikeRoutes;
