import bcrypt from "bcrypt";
import SingerFactory from "../factories/singer.factory.ts";

export interface IPaginatedSingerResponse {
  data: SingerFactory;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const checkIsValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

export const createHashPassword = async (
  password: string,
  saltRounds = 10,
): Promise<string> => {
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(password, salt);
};
