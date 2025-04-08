import { useCallback, useState } from "react";
import classes from "./editable-input.module.css";
import { TextInput, TextInputProps } from "@mantine/core";

export default function EditableInput(props: TextInputProps) {
  const [editable, setEditable] = useState(true);

  const enableEditing = useCallback(() => {
    setEditable(true);
  }, []);

  const disableEditing = useCallback(() => {
    setEditable(false);
  }, []);

  return (
    <TextInput
      {...props}
      onBlur={(event) => {
        props.onBlur?.(event);
        if (!!props.value) {
          disableEditing();
        }
      }}
      onDoubleClick={enableEditing}
      contentEditable={editable}
      classNames={{ input: classes.input }}
    />
  );
}
