import { NextPage } from "next";

const BlogItemSkeleton: NextPage = () => {
  return (
    <>
      <div role="status" className="animate-pulse w-full p-8">
        <div className="mx-auto mb-2.5 h-2.5 max-w-[640px] rounded-full bg-gray-300 dark:bg-gray-700"></div>
        <div className="mx-auto h-2.5 max-w-[540px] rounded-full bg-gray-300 dark:bg-gray-700"></div>
        <div className="mt-4 flex items-center justify-center">
          <div className="mr-3 h-2.5 w-20 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-2 w-24 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    </>
  );
};

export default BlogItemSkeleton;
