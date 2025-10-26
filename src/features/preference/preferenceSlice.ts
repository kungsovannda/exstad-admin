import { Preference } from "@/types/preference";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: Preference = {
  sidebar: {
    parent: {
      defaultOpen: true,
    },
    child: {
      delay: 3000,
    },
  },
  toast: {
    expand: false,
    duration: 3000,
    position: "top-right",
  },
  export: {
    header: {
      font: "Kantumruy Pro",
      size: 12,
    },
    content: {
      font: "Kantumruy Pro",
      size: 11,
    },
  },
};

const preferenceSlice = createSlice({
  name: "preference",
  initialState,
  reducers: {
    updatePreference: (state, action: PayloadAction<Preference>) => {
      return { ...action.payload };
    },
  },
});

export const { updatePreference } = preferenceSlice.actions;
export default preferenceSlice.reducer;
