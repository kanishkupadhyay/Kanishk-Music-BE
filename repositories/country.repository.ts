import { Country } from "../models/countries.ts";
import { BaseRepository } from "./base.repository.ts";

class CountryRepository extends BaseRepository<any> {
  constructor() {
    super(Country);
  }
  public async getAllCountries(query) {
    const { page = 1, limit = 10, title } = query;
    const skip = (page - 1) * limit;
    const searchCondition = title
      ? { title: { $regex: title, $options: "i" } }
      : {};

    const [countries, total] = await Promise.all([
      this.findWithPagination(searchCondition, skip, limit),
      this.count(searchCondition),
    ]);
    // const computedSingers = singers.map((singer: SingerFactory) =>
    //   SingerFactory.fromEntity(singer),
    // );
    return {
      data: countries,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export default CountryRepository;
