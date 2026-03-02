import ResultErrorCodes from "../common/error-codes.ts";
import StatusCodes from "../common/status-codes.ts";
import CountryRepository from "../repositories/country.repository.ts";
import { checkIsValidEmail } from "../common/utils.ts";
import UserRepository from "../repositories/user.repository.ts";
import cloudinary from "../cloudinary/cloudinary.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UserService {
  private userRepository: UserRepository;
  private countryRepository: CountryRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.countryRepository = new CountryRepository();
  }

  public registerUser = async (req, res) => {
    const { firstName, lastName, email, password, countryCode, phone } =
      req.body;

    await this.validateRequestBody(req.body, res);
    try {
      const cloudinaryUserImage = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer?.toString("base64")}`,
        {
          folder: "users",
        },
      );
      await this.userRepository.createUser({
        firstName,
        lastName,
        email,
        password,
        countryCode,
        phone,
        imageUrl: cloudinaryUserImage.secure_url,
      });
      return res.send("User registered Successfully!!");
    } catch (error) {
      throw error;
    }
  };

  public login = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body)
    const fieldMapping = [
      {
        field: email,
        errorMsg: ResultErrorCodes.EmailIsRequired,
      },
      {
        field: password,
        errorMsg: ResultErrorCodes.PasswordIsRequired,
      },
    ];

    fieldMapping.forEach((item) => {
      if (!item.field) {
        return res.status(StatusCodes.BAD_REQUEST).send(item.errorMsg);
      }
    });

    try {
      const user = await this.userRepository.findOne("email", email);

      if (!user) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .send(ResultErrorCodes.InvalidCredentials);
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (!isPasswordMatch) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .send(ResultErrorCodes.InvalidCredentials);
      }

      // 🎟️ JWT Token create
      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        },
      );

      return res.status(StatusCodes.OK).send({
        token,
        user,
      });
    } catch (error) {
      throw error;
    }
  };

  private validateRequestBody = async (data, res) => {
    const fieldMapping = [
      {
        field: data?.firstName,
        errorMsg: ResultErrorCodes.FirstNameIsRequired,
      },
      {
        field: data?.email,
        errorMsg: ResultErrorCodes.EmailIsRequired,
      },
      {
        field: data?.password,
        errorMsg: ResultErrorCodes.PasswordIsRequired,
      },
      {
        field: data?.countryCode,
        errorMsg: ResultErrorCodes.CountryCodeIsRequired,
      },
      {
        field: data?.phone,
        errorMsg: ResultErrorCodes.PhoneNumberIsRequired,
      },
    ];

    fieldMapping.forEach((item) => {
      if (!item.field) {
        return res.status(StatusCodes.BAD_REQUEST).send(item.errorMsg);
      }
    });
    const isValidEmail = checkIsValidEmail(data?.email);
    if (!isValidEmail) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send(ResultErrorCodes.EmailIsNotValid);
    }

    const userAlreadyExists = await this.userRepository.findByFieldName(
      "email",
      data?.email,
    );

    if (userAlreadyExists) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send(ResultErrorCodes.UserAlreadyExistsWithThisEmail);
    }

    const isCountryCodeValid = await this.countryRepository.findByFieldName(
      "dialCode",
      data?.countryCode,
    );
    if (!isCountryCodeValid) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send(ResultErrorCodes.CountryCodeDoesNotExist);
    }
    if (data?.phone.length !== 10) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send(ResultErrorCodes.PhoneNumberIsInvalid);
    }
  };
}

export default UserService;
