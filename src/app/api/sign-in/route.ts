import { NextRequest, NextResponse } from "next/server";
import { UsersDAO } from "@/dao/UsersDAO"; // Adjust path as needed

export async function POST(req: NextRequest) {
 const { name, email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }
  const upsertResult = await UsersDAO.upsertUser({
    name: name ?? "",
    email: email,
  });
  if (upsertResult.isErr()) {
    console.error(`Error upserting user: ${upsertResult.error.message}`);
    return NextResponse.json(
      { error: "Failed to upsert user" },
      { status: 500 }
    );
  }
  return NextResponse.json({userId: upsertResult.value})
}
