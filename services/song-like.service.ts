import mongoose from "mongoose";
import ResultErrorCodes from "../common/error-codes.ts";
import StatusCodes from "../common/status-codes.ts";
import SongLikeRepository from "../repositories/song-like.repository.ts";
import SongRepository from "../repositories/song.repository.ts";
import UserRepository from "../repositories/user.repository.ts";

class SongLikeService {
  private songLikeRepository: SongLikeRepository;
  private userRepository: UserRepository;
  private songRepository: SongRepository;

  constructor() {
    this.songLikeRepository = new SongLikeRepository();
    this.userRepository = new UserRepository();
    this.songRepository = new SongRepository();
  }

  public getLikedSongsByUser = async (req, res) => {
    try {
      const singerDetail = await this.songLikeRepository.getLikedSongsByUserId(
        req?.params?.userId,
        req.query,
      );
      return res.send(singerDetail);
    } catch (error) {
      throw error;
    }
  };

  public likeSongByUser = async (req, res) => {
    try {
      const { userId, songId } = req.body;
      if (!userId) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .send(ResultErrorCodes.UserIdIsRequired);
      }
      if (!songId) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .send(ResultErrorCodes.SongIdIsRequired);
      }
      const userExist = await this.userRepository.findByFieldName(
        "_id",
        new mongoose.Types.ObjectId(userId),
      );
      if (!userExist) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .send(ResultErrorCodes.UserDoesNotExist);
      }
      const songExist = await this.songRepository.findByFieldName(
        "_id",
        new mongoose.Types.ObjectId(songId),
      );
      if (!songExist) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .send(ResultErrorCodes.SongDoesNotExist);
      }
      const alreadyLikedByUser = await this.songLikeRepository.model.findOne({
        user: userId,
        song: songId,
      });
      if (alreadyLikedByUser) {
        await this.songLikeRepository.model.deleteOne({
          _id: alreadyLikedByUser._id,
        });
        await this.songRepository.model.findByIdAndUpdate(songId, {
          $inc: { likesCount: -1 },
        });

        return res
          .status(200)
          .json({ message: "Song unliked successfully", liked: false });
      }
      await this.songLikeRepository.create({
        user: userId,
        song: songId,
      });
      await this.songRepository.model.findByIdAndUpdate(songId, {
        $inc: { likesCount: 1 },
      });

      return res
        .status(200)
        .json({ message: "Song liked successfully", liked: true });
    } catch (error) {
      throw error;
    }
  };
}

export default SongLikeService;
