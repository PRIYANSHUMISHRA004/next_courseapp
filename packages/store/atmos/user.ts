import { atom } from "recoil";

interface UserState {
  userName: string | null;
  isLoading: boolean;
}

export const userState = atom<UserState>({
  key: "userState",
  default: {
    userName: null,
    isLoading: true,
  },
});