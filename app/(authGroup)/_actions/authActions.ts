"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt, { JwtPayload } from "jsonwebtoken"

type LoginState = {
  success: true;
  statusCode: number;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
};

export type RegisteredUser = {
  id: string;
  name: string;
  email: string;
  activeStatus: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  profile: {
    id: string;
    profilePhoto: string | null;
    bio: string | null;
    userId: string;
  } | null;
};

export type RegisterState = {
  success: boolean;
  statusCode?: number;
  message: string;
  data?: {
    user: RegisteredUser;
  };
};

export const loginAction = async (
  prevState: LoginState,
  formData: FormData,
) => {
  const email = formData.get("email");
  const password = formData.get("password");

  const payload = {
    email,
    password,
  };

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await res.json();

  if (result.success) {
    const cookieStore = await cookies();

    cookieStore.set("accessToken", result.data.accessToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24,
      sameSite: "lax",
      path: "/"
    });
    cookieStore.set("refreshToken", result.data.refreshToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
      path:"/"
    });

    const jwtDecoder = jwt.decode(result.data.accessToken) as JwtPayload;
    if (jwtDecoder.role === "USER")
      redirect("/dashboard");
    else if (jwtDecoder.role === "ADMIN")
      redirect("/admin-dashboard");
    else if (jwtDecoder.role === "AUTHOR")
      redirect("/author-dashboard");
  }

  return result;
};


export const registerAction = async (
  prevState: RegisterState | false,
  formData: FormData,
) => {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const profilePhoto = formData.get("profilePhoto");
  const bio = formData.get("bio");

  const payload = {
    name,
    email,
    password,
    ...(profilePhoto && { profilePhoto }),
    ...(bio && { bio }),
  };

  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/users/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  const result = await res.json();

  redirect("/login");

  return result;
};
