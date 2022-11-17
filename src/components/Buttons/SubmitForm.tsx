import { NextPage } from "next";
import Button from "@/components/Buttons";

type SubmitProps = {
  text: string;
};

const SubmitForm: NextPage<SubmitProps> = ({ text }) => {
  return (
    <>
      <Button submitButton={true}>
        <div className="text-center text-sm font-medium text-white ">
          {text}
        </div>
      </Button>
    </>
  );
};

export default SubmitForm;
