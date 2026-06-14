import { AccessToken } from 'livekit-server-sdk';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const room = req.nextUrl.searchParams.get('room');
  const participantName = req.nextUrl.searchParams.get('participantName');
  const isPublisher = req.nextUrl.searchParams.get('isPublisher') === 'true';

  if (!room) {
    return NextResponse.json({ error: 'Missing "room" query parameter' }, { status: 400 });
  } else if (!participantName) {
    return NextResponse.json({ error: 'Missing "participantName" query parameter' }, { status: 400 });
  }

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

  if (!apiKey || !apiSecret || !wsUrl) {
    return NextResponse.json({ error: 'Server misconfigured: Missing LiveKit env variables' }, { status: 500 });
  }

  const at = new AccessToken(apiKey, apiSecret, {
    identity: participantName,
    name: participantName,
  });

  at.addGrant({
    roomJoin: true,
    room: room,
    canPublish: isPublisher,
    canSubscribe: true,
    canPublishData: isPublisher,
  });

  return NextResponse.json({ token: await at.toJwt() });
}
