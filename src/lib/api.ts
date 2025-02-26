import {err, ok, Result} from "neverthrow";

type NonNullableFields<T> = {
  [K in keyof T]: Exclude<T[K], null | undefined>;
};

export const validateArgs = <T extends Record<string, unknown>> (args:T)
  : Result<NonNullableFields<T>, Error> => {
  const invalidArgs = Object.entries(args).reduce((acc, [key, value])=> {
    if (value==null) {
      acc[key] = value;
    }
    return acc
  }, {} as Record<string, unknown>);
  if (Object.keys(invalidArgs).length > 0) {
    return err(new Error(`Invalid arguments: ${JSON.stringify(invalidArgs)}`));
  }
  return ok(args as NonNullableFields<T>);
}