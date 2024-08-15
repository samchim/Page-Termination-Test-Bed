import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    context: { params: { sessionId: string } },
): Promise<NextResponse> {
    console.log(
        `🤖 received POST /api/session_beforeunload/${context.params.sessionId} from sendBeacon during beforeunload event`,
    );

    return NextResponse.json({}, { status: 200 });
}
