import { Checkbox } from "@/components/ui/checkbox";

export default function ScholarCareerSetUp() {
  return (
    <div className="border rounded-md p-5">
      <div className="w-full flex items-start space-x-1">
        <Checkbox />
        <div className="flex flex-col">
          <span>Scholar Career</span>
          <span className="text-sm text-muted">
            Tell them how scholar works salary...
          </span>
        </div>
      </div>
    </div>
  );
}
