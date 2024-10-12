import { Spinner } from "@nextui-org/spinner";
import { Tabs, Tab } from "@nextui-org/tabs";
import { Key } from "react";

interface Props {
  tabs: { id: string; label: string }[];
  handleTabChange(key: Key): void;
  isPending: boolean;
  size: "sm" | "md" | "lg";
  variant: "solid" | "bordered" | "light" | "underlined";
}

export default function TabsSelect({
  tabs,
  handleTabChange,
  isPending,
  size,
  variant,
}: Props) {
  return (
    <div className={`${size === "lg" ? "max-w-xl" : "max-w-3xl"} w-full`}>
      <Tabs
        variant={variant}
        radius="full"
        aria-label="Status tabs"
        color={size === "lg" ? "primary" : "default"}
        size={size}
        fullWidth
        onSelectionChange={(key) => handleTabChange(key)}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            title={tab.label}
            className={`m-1 ${size === "lg" ? "p-5" : ""} rounded-3xl`}
          ></Tab>
        ))}
      </Tabs>
      {isPending && (
        <Spinner color="primary" className="self-center ml-3"></Spinner>
      )}
    </div>
  );
}
