import ExportSetting from "@/features/preference/components/ExportSetting";
import SidebarSetting from "@/features/preference/components/SidebarSetting";
import ThemeSetting from "@/features/preference/components/ThemeSetting";
import ToastSetting from "@/features/preference/components/ToastSetting";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col space-y-4">
      <ThemeSetting />
      <SidebarSetting />
      <ToastSetting />
      <ExportSetting />
    </div>
  );
}
