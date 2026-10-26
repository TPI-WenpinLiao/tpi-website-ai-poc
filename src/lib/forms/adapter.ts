// Where a valid submission goes (M6-01, #33). The Pages Function hands every submission that passed
// validation and Turnstile to one adapter; sending it to a backend (the current site's /tpi/api/*,
// a CRM, mail) is a new adapter, nothing else changes. A failing adapter throws, and the visitor sees
// the "sending failed" message with the form still filled in.
import type { FormId, Values } from './rules.ts';

export interface Submission {
  form: FormId;
  // The form's fields only (fieldValues), trimmed
  fields: Values;
  // ISO 8601
  receivedAt: string;
}

export interface SubmitAdapter {
  send(submission: Submission): Promise<void>;
}

// Default adapter: one log line per submission, seen in the Pages Function's real-time logs. It names
// the form, the fields that were filled in and the time, never the values: the logs are not where
// anyone should read visitors' personal data.
export const logAdapter: SubmitAdapter = {
  async send({ form, fields, receivedAt }) {
    const filled = Object.entries(fields)
      .filter(([, values]) => values.some(Boolean))
      .map(([field]) => field);
    // Intended output, not debugging: this line is the adapter's whole job
    console.info(JSON.stringify({ event: 'form-submission', form, filled, receivedAt }));
  },
};
