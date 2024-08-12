import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
    const sessionId = Math.floor(Math.random() * 1e9);

    console.log(
        `🤖 received POST /api/session_create, sessionId: ${sessionId}`,
    );

    return NextResponse.json({ sessionId: sessionId }, { status: 200 });
}
