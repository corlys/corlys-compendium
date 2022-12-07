import Link from "next/link";
import { NextPage } from "next";
import { useInfiniteQuery } from "@tanstack/react-query";
import { withIronSessionSsr } from "iron-session/next";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

import BlogItemSkeleton from "@/components/Skeletons/BlogItemSkeleton";
import axios from "@/config/axios-config";
import { useAuth } from "@/context/auth";
import { ironOptions } from "@/config/cookie-config";
import { truncateAddress } from "@/helpers/index";

interface IPost {
  author: string;
  content: string;
  title: string;
  slug: string;
  spoiler?: string;
}

interface IPostsResponse {
  posts: IPost[];
  lastId: string;
}

interface AuthProps {
  loggedAddress: string;
}

const Blog: NextPage<AuthProps> = ({ loggedAddress }) => {
  const { authState } = useAuth();
  const { ref, inView } = useInView();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useInfiniteQuery<IPostsResponse, Error>(
      ["posts"],
      ({ pageParam }) => fetchPosts(pageParam),
      {
        getNextPageParam: (lastPage) => lastPage.lastId ?? undefined,
        enabled: !!authState.loggedInAddress,
      }
    );

  const fetchPosts = async (
    pageParam = "firstPage"
  ): Promise<IPostsResponse> => {
    try {
      if (!authState.loggedInAddress) throw new Error("Input not yet ready");
      const getPosts = await axios.get<IPostsResponse>(
        `/api/posts?lastIdParam=${pageParam}`
      );
      return getPosts.data;
    } catch (error) {
      throw new Error("Network response not ok");
    }
  };

  useEffect(() => {
    if (inView) {
      if (!isFetching) fetchNextPage();
    }
  }, [inView]);

  return (
    <>
      <div className="container mx-auto flex flex-col items-center justify-center gap-4">
        {/* Heading Blog, welcome username */}
        <h1 className="text-2xl text-gray-700">
          Welcome{" "}
          <span className="text-purple-300">
            {truncateAddress(loggedAddress)}
          </span>
        </h1>
        <div className="relative w-full py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-b border-gray-300"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-4 text-sm text-gray-500">Posts</span>
          </div>
        </div>
        {data &&
          data.pages.map((page) =>
            page.posts.map((item, key) => (
              <>
                <Link
                  href={`blog/${item.slug}`}
                  className="flex w-full max-w-[52rem] cursor-pointer flex-col items-start justify-between gap-4 overflow-hidden rounded border-2 border-cyan-900 p-8"
                  key={key}
                >
                  <h1 className="text-2xl md:text-[2rem]">{item.title}</h1>
                  <div>{item.spoiler ? item.spoiler : item.content}</div>
                  <div className="self-end">
                    By {truncateAddress(item.author)}
                  </div>
                </Link>
              </>
            ))
          )}
        {isFetchingNextPage && <BlogItemSkeleton />}
        {hasNextPage ? <div ref={ref}></div> : null}
      </div>
    </>
  );
};

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const loggedAddress = req.session.siwe?.address;
    if (!loggedAddress) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
    return {
      props: {
        loggedAddress,
      },
    };
  },
  ironOptions
);

export default Blog;
