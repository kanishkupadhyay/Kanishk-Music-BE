class ResultErrorCodes {
  // Singer
  public static readonly SingerNameIsRequired = "Singer name is required.";
  public static readonly StageNameIsRequired = "Stage name is required.";
  public static readonly BioIsRequired = "Bio is required.";
  public static readonly SlugIsRequired = "Slug is required.";
  public static readonly SingerSlugIsInvalid = 'Singer slug is invalid';
  public static readonly ProfileImageIsRequired = "Profile image is required.";
  public static readonly SlugAlreadyExists = "Slug already exists";
  public static readonly InstagramUsernameIsRequired =
    "Instagram username is required.";

  // User

  public static readonly FirstNameIsRequired = "First name is required.";
  public static readonly EmailIsRequired = "Email is required.";
  public static readonly PasswordIsRequired = "Password is required.";
  public static readonly CountryCodeIsRequired = "Country code is required.";
  public static readonly PhoneNumberIsRequired = "Phone number is required.";
  public static readonly EmailIsNotValid = "Email is not valid.";
  public static readonly UserAlreadyExistsWithThisEmail =
    "User already exists with this email";
  public static readonly PhoneNumberIsInvalid =
    "Phone number must be at least 10 digits.";
  public static readonly InvalidCredentials = "Invalid Credentials";
  public static readonly YouAreNotAuthorizedError = "You are not authorized";

  // Country
  public static readonly CountryCodeDoesNotExist =
    "Country code does not exist";

  // Song
  public static readonly TitleIsRequired = "Title is required";
  public static readonly ArtistIsRequired = "Artist is required";

  //  Song like

  public static readonly UserIdIsRequired = "User id is required.";
  public static readonly SongIdIsRequired = "Song id is required.";
  public static readonly UserDoesNotExist = "User does not exist";
  public static readonly SongDoesNotExist = "Song does not exist";
}

export default ResultErrorCodes;
