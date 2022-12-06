import { NextPage } from "next";
import Button from "@/components/Buttons";
import { useAuth } from "@/context/auth";
import { useSignMessage } from "wagmi";

const SignInWithEthereum: NextPage = () => {
  const { doSiwe, signIn } = useAuth();
  const { signMessageAsync } = useSignMessage();

  const handleSiwe = async () => {
    const siwe = await doSiwe();
    if (!siwe) return;

    const signature = await signMessageAsync({
      message: siwe.prepareMessage(),
    });

    await signIn(signature, siwe);
  };

  return (
    <>
      <Button onClickFunction={handleSiwe}>
        <div className="text-center text-sm font-medium text-white ">
          SIWΞ
        </div>
      </Button>
    </>
  );
};

export default SignInWithEthereum;
