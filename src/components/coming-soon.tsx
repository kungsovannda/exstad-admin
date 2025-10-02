import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ComingSoon() {
  return (
    <div className="h-content flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-lg">
        <CardContent className="p-8">
          {/* Main Content */}
          <div className="text-center space-y-6">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">
                Coming Soon
              </span>
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h2 className="text-3xl font-bold ">
                Something amazing is on the way
              </h2>
              <p className="text-slate-600">
                We're working hard to bring you an incredible dashboard
                experience. Stay tuned for the launch!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
