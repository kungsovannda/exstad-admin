import { certificateApi } from "@/features/certificate/certificateApi";
import { currentAddressApi } from "@/features/current-address/currentAddressApi";
import { provinceApi } from "@/features/province/provinceApi";
import { scholarApi } from "@/features/scholar/scholarApi";
import { universityApi } from "@/features/university/universityApi";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
  [currentAddressApi.reducerPath]: currentAddressApi.reducer,
  [provinceApi.reducerPath]: provinceApi.reducer,
  [universityApi.reducerPath]: universityApi.reducer,
  [certificateApi.reducerPath]: certificateApi.reducer,
  [scholarApi.reducerPath]: scholarApi.reducer,
});

const persistConfig = {
  key: "root",
  storage,
  blacklist: [currentAddressApi.reducerPath, provinceApi.reducerPath], // optional
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }).concat(
        currentAddressApi.middleware,
        provinceApi.middleware,
        universityApi.middleware,
        certificateApi.middleware,
        scholarApi.middleware
      ),
  });

  const persistor = persistStore(store);
  return { store, persistor };
};

export type AppStore = ReturnType<typeof makeStore>["store"];
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
