import { NextResponse } from "next/server";
import twilio from "twilio";
import { addMessage } from "../_store/messages";

export const runtime = "nodejs";

type SendPayload = {
  message?: string;
  recipients?: string[];
};

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
  const payload = (await request.json()) as SendPayload;
  const message = payload.message?.trim();
  const recipients = payload.recipients ?? [];

  if (!message) {
    return NextResponse.json(
      { error: "Mensaje vacío." },
      { status: 400 }
    );
  }

  if (!Array.isArray(recipients) || recipients.length === 0) {
    return NextResponse.json(
      { error: "No hay destinatarios." },
      { status: 400 }
    );
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM ?? "whatsapp:+14155238886";

  if (!accountSid || !authToken) {
    return NextResponse.json(
      { error: "Twilio no está configurado en el servidor." },
      { status: 500 }
    );
  }

  const client = twilio(accountSid, authToken);
  const results = await Promise.allSettled(
    recipients.map((to) =>
      client.messages.create({
        from,
        to: normalizeWhatsApp(to),
        body: message,
      })
    )
  );

  const sent = results.filter((result) => result.status === "fulfilled");
  const failed = results
    .filter((result) => result.status === "rejected")
    .map((result) =>
      result.status === "rejected" ? result.reason?.message ?? "Error" : ""
    );

  sent.forEach((result, index) => {
    if (result.status !== "fulfilled") {
      return;
    }
    const to = normalizeWhatsApp(recipients[index] ?? "");
    if (!to) {
      return;
    }
    addMessage({
      id: result.value.sid,
      from,
      to,
      body: message,
      direction: "outbound",
      time: new Date().toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
  });

  return NextResponse.json({
    sent: sent.length,
    failed,
  });
}
