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

const escapeXml = (value: string) => {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
};

export async function POST(request: Request) {
  const raw = await request.text();
  const params = new URLSearchParams(raw);

  const body = params.get("Body") ?? "";
  const from = normalizeWhatsApp(params.get("From") ?? "");
  const to = normalizeWhatsApp(params.get("To") ?? "");
  const sid = params.get("MessageSid") ?? "";

  if (body && from && to) {
    addMessage({
      id: sid || `in-${Date.now()}`,
      from,
      to,
      body,
      direction: "inbound",
      time: new Date().toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
  }

  const reply = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>Recibi: ${escapeXml(body)}</Message>
</Response>`;

  return new NextResponse(reply, {
    status: 200,
    headers: { "Content-Type": "text/xml" },
  });
}
