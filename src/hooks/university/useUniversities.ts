// @/hooks/university/useUniversities.js - Updated hook
import { useQuery } from "@tanstack/react-query";
import { useAxios } from "@/hooks/useAxios";

export const useUniversities = () => {
  const axios = useAxios();

  return useQuery({
    queryKey: ["universities"],
    queryFn: async () => {
      const { data } = await axios.get("/universities");
      console.log("Fetched:", data);
      return data;
    },
    enabled: true,
  });
};
