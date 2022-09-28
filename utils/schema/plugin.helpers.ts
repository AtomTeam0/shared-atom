export const setPluginUsage = (
  skipCondition: boolean,
  skipPopulate: boolean,
  skipPatch: boolean
): void => {
  (<any>global).skipCondition = skipCondition;
  (<any>global).skipPopulate = skipPopulate;
  (<any>global).skipPatch = skipPatch;
};
