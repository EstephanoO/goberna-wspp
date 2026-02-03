import { NextResponse } from "next/server";

import { addMessage } from "../_store/messages";

export const runtime = "nodejs";

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
  const formData = await request.formData();
  const body = String(formData.get("Body") ?? "");
  const from = normalizeWhatsApp(String(formData.get("From") ?? ""));
  const to = normalizeWhatsApp(String(formData.get("To") ?? ""));
  const sid = String(formData.get("MessageSid") ?? "");

  if (!body || !from || !to) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

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

  return NextResponse.json({ ok: true });
}
