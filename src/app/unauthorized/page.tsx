"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { ShieldAlert } from "lucide-react";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const { hasRole, isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuthorization = async () => {
      if (user === undefined) {
        return;
      }

      if (isAuthenticated && hasRole(["INSTRUCTOR1", "ADMIN", "INSTRUCTOR2"])) {
        router.push("/");
      } else if (
        isAuthenticated &&
        !hasRole(["INSTRUCTOR1", "ADMIN", "INSTRUCTOR2"])
      ) {
        await signOut({ redirect: false });
        setIsChecking(false);
      } else {
        setIsChecking(false);
      }
    };

    checkAuthorization();
  }, [isAuthenticated, user, hasRole, router]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authorization...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br ">
      <div className="max-w-md w-full">
        <div className=" p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className=" p-4">
              <ShieldAlert className="w-12 h-12 text-red-600" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Access Denied</h1>
            <p className="text-gray-600">
              You don&apos;t have permission to access this page. Please sign in
              with an authorized account.
            </p>
          </div>

          <div className="inline-block bg-gray-100 rounded-md px-4 py-2">
            <span className="text-sm font-mono text-gray-500">
              Error: 401 Unauthorized
            </span>
          </div>

          <div className="space-y-3 pt-4">
            <Button size={"lg"} onClick={() => signIn()} className="w-full">
              Sign In with Authorized Account
            </Button>
          </div>
        </div>
        <p className="text-center text-sm text-gray-500 mt-6">
          Need help? Contact your administrator
        </p>
      </div>
    </div>
  );
}
