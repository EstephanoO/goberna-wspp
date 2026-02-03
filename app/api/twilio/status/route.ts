import { NextResponse } from "next/server";

import { addMessage } from "../../_store/messages";

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

export async function POST(request: Request) {
  const raw = await request.text();
  const params = new URLSearchParams(raw);

  const messageSid = params.get("MessageSid") ?? "";
  const messageStatus = params.get("MessageStatus") ?? "";
  const to = normalizeWhatsApp(params.get("To") ?? "");
  const from = normalizeWhatsApp(params.get("From") ?? "");

  if (messageSid && (to || from)) {
    addMessage({
      id: `status-${messageSid}`,
      from: to || from,
      to: from || to,
      body: `Estado: ${messageStatus || "actualizado"}`,
      direction: "inbound",
      time: new Date().toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
  }

  return NextResponse.json({ ok: true });
}
