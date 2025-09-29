import { badgeApi } from "@/features/badge/badgeApi";
import { certificateApi } from "@/features/certificate/certificateApi";
import { currentAddressApi } from "@/features/current-address/currentAddressApi";
<<<<<<< HEAD
import { documentApi } from "@/features/document/documentApi";
=======
import { requiementApi } from "@/features/master-program/components/course-requirement/requirementsApi";
import { curriculumApi } from "@/features/master-program/components/curriculum/curriculumApi";
import { faqApi } from "@/features/master-program/components/faq/faqApi";
import { highlightsApi } from "@/features/master-program/components/highlight/highlightApi";
import { learningOutcomesApi } from "@/features/master-program/components/learningoutcomes/learningOutcomesApi";
import { programOverviewsApi } from "@/features/master-program/components/programOverview/programOverviewApi";
import { masterprogramApi } from "@/features/master-program/masterProgramApi";
import { activityApi } from "@/features/opening-program/components/activity/activityApi";
import { classApi } from "@/features/opening-program/components/class/classApi";
import { TimelineApi } from "@/features/opening-program/components/timeline/timelineApi";
import { openingProgramApi } from "@/features/opening-program/openingProgramApi";
>>>>>>> 5f0ef0667ac213d4f482bcb15acb906fce93c8a9
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
<<<<<<< HEAD
  [scholarApi.reducerPath]: scholarApi.reducer,
  [badgeApi.reducerPath]: badgeApi.reducer,
  [documentApi.reducerPath]: documentApi.reducer,
=======
  [masterprogramApi.reducerPath]: masterprogramApi.reducer,
  [highlightsApi.reducerPath]: highlightsApi.reducer,
  [faqApi.reducerPath]: faqApi.reducer,
  [requiementApi.reducerPath]: requiementApi.reducer,
  [learningOutcomesApi.reducerPath]: learningOutcomesApi.reducer,
  [curriculumApi.reducerPath]: curriculumApi.reducer,
  [openingProgramApi.reducerPath]: openingProgramApi.reducer,
  [classApi.reducerPath]: classApi.reducer,
  [programOverviewsApi.reducerPath]: programOverviewsApi.reducer,
  [activityApi.reducerPath]: activityApi.reducer,
  [TimelineApi.reducerPath]: TimelineApi.reducer,
>>>>>>> 5f0ef0667ac213d4f482bcb15acb906fce93c8a9
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
<<<<<<< HEAD
        scholarApi.middleware,
        badgeApi.middleware,
        documentApi.middleware
=======
        masterprogramApi.middleware,
        highlightsApi.middleware, 
        faqApi.middleware,
        requiementApi.middleware,
        learningOutcomesApi.middleware,
        curriculumApi.middleware,
        openingProgramApi.middleware,
        classApi.middleware,
        programOverviewsApi.middleware,
        activityApi.middleware,
        TimelineApi.middleware,
>>>>>>> 5f0ef0667ac213d4f482bcb15acb906fce93c8a9
      ),
  });

  const persistor = persistStore(store);
  return { store, persistor };
};

export type AppStore = ReturnType<typeof makeStore>["store"];
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
