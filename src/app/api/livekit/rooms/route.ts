import { RoomServiceClient } from 'livekit-server-sdk';
import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

  if (!apiKey || !apiSecret || !wsUrl) {
    return NextResponse.json({ error: 'Server misconfigured: Missing LiveKit env variables' }, { status: 500 });
  }

  // RoomServiceClient needs the HTTP URL to make REST API calls
  const httpUrl = wsUrl.replace('wss://', 'https://').replace('ws://', 'http://');

  const roomService = new RoomServiceClient(httpUrl, apiKey, apiSecret);

  try {
    // Fetch all currently active rooms from LiveKit Cloud
    const rooms = await roomService.listRooms();
    return NextResponse.json({ rooms });
  } catch (err: any) {
    console.error("Failed to list LiveKit rooms:", err);
    return NextResponse.json({ error: err.message || 'Failed to list rooms' }, { status: 500 });
  }
}
