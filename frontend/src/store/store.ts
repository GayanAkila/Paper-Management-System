import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import submissionsReducer from "./slices/submissionSlice";
import commonReducer from "./slices/commonSlice";
import userReducer from "./slices/userSlice";
import settingsReducer from "./slices/settingsSlice";
import certificateReducer from "./slices/certificateSlice";
import lettersReducer from "./slices/letterSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    submissions: submissionsReducer,
    common: commonReducer,
    user: userReducer,
    settings: settingsReducer,
    certificate: certificateReducer,
    letters: lettersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
