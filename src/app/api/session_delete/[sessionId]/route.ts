import { NextResponse } from "next/server";

export async function DELETE(
    request: Request,
    context: { params: { sessionId: string } },
): Promise<NextResponse> {
    console.log(
        `🤖 received DELETE /api/session_delete/${context.params.sessionId}`,
    );

    return NextResponse.json({}, { status: 200 });
}
