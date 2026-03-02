import SongService from "../services/song.service.ts";

class SongController {
  private songService: SongService;

  constructor() {
    this.songService = new SongService();
  }

  public createSong = async (req, res) => {
    const createdSong = await this.songService.createSong(req, res);

    return createdSong;
  };

  public getSongsBySingerId = async (req, res) => {
    const songs = await this.songService.getSongsBySinger(req, res);
    return songs;
  };
}

export default SongController;
