---
page: Contact Us
route: /contact
source: site.json contact block
---

# Contact Us

**H1:** Talk to the Nabeen team
**Intro (proposed):** Tell us which fabrics you trade in, your market and the quantities you need. We will reply on WhatsApp or email.

## Channels (from site.json, respect statuses)
- WhatsApp (primary action)
- Phone: +91 98196 93626
- Email: ceo@djimpex.in
- Visit: address block + embedded Google Map (lazy-loaded, click-to-load on mobile) + "Get directions" link

## Enquiry form
Fields:
- Full name (required)
- Company / shop name (optional)
- Country / market (required; select: Nigeria, Ghana, UAE, Saudi Arabia, India, Other)
- City (optional)
- WhatsApp number (required, with country code)
- Email (optional)
- Fabrics of interest (multi-select chips from fabricTypes)
- Message / quantities (optional)
- Consent line: "We'll only use these details to reply to your enquiry."

Submit button: "Send enquiry". Success state: "Enquiry sent. Our team will contact you on WhatsApp within one working day." (Confirm response time with client; until then say "shortly".)
Error state: say what failed and offer WhatsApp as the fallback.

No prices, no cart, no payment anywhere.
