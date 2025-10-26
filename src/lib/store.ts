import { badgeApi } from "@/features/badge/badgeApi";
import { certificateApi } from "@/features/certificate/certificateApi";
import { currentAddressApi } from "@/features/current-address/currentAddressApi";
import { curriculumApi } from "@/features/master-program/components/curriculum/curriculumApi";
import { faqApi } from "@/features/master-program/components/faq/faqApi";
import { highlightsApi } from "@/features/master-program/components/highlight/highlightApi";
import { learningOutcomesApi } from "@/features/master-program/components/learningoutcomes/learningOutcomesApi";
import { programOverviewsApi } from "@/features/master-program/components/programOverview/programOverviewApi";
import { masterprogramApi } from "@/features/master-program/masterProgramApi";
import { activityApi } from "@/features/opening-program/components/activity/activityApi";
import { classApi } from "@/features/opening-program/components/class/classApi";
import { TimelineApi } from "@/features/opening-program/components/timeline/timelineApi";
import { documentApi } from "@/features/document/documentApi";
import { openingProgramApi } from "@/features/opening-program/openingProgramApi";
import { provinceApi } from "@/features/province/provinceApi";
import { scholarApi } from "@/features/scholar/scholarApi";
import { universityApi } from "@/features/university/universityApi";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { requiementApi } from "@/features/master-program/components/course-requirement/requirementsApi";
import { documentAccessApi } from "@/features/document/documentAccessApi";
import { scholarBadgeApi } from "@/features/scholar-badge/scholarBadgeApi";
import { achievementApi } from "@/features/achievement/achievementApi";
import { scholarAchievementApi } from "@/features/scholar-achievement/scholarAchievementApi";
import { userApi } from "@/features/user/userApi";
import { enrollmentApi } from "@/features/enrollment/enrollmentApi";
import { ScholarClassApi } from "@/features/opening-program/components/scholar-class.tsx/scholarClassApi";
import { InstructorClassApi } from "@/features/opening-program/components/instructor-class/instructorClassApi";
import { roadmapApi } from "@/features/master-program/components/roadmap/save-roadmap-api";
import preferenceReducer from "@/features/preference/preferenceSlice";
import { technologyApi } from "@/features/master-program/components/technology/technologyApi";
import { applicantLetterApi } from "@/features/application/applicationApi";

const rootReducer = combineReducers({
  [currentAddressApi.reducerPath]: currentAddressApi.reducer,
  [provinceApi.reducerPath]: provinceApi.reducer,
  [universityApi.reducerPath]: universityApi.reducer,
  [certificateApi.reducerPath]: certificateApi.reducer,
  [scholarApi.reducerPath]: scholarApi.reducer,
  [badgeApi.reducerPath]: badgeApi.reducer,
  [documentApi.reducerPath]: documentApi.reducer,
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
  [documentAccessApi.reducerPath]: documentAccessApi.reducer,
  [scholarBadgeApi.reducerPath]: scholarBadgeApi.reducer,
  [achievementApi.reducerPath]: achievementApi.reducer,
  [scholarAchievementApi.reducerPath]: scholarAchievementApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [enrollmentApi.reducerPath]: enrollmentApi.reducer,
  [ScholarClassApi.reducerPath]: ScholarClassApi.reducer,
  [InstructorClassApi.reducerPath]: InstructorClassApi.reducer,
  [roadmapApi.reducerPath]: roadmapApi.reducer,
  [technologyApi.reducerPath]: technologyApi.reducer,
  [applicantLetterApi.reducerPath]: applicantLetterApi.reducer,
  preference: preferenceReducer,
});

const persistConfig = {
  key: "root",
  storage,
  blacklist: [currentAddressApi.reducerPath, provinceApi.reducerPath], // optional
  whitelist: ["preference"],
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
        scholarApi.middleware,
        badgeApi.middleware,
        documentApi.middleware,
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
        documentAccessApi.middleware,
        scholarBadgeApi.middleware,
        achievementApi.middleware,
        scholarAchievementApi.middleware,
        userApi.middleware,
        enrollmentApi.middleware,
        ScholarClassApi.middleware,
        InstructorClassApi.middleware,
        roadmapApi.middleware,
        technologyApi.middleware,
        applicantLetterApi.middleware
      ),
  });

  const persistor = persistStore(store);
  return { store, persistor };
};

export type AppStore = ReturnType<typeof makeStore>["store"];
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
