import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    context: { params: { sessionId: string } },
): Promise<NextResponse> {
    console.log(
        `🤖 received POST /api/session_delete/${context.params.sessionId} from fetch during visibilitychange event`,
    );

    return NextResponse.json({}, { status: 200 });
}
