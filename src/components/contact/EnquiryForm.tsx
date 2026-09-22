"use client";

import { useActionState, useEffect, useId, useState } from "react";

import { submitEnquiry } from "@/app/actions/enquiry";
import { WhatsAppGlyph } from "@/components/ui/WhatsAppGlyph";
import { track } from "@/lib/analytics";
import { IDLE, MARKETS, type EnquiryState } from "@/lib/enquiry";

export type FabricChoice = { slug: string; name: string };

/**
 * One form, two shapes: the full version on /contact, and a short version
 * (name, WhatsApp number, market) inside the contact pop-up.
 *
 * `paired` is a third dimension rather than a third shape: the same full form
 * with its text fields set two to a row. It exists for the home page, where the
 * form sits beside a column of words and a single file of fourteen fields towers
 * over them. Same fields, same order of thought, about 200px shorter.
 *
 * Four states: idle, submitting, success and error. An error always says what
 * failed and offers WhatsApp, because a lost enquiry is the one failure that costs
 * the client money.
 */
export function EnquiryForm({
  variant = "full",
  paired = false,
  fabrics = [],
  whatsappHref,
  onSuccess,
  className = "",
}: {
  variant?: "full" | "short";
  /** Set the text fields two to a row. Full variant only; ignored by the pop-up. */
  paired?: boolean;
  fabrics?: FabricChoice[];
  whatsappHref: string;
  onSuccess?: () => void;
  className?: string;
}) {
  const [state, action, pending] = useActionState<EnquiryState, FormData>(submitEnquiry, IDLE);
  const id = useId();
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (state.status !== "success") return;
    track("enquiry_submit", { variant });
    try {
      sessionStorage.setItem("nabeen-enquiry-sent", "1");
    } catch {
      /* Private browsing: the popup will simply appear again next session. */
    }
    onSuccess?.();
  }, [state, variant, onSuccess]);

  const fieldError = (name: string) =>
    state.status === "error" ? state.fieldErrors?.[name] : undefined;

  // The full form set two fields to a row. The pop-up's short variant is already
  // short and stays in a single file.
  const twoUp = paired && variant === "full";

  const fullName = (
    <Field
      key="fullName"
      id={`${id}-fullName`}
      name="fullName"
      label="Full name"
      required
      autoComplete="name"
      error={fieldError("fullName")}
    />
  );

  const company =
    variant === "full" ? (
      <Field
        key="company"
        id={`${id}-company`}
        name="company"
        label="Company or shop name"
        autoComplete="organization"
        error={fieldError("company")}
      />
    ) : null;

  const whatsappNumber = (
    <Field
      key="whatsappNumber"
      id={`${id}-whatsappNumber`}
      name="whatsappNumber"
      label="WhatsApp number"
      type="tel"
      required
      placeholder="+234"
      autoComplete="tel"
      error={fieldError("whatsappNumber")}
    />
  );

  const email =
    variant === "full" ? (
      <Field
        key="email"
        id={`${id}-email`}
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        error={fieldError("email")}
      />
    ) : null;

  const market = (
    <SelectField
      key="market"
      id={`${id}-market`}
      name="market"
      label="Country or market"
      required
      error={fieldError("market")}
    />
  );

  const city =
    variant === "full" ? (
      <Field
        key="city"
        id={`${id}-city`}
        name="city"
        label="City"
        autoComplete="address-level2"
        error={fieldError("city")}
      />
    ) : null;

  if (state.status === "success") {
    return (
      <div className={`border-l border-zari pl-6 ${className}`.trim()} role="status">
        <p className="t-h3">Enquiry sent</p>
        <p className="mt-3 max-w-[34rem] text-slate">{state.message}</p>
      </div>
    );
  }

  return (
    <form
      action={action}
      className={`grid ${twoUp ? "gap-4" : "gap-5"} ${className}`.trim()}
      noValidate
    >
      <input type="hidden" name="variant" value={variant} />

      {/* Honeypot: hidden from people, irresistible to bots. */}
      <div className="visually-hidden" aria-hidden="true">
        <label htmlFor={`${id}-website`}>Leave this field empty</label>
        <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {twoUp ? (
        /* Who you are, how to reach you, where you are: three rows instead of
           six, and each row is still one thought. */
        <>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
            {fullName}
            {company}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
            {whatsappNumber}
            {email}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
            {market}
            {city}
          </div>
        </>
      ) : (
        <>
          {fullName}
          {company}
          {whatsappNumber}
          <div className={variant === "full" ? "grid gap-5 sm:grid-cols-2" : "grid gap-5"}>
            {market}
            {city}
          </div>
          {email}
        </>
      )}

      {variant === "full" ? (
        <>
          {fabrics.length > 0 ? (
            <fieldset className="grid gap-3">
              <legend className="t-small font-semibold">Fabrics of interest</legend>
              <div className="flex flex-wrap gap-2">
                {fabrics.map((fabric) => {
                  const checked = selected.includes(fabric.name);
                  return (
                    <label
                      key={fabric.slug}
                      className={`t-small cursor-pointer border px-4 py-2 transition-colors duration-[var(--duration-quick)] ${
                        checked
                          ? "border-navy bg-navy text-white"
                          : "border-line text-slate hover:border-navy hover:text-navy"
                      }`}
                    >
                      <input
                        type="checkbox"
                        name="fabrics"
                        value={fabric.name}
                        checked={checked}
                        onChange={(event) =>
                          setSelected((current) =>
                            event.target.checked
                              ? [...current, fabric.name]
                              : current.filter((item) => item !== fabric.name),
                          )
                        }
                        className="visually-hidden"
                      />
                      {fabric.name}
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ) : null}

          <div className="grid gap-2">
            <label htmlFor={`${id}-message`} className="t-small font-semibold">
              Message or quantities
            </label>
            <textarea
              id={`${id}-message`}
              name="message"
              rows={twoUp ? 3 : 4}
              className="w-full resize-y border border-line bg-white px-3.5 py-3 text-navy rounded-[var(--radius-control)]"
            />
          </div>
        </>
      ) : null}

      {state.status === "error" && !state.fieldErrors ? (
        <p role="alert" className="t-small text-[var(--color-error)]">
          {state.message}
        </p>
      ) : null}

      <div aria-live="polite" className="visually-hidden">
        {state.status === "error" ? state.message : ""}
      </div>

      <div className="mt-1 grid gap-4">
        <button
          type="submit"
          disabled={pending}
          className={`btn btn-primary justify-center ${variant === "short" ? "" : "sm:w-fit"}`}
        >
          <span>{pending ? "Sending…" : "Send enquiry"}</span>
        </button>

        {state.status === "error" ? (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("whatsapp_click", { location: "form_fallback" })}
            className="flex items-center gap-2 text-link w-fit"
          >
            <WhatsAppGlyph size={18} />
            <span>Chat with us on WhatsApp instead</span>
          </a>
        ) : null}

        <p className="t-small text-slate">
          We&rsquo;ll only use these details to reply to your enquiry.
        </p>
      </div>
    </form>
  );
}

const CONTROL =
  "h-[2.875rem] w-full border border-line bg-white px-3.5 text-navy rounded-[var(--radius-control)]";

function Field({
  id,
  name,
  label,
  error,
  required,
  type = "text",
  ...rest
}: {
  id: string;
  name: string;
  label: string;
  error?: string;
  required?: boolean;
  type?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="t-small font-semibold">
        {label}
        {required ? <span className="visually-hidden"> (required)</span> : null}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${CONTROL} ${error ? "border-[var(--color-error)]" : ""}`.trim()}
        {...rest}
      />
      {error ? (
        <p id={`${id}-error`} className="t-small text-[var(--color-error)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function SelectField({
  id,
  name,
  label,
  error,
  required,
}: {
  id: string;
  name: string;
  label: string;
  error?: string;
  required?: boolean;
}) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="t-small font-semibold">
        {label}
        {required ? <span className="visually-hidden"> (required)</span> : null}
      </label>
      <select
        id={id}
        name={name}
        required={required}
        defaultValue=""
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${CONTROL} ${error ? "border-[var(--color-error)]" : ""}`.trim()}
      >
        <option value="" disabled>
          Choose a market
        </option>
        {MARKETS.map((market) => (
          <option key={market} value={market}>
            {market}
          </option>
        ))}
      </select>
      {error ? (
        <p id={`${id}-error`} className="t-small text-[var(--color-error)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
