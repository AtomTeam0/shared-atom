import {isArray, isEmpty} from "lodash/fp";

export const atLeastOneInArray = <T>(array: T[]) => {
    return isArray(array) && !isEmpty(array);
}