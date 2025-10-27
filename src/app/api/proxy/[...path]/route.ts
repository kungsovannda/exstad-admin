// import { NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Your NextAuth config

// export const dynamic = "force-dynamic";
// export const runtime = "nodejs";

// const BACKEND_API_URL =
//   process.env.BACKEND_API_URL || "https://api.exstad.tech/api/v1";

// const corsHeaders = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
//   "Access-Control-Allow-Headers": "Content-Type, X-Requested-With",
// };

// export async function OPTIONS() {
//   return new NextResponse(null, { status: 200, headers: corsHeaders });
// }

// async function handleRequest(req: NextRequest, method: string) {
//   const { pathname } = new URL(req.url);
//   const backendPath = pathname.replace("/api/proxy", "");
//   const backendUrl = `${BACKEND_API_URL}${backendPath}${req.nextUrl.search}`;

//   console.log(`Proxying ${method} request to:`, backendUrl);

//   try {
//     const headers = new Headers();

//     req.headers.forEach((value, key) => {
//       const lowerKey = key.toLowerCase();
//       if (
//         lowerKey !== "host" &&
//         lowerKey !== "connection" &&
//         lowerKey !== "authorization" &&
//         lowerKey !== "cookie" &&
//         !lowerKey.startsWith("cf-") &&
//         !lowerKey.startsWith("x-forwarded-")
//       ) {
//         headers.set(key, value);
//       }
//     });

//     const session = await getServerSession(authOptions);

//     if (session?.accessToken) {
//       headers.set("Authorization", `Bearer ${session.accessToken}`);
//       console.log("✅ Added Authorization from NextAuth session");
//     } else {
//       console.log("⚠️ No active session found");
//     }

//     const fetchOptions: RequestInit = {
//       method,
//       headers,
//       cache: "no-store",
//       signal: AbortSignal.timeout(30000),
//     };

//     if (["POST", "PUT", "PATCH"].includes(method)) {
//       const contentType = req.headers.get("content-type");

//       if (contentType?.includes("multipart/form-data")) {
//         fetchOptions.body = await req.blob();
//       } else if (contentType?.includes("application/json")) {
//         const body = await req.json();
//         fetchOptions.body = JSON.stringify(body);
//       } else {
//         fetchOptions.body = await req.text();
//       }
//     }

//     const response = await fetch(backendUrl, fetchOptions);

//     const responseHeaders = new Headers(corsHeaders);
//     const contentType = response.headers.get("content-type") || "";

//     if (contentType.includes("application/json")) {
//       const data = await response.json();
//       return NextResponse.json(data, {
//         status: response.status,
//         headers: responseHeaders,
//       });
//     } else {
//       const text = await response.text();
//       return new NextResponse(text, {
//         status: response.status,
//         headers: responseHeaders,
//       });
//     }
//   } catch (error) {
//     console.error("Proxy error:", error);
//     return NextResponse.json(
//       {
//         message: "Proxy error",
//         error: error instanceof Error ? error.message : "Unknown error",
//       },
//       { status: 502, headers: corsHeaders }
//     );
//   }
// }

// export async function GET(req: NextRequest) {
//   return handleRequest(req, "GET");
// }

// export async function POST(req: NextRequest) {
//   return handleRequest(req, "POST");
// }

// export async function PUT(req: NextRequest) {
//   return handleRequest(req, "PUT");
// }

// export async function PATCH(req: NextRequest) {
//   return handleRequest(req, "PATCH");
// }

// export async function DELETE(req: NextRequest) {
//   return handleRequest(req, "DELETE");
// }
