import { NextResponse } from "next/server";

import { listMessages } from "../_store/messages";

const normalizeWhatsApp = (input: string) => {
  const trimmed = input.trim();
  if (!trimmed) {
    return "";
  }
  if (trimmed.startsWith("whatsapp:")) {
    return trimmed;
  }
  return `whatsapp:${trimmed}`;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const toParam = searchParams.get("to") ?? "+51955135507";
  const to = normalizeWhatsApp(toParam);

  const messages = listMessages()
    .filter((message) => message.from === to || message.to === to)
    .map((message) => ({
      id: message.id,
      from: message.direction === "outbound" ? "me" : "them",
      text: message.body,
      time: message.time,
    }));

  return NextResponse.json({ messages });
}
