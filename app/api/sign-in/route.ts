import { NextRequest, NextResponse } from "next/server";
import { auth } from ""; // Import NextAuth session helper
import { UsersDAO } from "@/dao/UsersDAO"; // Adjust path as needed

export async function GET(req: NextRequest) {
  const session = await auth(); // Get the logged-in user
  if (!session || !session.user?.email) {
    return NextResponse.redirect(new URL("/login", req.url)); // Redirect if no session
  }

  // Insert or update user in DB
  const upsertResult = await UsersDAO.upsertUser({
    name: session.user.name || "",
    email: session.user.email,
    profilePicture: session.user.image || "",
  });

  if (upsertResult.isErr()) {
    console.error(`Error upserting user: ${upsertResult.error.message}`);
    return NextResponse.redirect(new URL("/error", req.url)); // Redirect to error page
  }

  return NextResponse.redirect(new URL("/dashboard", req.url)); // Redirect to dashboard
}
