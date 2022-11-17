import { NextPage } from "next";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAccount } from "wagmi";
import SubmitForm from "@/components/Buttons/SubmitForm";
import { useAuth } from "@/context/auth";
import axios from "axios";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "@/config/cookie-config";

type formInput = {
  title: string;
  content: string;
};

const Create: NextPage = () => {
  const { authState } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<formInput>({
    defaultValues: {
      content: "",
      title: "",
    },
  });
  const { address } = useAccount();
  const onSubmit: SubmitHandler<formInput> = async (data) => {
    if (authState.loggedInAddress !== address) return;
    await axios.post("/api/posts/create", {
      ...data,
      author: address,
    });
  };

  return (
    <>
      <div className="container mx-auto flex flex-col items-center justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full max-w-[52rem] flex-col gap-2 py-8 px-12"
        >
          <div className="flex flex-col justify-center gap-2">
            <label
              htmlFor="post_title"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Title
            </label>
            <input
              {...register("title", { required: true })}
              type="text"
              id="post_title"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>
          <div className="mt-4 flex flex-col justify-center gap-2">
            <label htmlFor="post">Write Your Thoughts</label>
            <textarea
              {...register("content", { required: true })}
              id="post"
              rows={4}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="Write your thoughts here..."
            ></textarea>
          </div>
          <div className="mt-2 self-end">
            <SubmitForm text="Submit Post" />
          </div>
        </form>
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

export default Create;
