import { useGetAllProvincesQuery } from "@/features/province/provinceApi";
import { Option } from "@/types/data-table";

export const useProvinceFilterOptions = (): Option[] => {
  const { data } = useGetAllProvincesQuery();

  const options: Option[] =
    data?.map((province) => ({
      label: province.englishName,
      value: province.englishName,
    })) ?? [];

  return options;
};
