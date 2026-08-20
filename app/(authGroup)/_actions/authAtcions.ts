"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type LoginState = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
};

export const loginAction = async (
  previousState: LoginState,
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

  const data = await res.json();
  if (data.success) {
    const cookieStore = await cookies();

    cookieStore.set("accessToken", data.data.accessToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24,
      sameSite: "lax",
    });
    cookieStore.set("refreshToken", data.data.accessToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    // Server-side navigation
    redirect("/dashboard") // by default -> type: "push"
    // redirect("/dashboard", "replace") // replace the path


  }
  return data;
};

export default loginAction;
