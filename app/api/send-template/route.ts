import { NextResponse } from "next/server";
import twilio from "twilio";

export const runtime = "nodejs";

type SendTemplatePayload = {
  to?: string;
  contentSid?: string;
  contentVariables?: Record<string, string>;
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
  const payload = (await request.json()) as SendTemplatePayload;
  const to = normalizeWhatsApp(payload.to ?? "+51955135507");
  const contentSid = payload.contentSid ?? "HXb5b62575e6e4ff6129ad7c8efe1f983e";
  const contentVariables = payload.contentVariables ?? {
    "1": "12/1",
    "2": "3pm",
  };

  if (!to) {
    return NextResponse.json({ error: "Destinatario invalido." }, { status: 400 });
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM ?? "whatsapp:+14155238886";

  if (!accountSid || !authToken) {
    return NextResponse.json(
      { error: "Twilio no esta configurado en el servidor." },
      { status: 500 }
    );
  }

  const client = twilio(accountSid, authToken);

  try {
    const result = await client.messages.create({
      from,
      to,
      contentSid,
      contentVariables: JSON.stringify(contentVariables),
    });

    return NextResponse.json({ sid: result.sid });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "No se pudo enviar.",
      },
      { status: 500 }
    );
  }
}
