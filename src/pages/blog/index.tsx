import { NextPage, GetServerSideProps } from "next";
import { useAuth } from "@/context/auth";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "@/config/cookie-config";
import { truncateAddress } from "@/helpers/index";
import Link from "next/link";

interface IPost {
  author: string;
  content: string;
  title: string;
  slug: string;
}

interface IPostsResponse {
  result: IPost[];
}

interface AuthProps {
  loggedAddress: string;
}

const Blog: NextPage<AuthProps> = ({ loggedAddress }) => {
  const { authState } = useAuth();

  const { data } = useQuery<IPostsResponse, Error>(
    ["posts"],
    () => fetchPosts(),
    {
      enabled: !!authState.loggedInAddress,
    }
  );

  const fetchPosts = async (): Promise<IPostsResponse> => {
    try {
      if (!authState.loggedInAddress) throw new Error("Input not yet ready");
      const getPosts = await axios.get<IPostsResponse>("/api/posts");
      console.log(getPosts.data, "zap");
      return getPosts.data;
    } catch (error) {
      throw new Error("Network response not ok");
    }
  };

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
          data.result.map((item, key) => {
            return (
              <>
                <Link
                  href={`blog/${item.slug}`}
                  className="flex w-full max-w-[52rem] cursor-pointer flex-col items-start justify-between gap-4 overflow-hidden rounded border-2 border-cyan-900 p-8"
                  key={key}

                >
                  <h1 className="text-2xl md:text-[2rem]">{item.title}</h1>
                  <div>{item.content}</div>
                  <div className="self-end">
                    By {truncateAddress(item.author)}
                  </div>
                </Link>
              </>
            );
          })}
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
