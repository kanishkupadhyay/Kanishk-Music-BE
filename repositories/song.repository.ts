import { BaseRepository } from "./base.repository.ts";
import { Song } from "../models/song.ts";
import mongoose from "mongoose";
import SongLikeRepository from "./song-like.repository.ts";

class SongRepository extends BaseRepository<any> {
  private songLikeRepository: SongLikeRepository;
  constructor() {
    super(Song);
    this.songLikeRepository = new SongLikeRepository();
  }

  public async getSongsBySingerId(
    singerId: string,
    query: any,
    currentUserId: string,
  ) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const { title } = query;

    const searchCondition: any = {
      artist: new mongoose.Types.ObjectId(singerId),
    };

    if (title) {
      searchCondition.title = { $regex: title, $options: "i" };
    }

    const [songs, total] = await Promise.all([
      this.model.find(searchCondition).skip(skip).limit(limit).lean(),
      this.model.countDocuments(searchCondition),
    ]);

    // 🔥 Get all liked songIds of this user
    const likedSongs = await this.songLikeRepository.model
      .find({
        user: new mongoose.Types.ObjectId(currentUserId),
        song: { $in: songs.map((s) => s._id) },
      })
      .select("song");

    const likedSongIds = new Set(
      likedSongs.map((like) => like.song.toString()),
    );

    // 🔥 Attach isLikedByCurrentUser
    const updatedSongs = songs.map((song) => ({
      ...song,
      isLikedByCurrentUser: likedSongIds.has(song._id.toString()),
    }));

    console.log('currentUserId', currentUserId);

    return {
      data: updatedSongs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export default SongRepository;
