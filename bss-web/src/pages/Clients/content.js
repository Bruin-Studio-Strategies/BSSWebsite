/**
 * The clients page's copy, read from `src/content/clients.json`.
 *
 * As with the recruitment page, this module exists so sections import one named
 * thing each and so the notes below have somewhere to live — JSON carries no
 * comments. `src/content/README.md` holds the editing rules.
 *
 * `motif` on a service is the name of a drawing in `components/ServiceMotifs/`,
 * not free text: there are six and an unrecognised name renders nothing. The CMS
 * exposes it as a fixed dropdown for that reason.
 *
 * The process phases here carry copy only. Where each phase sits on the week
 * ruler is geometry and lives in `components/ProcessTimeline/phases.js`, which
 * merges the two by `id` — see the note there.
 */

import clients from "../../content/clients.json";
import fill from "../../content/tokens.js";

export const { header, services, process, closing } = fill(clients);

/** The six service cells, in the order they are read. */
export const SERVICES = services.items;
