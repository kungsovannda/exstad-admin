import { Preference } from "@/types/preference";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: Preference = {
  export: {
    font: "Battambang",
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
