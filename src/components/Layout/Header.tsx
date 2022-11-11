import { ConnectButton } from "@rainbow-me/rainbowkit";
import { NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import { useAccount } from "wagmi";

import SignInWithEthereum from "@/components/Buttons/SignInWithEthereum";
import LogoutButton from "@/components/Buttons/Logout";
import { useIsMounted } from "@/hooks/index";
import { useAuth } from "@/context/auth";
import { useEffect } from "react";

const Header: NextPage = () => {
  const { address, isConnected, status } = useAccount();
  const { authState } = useAuth();
  const { mounted } = useIsMounted();
  // useEffect(() => {
  //   console.log('zap authState', authState.loggedInAddress)
  // }, [authState])
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
          {mounted && isConnected ? (
            <div>
              {authState.loggedInAddress === address && <LogoutButton />}
              {authState.loggedInAddress === null && <SignInWithEthereum />}
            </div>
          ) : (
            <ConnectButton />
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
