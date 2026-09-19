/**
 * The contact page's copy, read from `src/content/contact.json`.
 *
 * Officers are listed by role rather than by name, because the roster turns over
 * every year and a name list goes stale one line at a time. A role with two
 * holders keeps both addresses on one row instead of becoming two rows that look
 * like two different jobs.
 *
 * The club's general address is not here — it is in `content/site.json`, because
 * the clients and recruitment pages print it too.
 *
 * The form's labels are copy; its `name` attributes are not. Those are the keys
 * the EmailJS template reads and they stay in `sections/Form.jsx`.
 */

import contact from "../../content/contact.json";

export const { header, addresses, form } = contact;
