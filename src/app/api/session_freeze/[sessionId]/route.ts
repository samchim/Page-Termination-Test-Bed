import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    context: { params: { sessionId: string } },
): Promise<NextResponse> {
    console.log(
        `🤖 received POST /api/session_freeze/${context.params.sessionId} from sendBeacon during freeze event`,
    );

    return NextResponse.json({}, { status: 200 });
}
