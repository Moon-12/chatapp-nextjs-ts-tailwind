import { useDispatch } from "react-redux";
import type { AppDispatch } from "./store/store"; // wherever your store is

export const useAppDispatch: () => AppDispatch = useDispatch;
