import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAxios } from "@/hooks/useAxios";
import {
  University,
  UniversityCreate,
  UniversityUpdate,
} from "@/types/university";

export const universityKeys = {
  all: ["universities"] as const,
  lists: () => [...universityKeys.all, "list"] as const,
  list: (filters: string) => [...universityKeys.lists(), { filters }] as const,
  details: () => [...universityKeys.all, "detail"] as const,
  detail: (id: string) => [...universityKeys.details(), id] as const,
};

// Fetch all universities
export const useUniversities = () => {
  const axios = useAxios();

  return useQuery({
    queryKey: universityKeys.lists(),
    queryFn: async (): Promise<University[]> => {
      try {
        const { data } = await axios.get<{ universities: University[] }>(
          "/universities"
        );
        return data.universities;
      } catch (error) {
        console.error("Failed to fetch universities:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    refetchOnWindowFocus: false,
  });
};

export const useUniversity = (uuid: string) => {
  const axios = useAxios();

  return useQuery({
    queryKey: universityKeys.detail(uuid),
    queryFn: async (): Promise<University> => {
      try {
        const { data } = await axios.get<University>(`/universities/${uuid}`);
        return data;
      } catch (error) {
        console.error(`Failed to fetch university ${uuid}:`, error);
        throw error;
      }
    },
    enabled: !!uuid,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateUniversity = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      uuid,
      university,
    }: {
      uuid: string;
      university: UniversityUpdate;
    }): Promise<University> => {
      try {
        const { data } = await axios.patch<University>(
          `/universities/${uuid}`,
          university
        );
        return data;
      } catch (error) {
        console.error(`Failed to update university ${uuid}:`, error);
        throw error;
      }
    },
    onSuccess: (updatedUniversity, { uuid }) => {
      queryClient.setQueryData(universityKeys.detail(uuid), updatedUniversity);
      queryClient.setQueryData(
        universityKeys.lists(),
        (oldData: University[] | undefined) => {
          if (!oldData) return oldData;
          return oldData.map((uni) =>
            uni.uuid === uuid ? updatedUniversity : uni
          );
        }
      );
    },
    onError: (error) => {
      console.error("Failed to update university:", error);
    },
  });
};

export const useCreateUniversity = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      university: Omit<UniversityCreate, "uuid">
    ): Promise<University> => {
      try {
        const { data } = await axios.post<University>(
          "/universities",
          university
        );
        return data;
      } catch (error) {
        console.error("Failed to create university:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: universityKeys.lists() });
    },
    onError: (error) => {
      console.error("Failed to create university:", error);
    },
  });
};

export const useDeleteUniversity = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (uuid: string): Promise<void> => {
      try {
        await axios.delete(`/universities/${uuid}`);
      } catch (error) {
        console.error(`Failed to delete university ${uuid}:`, error);
        throw error;
      }
    },
    onSuccess: (_, deletedUuid) => {
      queryClient.removeQueries({
        queryKey: universityKeys.detail(deletedUuid),
      });

      queryClient.setQueryData(
        universityKeys.lists(),
        (oldData: University[] | undefined) => {
          if (!oldData) return oldData;
          return oldData.filter((uni) => uni.uuid !== deletedUuid);
        }
      );
    },
    onError: (error) => {
      console.error("Failed to delete university:", error);
    },
  });
};
