class SingerFactory {
  public id: string;
  public name: string;
  public stageName: string;
  public slug: string;
  public bio: string;
  public profileImage: string;
  public genres: string;
  public country: string;
  public socialLinks: {
    instagram: { username: string; followersCount:number };
    youtube: string;
    facebook: string;
  };

  constructor({
    _id,
    name,
    stageName,
    slug,
    bio,
    profileImage,
    genres,
    country,
    socialLinks,
  }: SingerFactory) {
    this.id = _id;
    this.name = name;
    this.stageName = stageName;
    this.slug = slug;
    this.bio = bio;
    this.profileImage = profileImage;
    this.genres = genres;
    this.country = country;
    this.socialLinks = socialLinks;
  }

  public static fromEntity(singerInfo: SingerFactory) {
    return new SingerFactory(singerInfo);
  }
}

export default SingerFactory;
