import { Card } from "@heroui/card";
import { ReactElement } from "react";
import { RiInboxLine } from "react-icons/ri";

interface Props {
  title: string;
  subTitle: string;
  button?: ReactElement;
}

export default function EmptyComponents({ title, subTitle, button }: Props) {
  return (
    <Card
      shadow="none"
      className="w-full p-6 flex flex-col items-center justify-center gap-2"
    >
      <RiInboxLine className="w-12 h-12 text-default-400" />
      <p className="text-default-500 text-center">{title}</p>
      <p className="text-small text-default-400 text-center">{subTitle}</p>
      <div className="my-5">{button ?? button}</div>
    </Card>
  );
}
