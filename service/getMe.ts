"use server";

import { cookies } from "next/headers";

export const getMe = async () => {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value || null;

  if (!accessToken) {
    return {
      success: false,
      message: "User not logged in!",
    };
  }

  try {
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/users/me`, {
      headers: {
        // Authorization : accessToken as unknown as string,
        // Authorization : `${accessToken}`,
        // Authorization: `Bearer ${accessToken}`,

        Cookie: `accessToken=${accessToken}`,
      },

      cache: "force-cache",
      next: {
        revalidate: 60 * 60 * 24, // 1day
        tags: ["my-profile"],
      },
    });


    if (!res.ok) {
      return {
        success: false,
        message: "Session expired or invalid token",
      };
    }

    const result = await res.json();

    return result;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return {
      success: false,
      message: "An error occurred while fetching the user.",
    };
  }
};
