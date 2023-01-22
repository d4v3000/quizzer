import {
  ChatBubbleLeftRightIcon,
  MapPinIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { FC } from "react";

interface IProps {
  type: string;
}

const IconTypes: FC<IProps> = ({ type }) => {
  switch (type) {
    case "question":
      return <ChatBubbleLeftRightIcon className="h-6 w-6 stroke-2" />;
    case "location":
      return <MapPinIcon className="h-6 w-6 stroke-2" />;
    case "guessing":
      return <QuestionMarkCircleIcon className="h-6 w-6 stroke-2" />;
    default:
      return <></>;
  }
};

export default IconTypes;
