import { NextPage } from "next";
import Button from "@/components/Buttons";
import { useAuth } from "@/context/auth";
import { useSignMessage } from "wagmi";

const SignInWithEthereum: NextPage = () => {
  const { signIn, refreshNonce } = useAuth();
  const { signMessageAsync } = useSignMessage();

  const handleSiwe = async () => {
    const siwe = await signIn();
    if (!siwe) return;

    const signature = await signMessageAsync({
      message: siwe.prepareMessage(),
    });

    await refreshNonce();
  };

  return (
    <>
      <Button onClickFunction={handleSiwe}>
        <div className="text-center text-sm font-medium text-white ">
          Sign In with Ethereum
        </div>
      </Button>
    </>
  );
};

export default SignInWithEthereum;
