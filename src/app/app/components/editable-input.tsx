import { useCallback, useState } from "react";
import classes from "./editable-input.module.css";
import { NumberInputProps, NumberInput } from "@mantine/core";

export default function EditableInput(props: NumberInputProps) {
  const [editable, setEditable] = useState(true);

  const enableEditing = useCallback(() => {
    setEditable(true);
  }, []);

  const disableEditing = useCallback(() => {
    setEditable(false);
  }, []);

  return (
    <NumberInput
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
      decimalScale={2}
      fixedDecimalScale
      hideControls
    />
  );
}
