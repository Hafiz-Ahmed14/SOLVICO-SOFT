import { NextResponse } from "next/server";

/**
 * Contact endpoint.
 *
 * There is no mail server here, so this route forwards the message to a
 * webhook you configure. Set CONTACT_WEBHOOK_URL in .env.local to anything
 * that accepts a JSON POST — a Formspree/Formspark endpoint, a Google Apps
 * Script, a Slack or Discord incoming webhook, or your own handler.
 *
 * If it is not set, the route says so honestly and returns 503 rather than
 * silently swallowing the message. The contact page always shows a mailto:
 * address as well, so the form is never the only way through.
 */

type Payload = {
  name?: unknown;
  email?: unknown;
  institution?: unknown;
  product?: unknown;
  message?: unknown;
};

const str = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  let payload: Payload;
  try {
    payload = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ message: "Expected a JSON body." }, { status: 400 });
  }

  const name = str(payload.name, 120);
  const email = str(payload.email, 200);
  const institution = str(payload.institution, 160);
  const product = str(payload.product, 80);
  const message = str(payload.message, 4000);

  if (!name || !email || !message) {
    return NextResponse.json(
      { message: "Please fill in your name, email and message." },
      { status: 400 },
    );
  }

  if (!EMAIL.test(email)) {
    return NextResponse.json(
      { message: "That email address doesn't look right — check it and try again." },
      { status: 400 },
    );
  }

  const webhook = process.env.CONTACT_WEBHOOK_URL;

  if (!webhook) {
    console.warn(
      "[contact] CONTACT_WEBHOOK_URL is not set — message not delivered.",
      { name, email, institution, product },
    );
    return NextResponse.json(
      {
        message:
          "The contact form isn't connected yet. Please email us directly — the address is just below.",
      },
      { status: 503 },
    );
  }

  try {
    const upstream = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        institution: institution || "—",
        product: product || "—",
        message,
        receivedAt: new Date().toISOString(),
        source: "solvicosoft.com/contact",
      }),
    });

    if (!upstream.ok) {
      console.error("[contact] webhook rejected the message", upstream.status);
      return NextResponse.json(
        { message: "We couldn't deliver that. Please email us directly instead." },
        { status: 502 },
      );
    }
  } catch (error) {
    console.error("[contact] webhook request failed", error);
    return NextResponse.json(
      { message: "We couldn't deliver that. Please email us directly instead." },
      { status: 502 },
    );
  }

  return NextResponse.json({
    message: `Thanks ${name.split(" ")[0]} — we have your message and will reply by email.`,
  });
}
