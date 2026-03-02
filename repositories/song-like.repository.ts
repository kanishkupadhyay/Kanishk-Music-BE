import mongoose from "mongoose";
import { SongLike } from "../models/song-like.ts";
import { BaseRepository } from "./base.repository.ts";

class SongLikeRepository extends BaseRepository<any> {
  constructor() {
    super(SongLike);
  }

  public async getLikedSongsByUserId(userId: string, query: any) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const { title } = query;

    const pipeline: any[] = [
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
        },
      },

      // 🎵 song lookup
      {
        $lookup: {
          from: "songs",
          localField: "song",
          foreignField: "_id",
          as: "song",
        },
      },
      {
        $unwind: {
          path: "$song",
          preserveNullAndEmptyArrays: false, // song must exist
        },
      },

      // 🎤 artist lookup (SAFE)
      {
        $lookup: {
          from: "singers",
          let: { artistId: "$song.artist" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$artistId"],
                },
              },
            },
          ],
          as: "artist",
        },
      },
      {
        $unwind: {
          path: "$artist",
          preserveNullAndEmptyArrays: true, // 🔥 IMPORTANT
        },
      },

      ...(title
        ? [
            {
              $match: {
                "song.title": { $regex: title, $options: "i" },
              },
            },
          ]
        : []),

      { $sort: { createdAt: -1 } },

      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                _id: 1,
                likedAt: "$createdAt",
                song: {
                  _id: "$song._id",
                  title: "$song.title",
                  audioUrl: "$song.audioUrl",
                  coverImage: "$song.coverImage",
                  duration: "$song.duration",
                  artist: {
                    _id: { $ifNull: ["$artist._id", null] },
                    name: { $ifNull: ["$artist.name", "Unknown Artist"] },
                  },
                },
              },
            },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ];

    const result = await this.model.aggregate(pipeline);

    const songs = result[0]?.data || [];
    const total = result[0]?.totalCount[0]?.count || 0;

    return {
      data: songs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export default SongLikeRepository;
