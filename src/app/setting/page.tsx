import ExportSetting from "@/features/preference/components/ExportSetting";
import ThemeSetting from "@/features/preference/components/ThemeSetting";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col space-y-4">
      <ThemeSetting />
      <ExportSetting />
    </div>
  );
}
