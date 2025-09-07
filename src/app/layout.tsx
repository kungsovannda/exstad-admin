import type { Metadata, Viewport } from "next";
import { Inter, Kantumruy_Pro } from "next/font/google";
import "./globals.css";
import AuthProvider from "../components/layout/AuthProvider";
import LayoutWrapper from "../components/layout/LayoutWrapper";
import ReactQueryProvider from "../components/layout/ReactQueryProvider";
import { cookies } from "next/headers";
import "./theme.css";
import { cn } from "@/lib/utils";
import ThemeProvider from "@/components/layout/theme-toggle/ThemeProvider";
import { ActiveThemeProvider } from "@/components/active-theme";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const koh = Kantumruy_Pro({
  variable: "--font-koh",
  weight: "500",
  subsets: ["khmer"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard",
};

const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
};

export const viewport: Viewport = {
  themeColor: META_THEME_COLORS.light,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const activeThemeValue = cookieStore.get("active_theme")?.value;
  const isScaled = activeThemeValue?.endsWith("-scaled");

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body
        className={cn(
          "bg-background font-sans antialiased",
          activeThemeValue ? `theme-${activeThemeValue}` : "",
          isScaled ? "theme-scaled" : "",
          `${inter.variable} ${koh.variable}`
        )}
      >
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            enableColorScheme
          >
            <ActiveThemeProvider>
              <ReactQueryProvider>
                {/* <Suspense fallback={<Loader />}> */}
                <LayoutWrapper>
                  {children}
                  <Toaster />
                </LayoutWrapper>
                {/* </Suspense> */}
              </ReactQueryProvider>
            </ActiveThemeProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
