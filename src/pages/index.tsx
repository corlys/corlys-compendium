import { type NextPage } from "next";
import Link from "next/link";
import Image from "next/image";

const Home: NextPage = () => {
  return (
    <>
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="text-5xl font-extrabold leading-normal text-gray-700 md:text-[5rem]">
          <span className="text-purple-300">Willkommen</span> Freund
        </h1>
        <Image src={"/welcome.png"} alt="welcome_image" height={512} width={500} />
      </div>
    </>
  );
};

export default Home;