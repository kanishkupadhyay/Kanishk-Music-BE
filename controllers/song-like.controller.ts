import SongLikeService from "../services/song-like.service.ts";

class SongLikeController {
  private songLikeService: SongLikeService;

  constructor() {
    this.songLikeService = new SongLikeService();
  }

  public getLikedSongsByUser = async (req, res) => {
    const likedSongs = await this.songLikeService.getLikedSongsByUser(req, res);
    return likedSongs;
  };

  public likeSongByUser = async (req, res) => {
    const likedSong = await this.songLikeService.likeSongByUser(req, res);
    return likedSong;
  };
}

export default SongLikeController;
