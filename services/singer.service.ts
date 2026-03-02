import ResultErrorCodes from "../common/error-codes.ts";
import StatusCodes from "../common/status-codes.ts";
import SingerFactory from "../factories/singer.factory.ts";
import SingerRepository from "../repositories/singer.repository.ts";
import cloudinary from "../cloudinary/cloudinary.ts";

class SingerService {
  private singerRepository: SingerRepository;

  constructor() {
    this.singerRepository = new SingerRepository();
  }

  public getSingers = async (req: any, res: any) => {
    try {
      const singers = await this.singerRepository.getSingers(req.query);
      return res.send(singers);
    } catch (error) {
      throw error;
    }
  };

  public getSingerDetailBySlug = async (req, res) => {
    try {
      const singerDetail = await this.singerRepository.getSingerDetailsBySlug(
        req?.params?.slug,
      );
      if (!singerDetail) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .send(ResultErrorCodes.SingerSlugIsInvalid);
      }
      return res.send(singerDetail);
    } catch (error) {
      throw error;
    }
  };

  public createSinger = async (req, res) => {
    try {
      const { name, stageName, slug, bio, genres, country, createdBy } =
        req.body;
      const socialLinks = req.body.socialLinks
        ? JSON.parse(req.body.socialLinks)
        : {};
      this.validateSingerRequest(req.body, res);

      const slugAlreadyExists =
        await this.singerRepository.checkIfSlugAlreadyExists(slug);

      if (slugAlreadyExists) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .send(ResultErrorCodes.SlugAlreadyExists);
      }

      const cloudinaryProfileImage = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer?.toString("base64")}`,
        {
          folder: "singers",
        },
      );

      const createdSinger = await this.singerRepository.createSinger({
        name,
        stageName,
        slug,
        bio,
        profileImage: cloudinaryProfileImage.secure_url,
        genres,
        country,
        socialLinks,
        createdBy,
      });

      return res.send(SingerFactory.fromEntity(createdSinger));
    } catch (error) {
      throw error;
    }
  };

  private validateSingerRequest(body, res) {
    const { name, stageName, slug, bio } = body;
    const socialLinks = body.socialLinks ? JSON.parse(body.socialLinks) : {};

    const fieldMapping = [
      { field: name, errorMsg: ResultErrorCodes.SingerNameIsRequired },
      { field: stageName, errorMsg: ResultErrorCodes.StageNameIsRequired },
      { field: bio, errorMsg: ResultErrorCodes.BioIsRequired },
      { field: slug, errorMsg: ResultErrorCodes.SlugIsRequired },
      // {
      //   field: profileImage,
      //   errorMsg: ResultErrorCodes.ProfileImageIsRequired,
      // },
      {
        field: socialLinks.instagram?.username,
        errorMsg: ResultErrorCodes.InstagramUsernameIsRequired,
      },
    ];

    fieldMapping.forEach((item) => {
      if (!item.field) {
        return res.status(StatusCodes.BAD_REQUEST).send(item.errorMsg);
      }
    });
  }
}

export default SingerService;
