import { NextResponse } from "next/server";

// Service Worker Heat Beat Dead

export async function POST(
    request: Request,
    context: { params: { sessionId: string } },
): Promise<NextResponse> {
    console.log(
        `🤖 received POST /api/session_swhb_dead/${context.params.sessionId} from service worker found the heart beat is dead`,
    );

    return NextResponse.json({}, { status: 200 });
}
