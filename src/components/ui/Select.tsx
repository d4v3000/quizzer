import * as RadixSelect from "@radix-ui/react-select";
import { FC, ReactNode } from "react";

interface IProps {
  value: string;
  onValueChange: (value: string) => void;
  items: string[];
  icon?: ReactNode;
}

interface ItemProps {
  value: string;
}

const Select: FC<IProps> = ({ value, onValueChange, items, icon }) => {
  return (
    <RadixSelect.Root value={value} onValueChange={onValueChange}>
      <RadixSelect.Trigger className="h-full w-28 rounded-md p-2 hover:bg-zinc-700">
        <div className="flex items-center justify-center gap-4">
          <RadixSelect.Value aria-label={value}>{value}</RadixSelect.Value>
          {icon && <RadixSelect.Icon>{icon}</RadixSelect.Icon>}
        </div>
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content
          position="popper"
          sideOffset={6}
          className="w-28 rounded-md bg-zinc-800 p-2 text-zinc-200"
        >
          <RadixSelect.Viewport>
            {items.map((item, i) => (
              <SelectItem value={item} key={"selectItem_" + i} />
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
};

const SelectItem: FC<ItemProps> = ({ value }) => {
  return (
    <RadixSelect.Item
      value={value}
      className="cursor-pointer rounded-md p-2 hover:bg-zinc-700"
    >
      <RadixSelect.ItemText>{value}</RadixSelect.ItemText>
    </RadixSelect.Item>
  );
};

export default Select;
