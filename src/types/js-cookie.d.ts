declare module "js-cookie" {
  interface CookieAttributes {
    expires?: number | Date;
    path?: string;
    domain?: string;
    secure?: boolean;
    sameSite?: "lax" | "strict" | "none";
  }

  interface CookiesStatic {
    get(name: string): string | undefined;
    get(): Record<string, string>;
    set(name: string, value: string, attributes?: CookieAttributes): void;
    remove(name: string, attributes?: CookieAttributes): void;
  }

  const Cookies: CookiesStatic;
  export default Cookies;
}
