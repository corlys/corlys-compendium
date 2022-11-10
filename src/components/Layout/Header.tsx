import { ConnectButton } from "@rainbow-me/rainbowkit";
import { NextPage } from "next";
import Image from "next/image";

const Header: NextPage = () => {
  return (
    <>
      <header className="sticky inset-x-0 top-0 w-full px-2 py-4">
        <div className="mx-auto flex max-w-7xl flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src={"/blogging.png"} alt="logo" width={40} height={50} />
            <span className="inline">Blogogblog</span>
          </div>
          <div className="flex items-center justify-center gap-4">
            <div>Home</div>
            <div>Blog</div>
          </div>
          <ConnectButton />
        </div>
      </header>
    </>
  );
};

export default Header;
