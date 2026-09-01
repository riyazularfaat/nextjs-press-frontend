/* eslint-disable @typescript-eslint/no-explicit-any */
import { IPost } from "@/lib/types";
import { MyPostCard } from "./MyPostCard";
import { getMyPosts } from "../_actions/postActions";

export async function MyPostsList({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = await searchParams;
  const result = await getMyPosts({ query });

  if (!result.success || !result.data?.length) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        You haven&apos;t created any posts yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {result.data.map((post: IPost | any) => (
        <MyPostCard key={post.id} post={post} />
      ))}
    </div>
  );
}