import { useQuery } from "@tanstack/react-query";
import { useAxios } from "@/hooks/useAxios";
import { Province } from "@/types/province";

export const provinceKeys = {
  all: ["provinces"] as const,
  lists: () => [...provinceKeys.all, "list"] as const,
  list: (filters: string) => [...provinceKeys.lists(), { filters }] as const,
  details: () => [...provinceKeys.all, "detail"] as const,
  detail: (id: string) => [...provinceKeys.details(), id] as const,
};

export const useProvinces = () => {
  const axios = useAxios();

  return useQuery({
    queryKey: provinceKeys.lists(),
    queryFn: async (): Promise<Province[]> => {
      try {
        const { data } = await axios.get<{ provinces: Province[] }>(
          "/provinces"
        );
        return data.provinces;
      } catch (error) {
        console.error("Failed to fetch provinces:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 3,
    refetchOnWindowFocus: false,
  });
};
