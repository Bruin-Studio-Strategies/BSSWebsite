// The one place the application link lives, for every apply control on the site.
// It sits at the src root rather than inside a page folder because the navbar and
// the landing page both need it, and neither should be reaching into
// `pages/Recruitment/` for a value.
//
// TODO(content): the site previously carried three different links — this navbar
// one, `forms.gle/xVDESkpmkP4MtpHm6` on the landing page, and
// `forms.gle/FV2C9Ahamki44ZaN9` on the recruitment page. This is the navbar's,
// kept because it was the only one shown on every page. Confirm it is the live
// form for the next cycle and replace it here; nothing else needs editing.
export const APPLICATION_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScwAxZaKPtgV5V0rwdGm7Op3ucGgAN6Y9lbEVz4jcbEQCZ_aQ/viewform";
