import Button from "../Button/Button";
import "./ImportDialog.css";
import React, { FC, useRef } from "react";

interface Props extends React.DialogHTMLAttributes<HTMLDialogElement> {
  open: boolean;
  setOpen: (open: boolean) => void;
  runOnSubmit: (data: string) => {
    error: string | null;
  };
}

const ImportDialog: FC<Props> = ({ open, setOpen, runOnSubmit }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [error, setError] = React.useState<string>("");

  if (open) {
    dialogRef.current?.showModal();
  } else {
    dialogRef.current?.close();
  }

  dialogRef.current?.addEventListener("close", () => {
    setOpen(false);
  });

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const textarea = event.currentTarget.querySelector(
      "textarea"
    )! as HTMLTextAreaElement;
    const data = textarea.value;
    // return if no input
    if (data.trim() === "") return;

    const processData = runOnSubmit(data);
    // early return if runOnSubmit returns true
    if (processData.error === null) {
      dialogRef.current?.close();
      setError("");
      textarea.value = "";
      return;
    }
    // else add error
    setError(processData.error);
  };

  const onCancel = () => {
    dialogRef.current?.close();
  };

  return (
    <dialog ref={dialogRef} className="importDialog">
      <h1>Paste JSON to import</h1>
      <form method="dialog" onSubmit={onSubmit}>
        <textarea className={error && "invalid"}></textarea>
        {error && <p className="errorMessage">{error}</p>}
        <Button onClick={onCancel}>Cancel</Button>
        <Button variant="primary" type="submit">
          Import
        </Button>
      </form>
    </dialog>
  );
};

export default ImportDialog;
