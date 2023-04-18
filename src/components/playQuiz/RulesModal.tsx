import Modal from "@ui/Modal";
import { FC } from "react";

interface IProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const RulesModal: FC<IProps> = ({ open, setOpen }) => {
  return (
    <Modal open={open} setOpen={setOpen}>
      <div>Coming soon</div>
    </Modal>
  );
};

export default RulesModal;
