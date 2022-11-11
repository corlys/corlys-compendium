import { NextPage } from "next";
import Button from "@/components/Buttons";
import { useAuth } from "@/context/auth";

const Logout: NextPage = () => {
  const { signOut } = useAuth();
  return (
    <>
      <Button onClickFunction={signOut}>
        <div className="text-center text-sm font-medium text-white ">
          Logout
        </div>
      </Button>
    </>
  );
};

export default Logout;
