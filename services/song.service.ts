import { uploadToCloudinary } from "../cloudinary/cloudinary.ts";
import ResultErrorCodes from "../common/error-codes.ts";
import StatusCodes from "../common/status-codes.ts";
import SongRepository from "../repositories/song.repository.ts";

class SongService {
  private songRepository: SongRepository;

  constructor() {
    this.songRepository = new SongRepository();
  }

  public createSong = async (req, res) => {
    const { title, artist } = req.body;

    if (!title) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send(ResultErrorCodes.TitleIsRequired);
    }

    if (!artist) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send(ResultErrorCodes.ArtistIsRequired);
    }

    const audioFile = req.files?.audio?.[0];
    const coverFile = req.files?.coverImage?.[0];

    if (!audioFile || !coverFile) {
      return res.status(400).json({ message: "Audio & cover image required" });
    }

    // Upload audio
    const audioUpload = await uploadToCloudinary(
      audioFile.buffer,
      "songs/audio",
      "video",
    );

    // Upload image
    const coverUpload = await uploadToCloudinary(
      coverFile.buffer,
      "songs/covers",
      "image",
    );

    const createdSong = await this.songRepository.create({
      title,
      artist,
      album: "Test",
      genre: "test",
      audioUrl: audioUpload.secure_url,
      coverImage: coverUpload.secure_url,
      duration: audioUpload.duration, // 🔥 bonus
    });

    res.status(201).json(createdSong);
  };

  public getSongsBySinger = async (req, res) => {
    try {
      const singerDetail = await this.songRepository.getSongsBySingerId(
        req?.params?.singerId,
        req.query,
        req.user?.userId
      );
      return res.send(singerDetail);
    } catch (error) {
      throw error;
    }
  };
}

export default SongService;
