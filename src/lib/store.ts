import { certificateApi } from "@/features/certificate/certificateApi";
import { currentAddressApi } from "@/features/current-address/currentAddressApi";
import { requiementApi } from "@/features/master-program/components/course-requirement/requirementsApi";
import { curriculumApi } from "@/features/master-program/components/curriculum/curriculumApi";
import { faqApi } from "@/features/master-program/components/faq/faqApi";
import { highlightsApi } from "@/features/master-program/components/highlight/highlightApi";
import { learningOutcomesApi } from "@/features/master-program/components/learningoutcomes/learningOutcomesApi";
import { masterprogramApi } from "@/features/master-program/masterProgramApi";
import { openingProgramApi } from "@/features/opening-program/openingProgramApi";
import { provinceApi } from "@/features/province/provinceApi";
import { universityApi } from "@/features/university/universityApi";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
  [currentAddressApi.reducerPath]: currentAddressApi.reducer,
  [provinceApi.reducerPath]: provinceApi.reducer,
  [universityApi.reducerPath]: universityApi.reducer,
  [certificateApi.reducerPath]: certificateApi.reducer,
  [masterprogramApi.reducerPath]: masterprogramApi.reducer,
  [highlightsApi.reducerPath]: highlightsApi.reducer,
  [faqApi.reducerPath]: faqApi.reducer,
  [requiementApi.reducerPath]: requiementApi.reducer,
  [learningOutcomesApi.reducerPath]: learningOutcomesApi.reducer,
  [curriculumApi.reducerPath]: curriculumApi.reducer,
  [openingProgramApi.reducerPath]: openingProgramApi.reducer,
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
        masterprogramApi.middleware,
        highlightsApi.middleware, 
        faqApi.middleware,
        requiementApi.middleware,
        learningOutcomesApi.middleware,
        curriculumApi.middleware,
        openingProgramApi.middleware,
      ),
  });

  const persistor = persistStore(store);
  return { store, persistor };
};

export type AppStore = ReturnType<typeof makeStore>["store"];
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
