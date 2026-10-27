// POST /api/contact: the contact form on /contact-us (M6-01, #33). Cloudflare Pages runs every file
// under functions/ as a route; this one only wires the form's settings to handleSubmission.
// TURNSTILE_SECRET_KEY is set in the Pages project's environment variables, never in the repo.
import { logAdapter } from '../../src/lib/forms/adapter.ts';
import { handleSubmission } from '../../src/lib/forms/handler.ts';
import { siteverify } from '../../src/lib/forms/turnstile.ts';

interface Env {
  TURNSTILE_SECRET_KEY?: string;
}

export const onRequestPost = ({ request, env }: { request: Request; env: Env }): Promise<Response> =>
  handleSubmission(request, { form: 'contact', secret: env.TURNSTILE_SECRET_KEY, verify: siteverify(), adapter: logAdapter });
