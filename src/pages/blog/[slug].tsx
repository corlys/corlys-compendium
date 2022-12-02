import { NextPage, GetServerSideProps } from "next";
import { useAuth } from "@/context/auth";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "@/config/cookie-config";
import { useRouter } from "next/router";
import { truncateAddress } from "@/helpers/index";

interface IPost {
  author: string;
  content: string;
  title: string;
}

interface IPostsResponse {
  result: IPost;
}

interface AuthProps {
  loggedAddress: string;
}

const Blog: NextPage<AuthProps> = ({ loggedAddress }) => {
  const router = useRouter();
  const { slug } = router.query;
  const { authState } = useAuth();

  const { data } = useQuery<IPostsResponse, Error>(
    ["posts", slug],
    () => fetchPost(slug),
    {
      enabled: !!authState.loggedInAddress && !!slug,
    }
  );

  const fetchPost = async (
    slug: string | string[] | undefined
  ): Promise<IPostsResponse> => {
    try {
      if (!authState.loggedInAddress || !slug)
        throw new Error("Input not yet ready");
      const getPosts = await axios.get<IPostsResponse>(`/api/posts/${slug}`);
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
          By{" "}
          <span className="text-purple-300">
            {truncateAddress(loggedAddress)}
          </span>
        </h1>
        <div className="relative w-full py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-b border-gray-300"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-4 text-sm text-gray-500">Post</span>
          </div>
        </div>
        {data && (
          <div className="whitespace-pre-wrap">{data.result.content}</div>
        )}
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
