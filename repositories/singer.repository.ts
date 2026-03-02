import SingerFactory from "../factories/singer.factory.ts";
import { Singer } from "../models/singer.ts";
import { BaseRepository } from "./base.repository.ts";
// import { IPaginatedSingerResponse } from "../common/utils.ts";

class SingerRepository extends BaseRepository<any> {
  constructor() {
    super(Singer);
  }

  public async getSingers(query: any): Promise<any> {
    const { page = 1, limit = 10, title } = query;
    const skip = (page - 1) * limit;

    const searchCondition = title
      ? { title: { $regex: title, $options: "i" } }
      : {};

    const [singers, total] = await Promise.all([
      this.findWithPagination(searchCondition, skip, limit),
      this.count(searchCondition),
    ]);
    const computedSingers = singers.map((singer: SingerFactory) =>
      SingerFactory.fromEntity(singer),
    );
    return {
      data: computedSingers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  public async createSinger(data: Partial<any>): Promise<any> {
    return this.create(data);
  }

  public async checkIfSlugAlreadyExists(value: string) {
    return this.checkIfFieldAlreadyExists("slug", value);
  }

  public async getSingerDetailsBySlug(slug: string) {
    return this.findByFieldName("slug", slug);
  }
}

export default SingerRepository;
