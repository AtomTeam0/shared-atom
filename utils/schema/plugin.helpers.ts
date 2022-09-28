export const setPluginUsage = (options: {
  skipCondition?: boolean;
  skipPopulate?: boolean;
  skipPatch?: boolean;
}): void => {
  (<any>global).skipCondition =
    options.skipCondition !== undefined
      ? options.skipCondition
      : (<any>global).skipCondition;
  (<any>global).skipPopulate =
    options.skipPopulate !== undefined
      ? options.skipPopulate
      : (<any>global).skipPopulate;
  (<any>global).skipPatch =
    options.skipPatch !== undefined
      ? options.skipPatch
      : (<any>global).skipPatch;
};
