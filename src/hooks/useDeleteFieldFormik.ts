import { useFormikContext } from "formik";
import cloneDeep from "lodash.clonedeep";
import { useCallback } from "react";

export function useDeleteFieldFormik() {
  const { setFormikState } = useFormikContext<{ [key: string]: string | number | string[] | number[] }>();

  const remove = useCallback(
    (fieldOrFields: string | string[]) => {
      setFormikState((state) => {
        const newState = cloneDeep(state);
        if (Array.isArray(fieldOrFields)) {
          fieldOrFields.forEach((field) => {
            delete newState.values[field];
            delete newState.touched[field];
            delete newState.errors[field];
          });
        } else {
          delete newState.values[fieldOrFields];
          delete newState.touched[fieldOrFields];
          delete newState.errors[fieldOrFields];
        }
        return newState;
      });
    },
    [setFormikState]
  );

  return remove;
}
