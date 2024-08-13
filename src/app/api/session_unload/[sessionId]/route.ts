import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    context: { params: { sessionId: string } },
): Promise<NextResponse> {
    console.log(
        `🤖 received POST /api/session_unload/${context.params.sessionId} from sendBeacon during unload event`,
    );

    return NextResponse.json({}, { status: 200 });
}
