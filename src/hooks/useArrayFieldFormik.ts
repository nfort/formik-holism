import { useFormikContext } from "formik";
import { useCallback } from "react";

export function useArrayFieldFormik<Values extends { [key: string]: string[] }>(name: string) {
  const { values, setFieldValue, setFieldTouched } = useFormikContext<Values>();
  let value: string[];

  if (values) {
    value = values[name];
  } else {
    throw new Error("Field in formik doesn't exist");
  }

  const updater = useCallback(
    (newValue: string) => {
      const copyValue = [...value];
      if (copyValue.includes(newValue)) {
        copyValue.splice(copyValue.indexOf(newValue));
      } else {
        copyValue.push(newValue);
      }
      setFieldValue(name, copyValue, false);
      setFieldTouched(name, true, false);
    },
    [setFieldValue, setFieldTouched]
  );

  return [value, updater] as const;
}
