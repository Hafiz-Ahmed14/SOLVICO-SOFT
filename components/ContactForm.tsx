"use client";

import { useState } from "react";
import { products } from "@/content/products";
import { site } from "@/content/site";

type State = { kind: "idle" | "sending" | "ok" | "error"; message?: string };

export default function ContactForm() {
  const [state, setState] = useState<State>({ kind: "idle" });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    setState({ kind: "sending" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = (await res.json()) as { message?: string };

      if (res.ok) {
        form.reset();
        setState({
          kind: "ok",
          message: body.message ?? "Thanks — we have your message and will reply by email.",
        });
      } else {
        setState({
          kind: "error",
          message:
            body.message ??
            `Something went wrong sending that. Email ${site.contact.email} instead and it reaches the same inbox.`,
        });
      }
    } catch {
      setState({
        kind: "error",
        message: `We couldn't reach the server. Email ${site.contact.email} instead and it reaches the same inbox.`,
      });
    }
  }

  const sending = state.kind === "sending";

  // Filter out VitaCraft (isFree === true) from the dropdown
  const paidProducts = products.filter((p) => !p.isFree);

  return (
    <form onSubmit={onSubmit}>
      <div className="field-row">
        <div className="field">
          <label className="label" htmlFor="name">
            Your name
          </label>
          <input
            className="input"
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={120}
          />
        </div>

        <div className="field">
          <label className="label" htmlFor="email">
            Email
          </label>
          <input
            className="input"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={200}
          />
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label className="label" htmlFor="institution">
            Institution
          </label>
          <input
            className="input"
            id="institution"
            name="institution"
            type="text"
            autoComplete="organization"
            placeholder="University, college or department"
            maxLength={160}
          />
        </div>

        <div className="field">
          <label className="label" htmlFor="product">
            Which product
          </label>
          <select className="input" id="product" name="product" defaultValue={paidProducts[0]?.name || ""}>
            {paidProducts.map((p) => (
              <option key={p.slug} value={p.name}>
                {p.name} — {p.fullName}
              </option>
            ))}
            <option value="Not sure yet">Not sure yet</option>
          </select>
        </div>
      </div>

      <div className="field">
        <label className="label" htmlFor="message">
          What do you need?
        </label>
        <textarea
          className="input"
          id="message"
          name="message"
          rows={6}
          required
          maxLength={4000}
          placeholder="How many students or courses, what you use today, and when you'd want it running."
        />
      </div>

      <button type="submit" className="btn btn-solid" disabled={sending}>
        {sending ? "Sending…" : "Send message"}
        {sending ? null : (
          <span className="arrow" aria-hidden="true">
            →
          </span>
        )}
      </button>

      <p className="form-note">
        We reply from {site.contact.email}. No mailing list, no forwarding your details on.
      </p>

      <div aria-live="polite">
        {state.kind === "ok" ? (
          <p className="form-msg form-ok">{state.message}</p>
        ) : null}
        {state.kind === "error" ? (
          <p className="form-msg form-bad">{state.message}</p>
        ) : null}
      </div>
    </form>
  );
}