import { getMemberships } from "./api";

export const useMemberships = () => {
    return {
        data: getMemberships()
    }
}