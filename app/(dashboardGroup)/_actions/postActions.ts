/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

type PostState = {
  success: true;
  statusCode: number;
  message: string;
  data: Record<string, any>;
};

export const createPost = async (prevState: PostState, data: FormData) => {
  const payload = {
    title: data.get("title"),
    content: data.get("content"),
    thumbnail: data.get("thumbnail"),
    tags: (data.get("tags") as string)?.split(", "),
    isPremium: data.get("isPremium") === "on",
  };
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value || null;

  if (!accessToken) {
    return {
      success: false,
      message: "User not logged in!",
    };
  }

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/posts`, {
    method: "POST",
    headers: {
      Cookie: `accessToken=${accessToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await res.json();

  if (result.success) {
    revalidateTag("my-posts", {
      expire: 0,
    });
  } else if (result.success && result.data.isPremium) {
    revalidateTag("premium-posts", {
      expire: 0,
    });
  } else {
    revalidateTag("public-posts", {
      expire: 0,
    });
  }

  return result;
};

export const getMyPosts = async ({
  query,
}: {
  query?: { [key: string]: string | string[] | undefined };
}) => {
  const params = new URLSearchParams();

  if (query && query.searchTerm) {
    params.set("searchTerm", query.searchTerm as string);
  }

  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value || null;

  if (!accessToken) {
    return {
      success: false,
      message: "User not logged in!",
    };
  }

  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/posts/my-posts?${params.toString()}`,
    {
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
      cache: "no-cache",
      next: {
        revalidate: 60 * 60 * 6,
        tags: ["public-posts"],
      },
    },
  );

  const result = await res.json();

  return result;
};

export const updatePost = async (postId: string, prevState: PostState, data: FormData) => {
  const payload = {
    title: data.get("title") ?? "",
    content: data.get("content") ?? "",
    thumbnail: data.get("thumbnail") ?? "",
    tags: (data.get("tags") as string)?.split(", ") ?? [],
    isPremium: data.get("isPremium") === "on",
  };
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value || null;

  if (!accessToken) {
    return {
      success: false,
      message: "User not logged in!",
    };
  }

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/posts/${postId}`, {
    method: "PATCH",
    headers: {
      Cookie: `accessToken=${accessToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await res.json();

  if (result.success) {
    revalidateTag("my-posts", {
      expire: 0,
    });
  } else if (result.success && result.data.isPremium) {
    revalidateTag("premium-posts", {
      expire: 0,
    });
  } else {
    revalidateTag("public-posts", {
      expire: 0,
    });
  }

  return result;
};