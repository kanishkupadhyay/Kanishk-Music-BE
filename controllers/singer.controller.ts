import SingerService from "../services/singer.service.ts";

class SingerController {
  private singerService: SingerService;

  constructor() {
    this.singerService = new SingerService();
  }

  public getSingers = async (req: any, res: any) => {
    const singers = await this.singerService.getSingers(req, res);

    return singers;
  };

  public getSingerDetailBySlug = async (req, res) => {
    const singer = await this.singerService.getSingerDetailBySlug(req, res);

    return singer;
  };

  public createSinger = async (req: any, res: any) => {
    const createdSinger = await this.singerService.createSinger(req, res);

    return createdSinger;
  };
}

export default SingerController;
