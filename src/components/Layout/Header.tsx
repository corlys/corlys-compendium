import { ConnectButton } from "@rainbow-me/rainbowkit";
import { NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import { useAccount } from "wagmi";
import { useEffect } from "react";

import SignInWithEthereum from "@/components/Buttons/SignInWithEthereum";
import { useIsMounted } from "@/hooks/index";

const Header: NextPage = () => {
  const { address, isConnected, status } = useAccount();
  const { mounted } = useIsMounted();
  useEffect(() => {
    console.log("zap ", isConnected);
  }, [isConnected]);
  return (
    <>
      <header className="sticky inset-x-0 top-0 w-full px-2 py-4 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src={"/blogging.png"} alt="logo" width={40} height={50} />
            <span className="inline">Blogogblog</span>
          </div>
          <div className="flex items-center justify-center gap-4">
            <Link href={"/"}>Home</Link>
            <Link href={"/blog"}>Blog</Link>
          </div>
          {mounted && isConnected ? <SignInWithEthereum /> : <ConnectButton />}
        </div>
      </header>
    </>
  );
};

export default Header;
