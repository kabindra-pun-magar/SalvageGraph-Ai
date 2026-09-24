import { prisma } from "../config/database";
import { ApiError } from "../utils/api-error";
import {
  comparePassword,
  hashPassword,
} from "../utils/password";
import { generateAccessToken } from "../utils/jwt";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export const registerUser = async (
  input: RegisterInput
) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });

  if (existingUser) {
    throw new ApiError(
      409,
      "A user with this email already exists"
    );
  }

  const hashedPassword = await hashPassword(
    input.password
  );

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: hashedPassword,
    },
  });

  const token = generateAccessToken({
    userId: user.id,
    role: user.role,
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

export const loginUser = async (
  input: LoginInput
) => {
  const user = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });

  if (!user) {
    throw new ApiError(
      401,
      "Invalid email or password"
    );
  }

  const passwordMatches = await comparePassword(
    input.password,
    user.password
  );

  if (!passwordMatches) {
    throw new ApiError(
      401,
      "Invalid email or password"
    );
  }

  const token = generateAccessToken({
    userId: user.id,
    role: user.role,
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};