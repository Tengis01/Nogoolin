# Tasks — Active Queue

> Queue plus dated history. Product backlog below is carried from July 2026;
> recheck source before assuming an item is still missing. Historical counts,
> branch names and next steps describe their entry date, not today's state.
> Read the queue and latest dated entries first; this file has both prepended
> and appended history, so file order alone is not chronological.

## In Progress

*(empty)*

## Next — Prototype G v1.1: owner decision → real UI (added 2026-11-10)

State: `docs/nogoolin-prototype-g.html` v1.1 is built and verified; the owner
liked the mobile view and asked for four fixes, all done. E (v1.1 + admin), F
and G all stay in `docs/` for comparison. Only D-15 is decided so far.

- [ ] **Owner:** review G v1.1 on a phone (390 px) and on desktop; say what
      still needs changing.
- [ ] **Owner decision: which prototype is the base for the real UI?** E v1.1
      (current D-12/D-13 direction) or G v1.1. If G: record a D-xx and update,
      with history: design.md tokens (`--paper #F7F1E5`, fonts Cormorant +
      Onest, left-aligned text instead of the 2026-11-08 «justified» choice),
      AGENTS.md «Preserve v4 tokens» rule, SRS NFR-MAINT-460 (one palette +
      radius) and the register (DES-10 → approved).
- [ ] **Owner decision: wording proposals** from F/G: «шашны эдлэл», «бойпор»
      (for хүжийн сав), «зурмал бурхан (танка)» (for тангад зураг), «алтан
      шармал» (for алтадмал), «равнай», «Залж авах» on deity pages. If accepted
      they go to DES-06 microcopy and the SRS glossary.
- [ ] **Content review:** the altar order, равнай and mudra notes in F/G are
      sample text; a knowledgeable person must check them before real use.
- [ ] **Not in G yet:** the admin prototype (exists only in E, `#/admin`), the
      order-status page («Захиалгаа шалгах»), and the 3D intro (G starts at the
      intro's last frame and links to E's intro).
- [ ] After the decision: step 5 below («Real UI in `apps/web`» via OpenSpec)
      uses the chosen prototype as its reference.
- Assets: D-15 needs clean alpha cut-outs (ASSET_SPECS §3, amended 2026-11-10).
  The current `docs/prototype-f-assets/` files were cleaned by script and still
  show a few specks.

## Next — docs sync + PH1 exit (added 2026-10-30, docs-only, no code)

Audit 2026-10-30: code unchanged since `885e591` (2026-10-14); core docs
(SRS v2, traceability v2, register, code audit) are from 2026-10-27. The gaps
below are about course work that is not yet reflected here.

- [x] **Register (`docs/README.md`):** add ARC-07 «M8 diagram suite» = the
      **canonical** diagrams (C4 context/container, sequence-inquiry, data-model,
      bpmn-process) →
      <https://gitlab.com/Tengis01/icsi438-nogoolin/-/tree/main/sem10/docs/diagrams>,
      Pages <https://icsi438-nogoolin-442a5f.gitlab.io/sem10/>. Mark ARC-05
      (phase-0 ER/sequence) and Sem4 C4 as **frozen**: keep them, never update.
      In the «Хичээлийн ажил → албан ёсны баримт» table, fix the W10 row
      (it was the diagram suite, not mkdocs/Vale/lychee) and add Sem7
      (Diátaxis site, `/sem7/`) and Sem9 (ADR-012) rows.
- [x] **`docs/diagrams/README.md`:** replace the stale «W8-д … шинэ диаграм
      үүсгээгүй» text with a pointer to the Sem10 diagrams; list
      `agent-context/diagrams/` and phase-0 as frozen.
- [x] **Root `README.md`:** the «Start with phase-0/01-vision + 10-roadmap»
      line should point to `docs/README.md` + `docs/project/roadmap.md`.
      Change the layout comment «docs/ Authoritative Phase 0 specifications»,
      and point the «SRS» link at `requirements/srs-v2.md` (it currently
      points at the template).
- [x] **Broken links (3):** `agent-context/MEMORY.md` → `../docs/ICSI438/COURSE-HOME.md`;
      `agent-context/PROGRESS.md` → `../docs/ICSI438/WEEKLY-PROGRESS.md` and
      `…/sem6/issues/mobile-session-storage.md`. That folder moved to the GitLab
      repo; use `https://gitlab.com/Tengis01/icsi438-nogoolin/-/blob/main/…`.
- [x] **Owner decision: FR-INQ-140 / ADR-012 phone rule.** Web requires exactly
      8 digits, while the API accepts `^[0-9+\s-]{8,15}$`. The draft is in
      ICSI438 `sem9/adr-012-inquiry-phone-validation.md` (Proposed, option A/B).
      After the owner decides, record a D-xx in `DECISIONS.md`, and update SRS v2 §FR-INQ-140
      and its OPEN list. Change code only after the decision.
      → Done 2026-10-30: owner chose **A**, recorded as **D-10**; SRS v2.2.
- [x] **Code (D-10):** change `phoneSchema` in
      `packages/validation-schemas/src/common.ts` to `^\d{8}$`, and update the
      API integration test cases. Mark ICSI438 `sem9/adr-012` as Accepted (A)
      in the course repo. After that, FR-INQ-140 becomes implemented.
      → Done 2026-10-30 in this repo (`common.ts` `^\d{8}$`, 3 new API test
      cases). **Open:** mark ADR-012 Accepted in the ICSI438 repo. The
      integration suites still SKIP, because the user is not in the `docker`
      group and `supabase start` cannot run.
- [ ] **PH1 exit (due 2026-11-01, roadmap):** owner approves G1–G6 and dates;
      SRS v2 → «approved» once the «Consistent» open items reach 0
      (FR-INQ-140 is one of them).
      → 2026-10-30: owner has **not** approved yet (will review project-goals
      and roadmap first). FR-INQ-140 is now resolved; other Consistent items
      in SRS §7.4/§8 are still OPEN.
- Rule (owner, 2026-10-30): just enough documentation. Do **not** write the
  ~12 «planned» register docs proactively; write one only when a phase needs it.
  Diagram changes go only into the Sem10 files (re-run `render.sh` there).

## Next — Research R-01: е-баримт, НӨАТ, хувийн мэдээлэл (added 2026-11-08, PLAN ONLY — not started)

Owner request 2026-11-08. A separate, broad research task: Mongolian legal and tax
requirements before real ordering goes live. Sources: official government sites
only (legalinfo.mn, ebarimt.mn, mta.gov.mn, burtgel.gov.mn, the personal-data
authority) plus their official guides. Every claim cites the law, article and
URL with the date read. Not legal advice; mark anything uncertain for a
lawyer/accountant to confirm.
- [ ] 1. Business form: register as an individual entrepreneur vs an LLC;
      steps, cost, time, registration body, tax registration and the obligations
      of each.
- [ ] 2. VAT: registration threshold and when it becomes mandatory; reselling
      goods **bought without VAT** (no input VAT): how output VAT works and what
      happens if the seller is not VAT-registered.
- [ ] 3. е-баримт: who must issue it (VAT payers and non-payers); the
      integration options (POS API / PosAPI, agent, manual); what the store needs
      (TIN, cash register, merchant registration); issuing for orders paid at
      pickup; refunds and cancellations.
- [ ] 4. Personal data (Хүний хувийн мэдээлэл хамгаалах тухай хууль): consent text,
      purpose limitation, retention. Is **7 days** allowed for phone/name, and
      for what? Check the Accounting/Tax law retention periods for sales records
      (orders and е-баримт are likely to need years). Propose a retention table:
      OTP codes, SMS logs, order records, questions.
- [ ] 5. (Optional) Payment and SMS providers: Bonum (owner's preference: no base
      fee, contract) vs QPay, covering fees, contract, API docs and settlement;
      the SMS/OTP provider verify.mn, covering price, API and delivery
      reports.
- Output: `docs/research/R-01-ebarimt-vat-privacy.md` (Mongolian), a summary
  table of decisions the owner must make, and SRS §8 updates after review.

## Next — Prototype E v1.1 → Admin prototype → real UI (added 2026-11-08; step 1 done 2026-11-08)

Owner feedback 2026-11-08 + mobile audit (`scratch/nogoolin-e/qa-mobile-audit.js`,
320/360/390 px, 8 routes: 0 overflow, 0 console errors; issues below).
Mobile first: most customers are expected to order by phone. Design at 360 px,
then widen; test 320 / 360 / 390 / 768 / 1440 px on every step.

**Owner decisions 2026-11-08:**
- Colours are fixed: remove the floating «Өнгө» palette button and the palette
  switcher. Ship one palette (the v4 tokens with the dark jade button, D-12).
  The prototype state toggles (slow, errors, SMS, order) move to a small footer
  link «Prototype тохиргоо». They are prototype-only.
- Text is justified on web and mobile (paragraph text, see 1.1).

- [x] **1. Prototype E v1.1 (design fixes).**
  - [x] 1.1 Justify long text: descriptions, leads, «Бидний тухай», notices,
        usage steps. Add `text-wrap: pretty`. Not for headings, buttons, labels,
        prices, card names, tables or form hints. Mongolian hyphenation is
        likely unsupported, so measure word gaps at 360 px. Show the owner
        justified vs left-aligned screenshots before keeping it on mobile.
  - [x] 1.2 «Бүх бүтээгдэхүүн» / «Бүгдийг үзэх»: on mobile only an arrow on
        the same line, right after the section heading (44 px target,
        accessible name kept). Desktop keeps text + arrow.
  - [x] 1.3 Price and size become always-visible dual-thumb range sliders, not
        collapsible checkbox groups. Price step 5,000₮; size (longest side)
        0–60 cm, step 1. Number fields under the slider. Live result count
        while dragging, URL `?price=35000-420000` on release. Keyboard arrows;
        28 px thumbs with 44 px targets. Active filter shows as «35,000–420,000₮ ×».
  - [x] 1.4 Border radius tokens: `--radius-sm` 6px (inputs, checkboxes),
        `--radius` 10px (buttons, panels), `--radius-lg` 16px (popup, sheets).
        No pills. No radius on product cut-outs. Apply to every module.
  - [x] 1.5 Less blank space beside product images: object up to ≈88% of the
        canvas height, ≈6–8% side margin, one step smaller card gap. Views of
        one product keep one scale (needed for the hover turn).
  - [x] 1.6 Remove the «Өнгө» FAB + palette switcher. Footer link
        «Prototype тохиргоо» opens the state panel.
  - [x] 1.7 Mobile audit fixes:
    - detail page: sticky bottom bar «price + Сагсанд нэмэх» (CTA is
      ≈1 screen below the photo now);
    - breadcrumb on mobile → one «← Бүтээгдэхүүн» back link, 44 px (now 2
      lines, 34 px links);
    - every input/select ≥16px (sort select is 15.5px → iOS zoom);
    - checkout step indicator → one line «Алхам 1/3 · …» + thin progress bar;
      collapsible order summary at the top «2 бараа · 3,926,000₮ ▾»;
    - consent checkbox row ≥44 px (box is 22 px); phone fields
      `inputmode=tel autocomplete=tel`, SMS code `one-time-code`; full-width CTAs;
    - inquiry page leftovers: «Хүсэлтийн бүтээгдэхүүн», «Хүсэлт», «Хүсэлт
      илгээх», «Онлайн төлбөр, хүргэлт идэвхгүй…» → «Асуулт» wording;
    - cart: one total and one primary «Захиалах» (now duplicated); remove = 44 px
      «×» at line top-right; sticky bar hides while the summary is visible;
    - 1–2 item categories on mobile show as a small grid, not a near-empty row;
    - header hides on scroll down, returns on scroll up (cart badge stays);
    - quick-view sheet: drag handle + swipe down to close (× stays);
    - prototype/technical notes (e.g. «Prototype: D-09-ийн дагуу Tier A…»)
      only inside the prototype panel, never in customer copy;
    - sticky bars respect `env(safe-area-inset-bottom)`.
  - [x] 1.8 QA: `qa-mobile-audit.js` (no overflow, targets ≥44, inputs ≥16,
        text ≥14, nothing covered by fixed elements, heading + link on one
        line) + existing lead/shop/order/chrome/intro scripts; vision review.
- [x] **2. Admin prototype** (same file, route `#/admin`, own layout; works on
      mobile: drawer menu, orders as a card list).
      Sections: Хянах самбар · Бүтээгдэхүүн (list; edit form with D-09
      structured fields, variants, price, stock, featured; photo slots per view
      front/side/back/detail/base, Tier A 4–5 / Tier B 2 checklist, floor-line
      preview, «hover эргэлт идэвхтэй» when ≥2 views) · Ангилал · Захиалга
      (status Хүлээн авсан → Бэлтгэж байна → Авахад бэлэн → Авсан / Цуцалсан,
      fake SMS on «Авахад бэлэн») · Асуулт (inbox) · Тохиргоо · Үйлдлийн түүх
      (append-only). All states: loading, empty, error, saving, success.
      **«Онлайн захиалга» toggle:** on → «Сагс» menu + «Сагсанд нэмэх» on
      popup/detail; off → both hidden, «Асуулт асуух» becomes primary,
      `#/cart`/`#/checkout` show «Онлайн захиалга түр хаалттай», cart contents
      kept, admin still lists open orders. Confirm dialog, audit entry, site
      updates live (`ng:settings`). QA: toggle on/off reflects on the site;
      admin order status shows on «Захиалгаа шалгах»; product edit updates price.
- [x] **3. QA + report.** Figma re-capture **stopped** (owner 2026-11-08): a fully
      interactive Figma prototype needs a Full seat (code-layer import); flat page
      captures are not wanted. The HTML file is the interactive prototype.
- [x] **4. Decisions:** D-13 (ordering toggle in admin, one fixed palette,
      no palette switcher), SRS update with version + history (guest order,
      OTP, pickup, FR-WISH-110 change, admin setting); amend AGENTS.md rules
      «preserve v4 tokens» and `delivery_enabled` only with owner approval.
- [ ] **5. Real UI in `apps/web`** via OpenSpec (2026-11-10: wait for the
      owner's E-vs-G choice, see «Prototype G v1.1» at the top of the queue): read the current public pages
      and `/admin` scaffold first; order: tokens + header → products page →
      cart/order UI → admin. Mock data first.
- [ ] **6. API:** orders, OTP (choose SMS gateway), `ordering_enabled` setting
      checked in the service layer (not only hidden in UI), migrations with
      explicit grants, integration tests.
- Owner, in parallel: product photos (every view same camera height, light,
  scale), Green Tara 3D model.

**Still to confirm with the owner (defaults used if no answer):** justify on
mobile if word gaps get large (default: keep left-aligned on mobile, show
screenshots); admin in the same file `#/admin` (default: yes); toggle name
«Онлайн захиалга» (default: yes).

## Next — Prototype E: product page, card motion, guest order (added 2026-11-01; built 2026-11-04, awaiting owner review)

> Note 2026-11-10: per the log entries of 2026-11-04 and 2026-11-08 this plan was
> built (Prototype E v1.0, then v1.1 + admin). The unchecked boxes below were
> never ticked; they are the original plan text, not open work.

Design prototype only: one self-contained HTML file + asset folder, mock data,
all states faked (same rules as Prototype D). Builds on
`docs/nogoolin-prototype-d.html`. Do the steps in this order; each step is
browser-checked at 1440 and 375 px before the next one starts.

**Motion rule (owner, 2026-11-01):** the Hangtime-style «rail» is NOT copied.
No swinging, swaying, collisions, neighbour push or cursor-follow — wrong for
sacred goods (and WF-MO-01). The one signature motion is a calm **turn**:
side view → front view on hover. Hover **second-image crossfade** and hover
**zoom-up** are allowed. Products sit in a plain single row, no rail graphic.

- [ ] **0. Owner decisions, then record them** (no build work before this).
      New D-xx in `DECISIONS.md`, SRS v2 bump + change history (keep-history
      rule). Conflicts to resolve explicitly, not by assumption:
      - guest order vs current scope: inquiry-only, `delivery_enabled=false`,
        cart = saved list, FR-WISH-110 login gate, D-wording ban on
        «Сагс»/«Захиалах» in Prototype D;
      - v4 button colour `#0BB555` → dark jade (AGENTS.md says preserve v4
        tokens, so this is an amendment);
      - menu «Ангилал» removed (category becomes a filter group);
      - output name: Prototype E file vs revising D;
      - price bands, height bands, pickup-until-delivery, SMS code vs staff call,
        keep or drop the old inquiry flow (as «Асуулт асуух»).
- [ ] **1. Chrome.** Prototype C header (knot logo + «НОГООЛИН», text nav,
      active underline). Nav = Нүүр · Бүтээгдэхүүн · Бидний тухай. Search with
      no border: rest = icon + placeholder (≥4.5:1), hover = 1px underline
      fades in, focus = 2px underline + suggestions; mobile = icon → full
      overlay. Primary button = dark jade (≈`#12392D`, white text ≈12.7:1,
      measure exact value from the owner's reference). Re-run contrast for
      all palettes.
- [ ] **2. Images blend into the page.** Alpha WebP cut-outs for all
      products (no grey box), CSS soft contact shadow, every view on one
      shared floor line, same centre and scale across views (required for the
      turn in step 4). Check edges on gold/turquoise detail; record sizes.
- [ ] **3a. «Бүтээгдэхүүн» page — left filter sidebar (checkboxes).**
      Groups: Ангилал, Материал (from `material`), Үнэ (3 bands), Өндөр (from
      `height_cm`), Бэлэн байдал. OR within a group, AND across groups.
      Counts per option; 0 = disabled but still ≥4.5:1. Desktop applies
      instantly; URL sync (`?cat=&mat=…`, Back works, shareable). Active
      filters as text «Гууль ×» + «Бүгдийг арилгах» (no pills). Collapsible
      groups, sticky panel. Real `<input type=checkbox>`, 44 px rows, focus
      ring. Mobile: «Шүүлтүүр (n)» → full-screen sheet with sticky
      «N бүтээгдэхүүн харах». Unit-test the filter logic.
- [ ] **3b. Results area.** No filter: one heading + one row per category
      («Хүж · 3», «Бүгдийг үзэх →»), ≈2 rows per desktop screen, 4 cards +
      half of the 5th visible; mobile 1.6 cards with swipe. One category
      checked: that category as a 2-row grid. Other filters: grouped rows,
      empty categories hidden. Empty state = FR-PUB-150 text + clear button.
      Sort top-right. Loading: first 2 rows eager, rest lazy +
      `content-visibility:auto`; 480 px thumbs only.
- [ ] **4. Card motion.** Multi-view product: hover = calm side → front turn
      (aligned-view crossfade, ≈350 ms ease-out); 3+ images = horizontal
      pointer scrub with a thin segment indicator. Single-image product:
      hover zoom 1.00 → 1.05 (≈450 ms). Extra views load on pointer
      approach only. Touch: swipe inside the card. Keyboard focus = same as
      hover. Reduced motion: instant swap, no zoom. Forbidden: swing, sway,
      collision, neighbour push, cursor-follow, auto-rotate.
- [ ] **5. Quick-view popup on click.** Large gallery, price, material,
      dimensions (structured fields), «Сагсанд нэмэх», «Дэлгэрэнгүй хуудас →».
      URL changes, Esc/Back close, focus trap and return; mobile = full-height
      bottom sheet; short (≈400 ms) grow-from-card transition.
- [ ] **6. Guest order flow (faked, only if step 0 approves it).** Cart in
      localStorage, labelled «Энэ төхөөрөмж дээр хадгалагдсан» → phone
      (`^\d{8}$`, D-10) → address or store pickup → full total up front (no
      surprise fees) → fake SMS code → fake QPay/transfer → confirmation with
      order number → order lookup by phone + number + code. Consent text for
      personal data; note И-баримт as open. All error states shown.
- [ ] **7. QA + report.** Playwright at 1440/375 × palettes: console, no
      overflow, text ≥14 px, filters/Back, hover/focus/touch, popup a11y,
      order states, image request count. Mongolian report with sizes,
      contrast table, gaps and open questions.

Later, not in E: 360° photo spin for selected Tier A products (D-09, PH8);
3D GLB stays intro-only.

## Backlog (Phase 3 order — ⚠ highest-risk phase, read design.md first)

- [ ] **PWA (D-11, PH5, after the C pages and real icons):** manifest + icons
      (FR-PWA-110/120); production-only service worker with cache boundary
      tests first (FR-PWA-210, NFR-SEC-260); `/offline` (FR-PWA-220);
      visited-catalog cache + update flow (FR-PWA-230/240); offline inquiry
      message (FR-PWA-250); «Апп суулгах» button (FR-PWA-130)
- [ ] PH2: add the PWA/service worker to the C4 container diagram (Sem10
      files in the ICSI438 repo, re-run `render.sh`); the Mobile container
      becomes «frozen, D-11»
- [ ] Home white catalog section (WF-HOME-01…04: category row, featured
      grid, info strip) below the persistent hero — intro/hero container
      itself is done, this is the content underneath
- [ ] Green Tara GLB (owner-produced, timeline unknown): drop in via
      DEITY_GLB_URL (one line, re-verified 2026-07-20) → resolve D-04
      composition re-tune (VIEW_OFFSET_FRACTION / DEITY_SCALE knobs)
- [ ] Product edit page in admin (+ GET /admin/products/{id})
- [ ] Manual web-auth smoke test in browser (API RBAC covered by tests)
- [ ] Merge feature branches → `main`; create `develop` branch
      (waiting for owner go-ahead — "wait user to tell" 2026-07-16)
- [ ] Mobile inquiry form + wishlist (last recorded pending 2026-07-26)
- [ ] Real eslint config; mobile encrypted session storage; native Google
      Sign-In (carried over)

> Historical sequencing decision (2026-07-20): Phase 4 could start in parallel.
> Its API/web milestones were subsequently recorded on 2026-07-26; consult
> [PROGRESS.md](PROGRESS.md) for that record and the remaining mobile work.

## Done

- [x] 2026-07-26 — PHASE 4 (part) — web UI: inquiry page (WF §3.6 dedicated
      route + WF-INQ-04 success), wishlist save/list/remove, /profile
      (name edit + inquiry history + saved list), admin inquiry inbox.
      All wired to the live API, 0 mock data. 35 browser checks; 1 real bug
      fixed (profile stale-prop dirty check). Mobile still pending.
- [x] 2026-07-26 — PHASE 4 (part) — soft inquiry system + cart draft API
      (`feature/inquiry-api`): migration 0007 (inquiries.customer_id + cart_items),
      8 endpoints (public/customer/admin inquiry + cart), optionalAuth hook,
      shared Zod, 12 new integration tests (34/34 green). Rate-limit 500→429 fix.
      Remaining Phase 4: user profile, mobile inquiry form, web/mobile UI wiring.
- [x] 2026-07-20 — Phase 3 web close-out: E2E-verified intro/hero flow (8/8
      browser checks), 1-frame flash bug fixed, GLB swap re-verified by
      simulation, Draco self-hosted, ASSET_SPECS.md written. Mobile Rive
      confirmed NOT built — status corrected, not closed.
- [x] 2026-07-20 — Intro camera system on placeholder (persistent canvas,
      locked arc, setViewOffset, WF-INTRO-03 scene)
- [x] 2026-07-19 — PHASE 2 COMPLETE: public listing/detail + SEO (Lighthouse
      SEO 92/100, perf 100/96) + mobile listing/detail screens
- [x] 2026-07-19 — Category/Product/Image CRUD API + multi-script search +
      21 integration tests green vs live local stack; local stack finally
      RUNNING (Phase 1 runtime caveat closed)
- [x] 2026-07-17 — Phase 1 complete: auth (email + OAuth scaffold), JWT/RBAC,
      /admin scaffold, Expo app init, .env.example final
- [x] 2026-07-16 — Local Supabase stack + 3 migrations (schema/RLS/seed) +
      Fastify layered scaffold + shared Zod schemas + lockfile
- [x] 2026-07-16 — agent-context/ working-memory layer + CLAUDE.md standing instruction
- [x] 2026-07-16 — Dockerfile (multi-stage, non-root) + docker-compose + 3 CI skeletons
- [x] 2026-07-15 — CLAUDE.md + monorepo skeleton (workspaces, tsconfig base, env template)

---

## Deferred (D-11 — native mobile frozen until the G7 PWA gate)

Kept verbatim from the backlog (moved 2026-10-30):

- [ ] Mobile Rive intro (@rive-app/react-native Nitro) + transition —
      NOT STARTED; build against ASSET_SPECS.md §2 (proposed contract:
      artboard `Intro`, state machine `IntroMachine`, inputs `skip`
      (trigger) / `reducedMotion` (bool), event `finished`)

## Log (append after every task, newest first)

### 2026-11-10 — Docs synced after Prototype F/G
- **Result:** register v1.8 (DES-08 D/E, DES-09 F, DES-10 G v1.1; D and E were
  missing from the register before), ASSET_SPECS §3 amended by D-15 (alpha
  cut-outs, previous wording kept), queue section «Prototype G v1.1: owner
  decision → real UI» added at the top. Nothing committed.
- **Next:** the queue's first open items (owner review and E-vs-G decision).

### 2026-11-10 — Prototype G v1.1 (owner's four fixes) + D-15
- **Owner feedback on G v1.0:** «much better», mobile liked. Four fixes asked:
  remove the count beside the arrow in tier rows; product photo background must
  equal the page background as a hard rule; redo the desktop «Зорилгоор сонгох /
  Мэдлэг» section; redo the desktop «Дэлгүүр» page. Owner chose a left filter
  column for desktop and «everywhere except the hero» as the rule's scope.
- **Result:** `docs/nogoolin-prototype-g.html` v1.1. (1) Arrows without counts
  in the altar rows and shop category headers; «Бүх 5 эдлэлийг үзэх». (2) Tiles
  have no fill, gradient or radius; altar band, product stage and sheets all use
  `--paper`; **D-15** recorded in DECISIONS.md and noted in design.md.
  (3) Desktop: four purpose cards with a representative product, three guide
  cards with an excerpt. (4) Desktop shop: sticky left column (tier links,
  material, price, stock; applies on change), three-column grid; mobile keeps
  tabs + filter sheet.
- **Verified (Playwright, Chromium):** D-15 check: 0 violations at 390 and
  1440 px × 9 routes; desktop filter column (live filter, clear, tier link);
  320/360/390/1440 px × 10 routes without overflow or small tap targets; flow
  test passes; 0 console errors.
- **Next:** owner review of G v1.1.

### 2026-11-10 — Prototype G built (owner feedback on F)
- **Owner feedback on F:** the dominant black-green is cold and hollow and does
  not suit deity objects; the structural fixes, wording and mobile view are
  better, yet E still felt better as a familiar shop. Owner chose: warm light
  ground + jade, and from E: the green header, a bright background, lists
  grouped by category, products right on the home page.
- **Result:** `docs/nogoolin-prototype-g.html` (single file, mock data; reuses
  `docs/prototype-f-assets/`). F is kept for comparison. Design artifact only:
  **no decision recorded, no SRS / design.md / AGENTS change**. G = F's
  structure (tab bar, altar navigation, «Утга бэлгэдэл», size comparison,
  search, guest order, wording) on warm paper `#F7F1E5`, with jade `#1B4634`
  only for the header, hero, primary buttons and active states. Home: jade hero
  → «Онцлох эдлэл» grid with prices → altar → purpose/guides → store. Shop
  «Бүгд»: one section per tier (Шүтээн / Тахил / Хүж), flat grid when a tier,
  filter or sort is active. Mobile header hides on scroll down.
- **Verified (Playwright, Chromium):** 320/360/390/1440 px × 10 routes: no
  horizontal overflow, no tap target under 44 px, 0 console errors; flow test
  passes; 12 text/background pairs ≥ 5.1:1 (WCAG AA).
- **Open for owner:** same wording and content review as F; a one-item tier
  («Тахил») leaves half a row empty on mobile; proper alpha cut-outs still needed.
- **Next:** owner review of E vs F vs G; record a decision only after a choice.

### 2026-11-10 — Prototype F built (owner challenge: free of existing rules)
- **Request:** owner asked for a new prototype not bound by the current palette,
  style or rules; mobile PWA first; careful wording («шашны эдлэл», not «ариун
  эдлэл»); the site after the 3D intro must stop feeling like a generic web shop.
- **Result:** `docs/nogoolin-prototype-f.html` (single file, mock data) and
  `docs/prototype-f-assets/` (16 cut-outs re-cropped from the E assets, white
  floor and enclosed white background removed for a dark ground). Design artifact
  only: **no decision recorded, no SRS / design.md / AGENTS change**.
  Concept «Үзмэрийн танхим»: dark hall for looking, warm paper for reading and
  ordering; app-style bottom tab bar; home continues the intro's last frame;
  navigation by the altar («Тахилын ширээ»: Шүтээн / Тахил / Хүж) and by purpose;
  product page = sticky stage + paper sheet, numbered «Утга бэлгэдэл» notes on
  the statue, size comparison, «Хамт тавигддаг эдлэл»; search with Latin
  transliteration; cart → phone → code → pickup; «Асуулт асуух» sheet; ordering
  toggle in the footer panel. Fonts: Cormorant + Onest.
- **Verified (Playwright, Chromium):** 320/360/390/1440 px × 10 routes: no
  horizontal overflow, no tap target under 44 px, 0 console errors; flow test
  (tier filter, variant, cart, validation, checkout, search, ordering off, ask)
  passes. The 3D intro itself is not rebuilt: F starts at the intro's final frame.
- **Open for owner:** wording proposals (бойпор, зурмал бурхан (танка), алтан
  шармал, равнай, «Залж авах»); religious copy is sample text and needs review by
  a knowledgeable person; cut-outs need proper alpha masks (a few specks remain);
  text is left-aligned here, which differs from the 2026-11-08 «justified» choice.
- **Next:** owner review of F vs E; if F is chosen, record a decision and update
  design.md / SRS with history before any `apps/web` work.

### 2026-11-08 — SRS v2.7 (owner answers D-14)
- **Result:** SRS v2.7, traceability v2.7, register v1.7. Guest ordering stays
  Should; `ordering_enabled` defaults to false (owner). OTP values follow NIST SP
  800-63B / OWASP (FR-ORD-170/171, NFR-SEC-253/270). Cancellation: one
  «Захиалга цуцлагдсан» line with a fixed reason and an SMS (FR-ORD-120/230/240/320,
  FR-ADM-620/640). FR-WISH-100…150 → Won't (legacy) and the `/cart` API is marked
  legacy. The price slider stays linear. §8 adds verify.mn (SMS), Bonum vs QPay
  (future payment), R-01 pointers and a proposed retention table. Counts: leaves
  294; Must 178 · Should 75 · Could 12 · Won't 29.
- **Open for owner:** the «Бусад» cancel reason (an internal note is required and
  never shown to the customer); the NIST long-term failed-attempt counter (hourly
  SMS cap allows ~25 guesses/phone/h).
- **Next:** research R-01, or step 5 (real UI in `apps/web` via OpenSpec).

### 2026-11-08 — Step 4: SRS v2.6, traceability v2.6, register v1.6, AGENTS + design amendments
- **Result:** SRS v2.6 MINOR encodes D-12/D-13: guest order with OTP and store
  pickup (FR-ORD), `ordering_enabled` (FR-SET-150/230), delivery locked
  (FR-SET-240), admin order management (FR-ADM-600–640), filters and ranges
  (FR-PUB-180–182/190), hover and quick view (FR-PUB-600–620), the saved list is
  legacy (FR-WISH-110 Won't), mobile-first (NFR-USE-230/240, NFR-COMP-200), one
  palette + radius (NFR-MAINT-460). 34 new IDs; changed ones keep «Өмнөх (v2.5)»
  lines (38). Leaves 262 → 294, traceability rows match (294). AGENTS.md
  (delivery/ordering rule, v4 button amendment) and design.md (`--act` #1B4634,
  previous values kept) amended with the owner's approval.
- **Open for owner (SRS §8):** SMS gateway, И-баримт, personal-data retention,
  price-slider scale, whether «Цуцалсан» is a timeline step, ordering priority
  Should vs Must, the proposed OTP values (5 min, 5 tries, 5 SMS/phone/h, 10/IP/h),
  `ordering_enabled` default false, legacy FR-WISH-120…150. The DB needs
  migrations: a status enum, and nullable `orders.customer_id`/`address`.
- **Next:** step 5, real UI in `apps/web` via OpenSpec.

### 2026-11-08 — Admin prototype (step 2) built; Figma updates stopped
- **Result:** `docs/nogoolin-prototype-e.html` (566,920 B) now includes `#/admin`:
  dashboard, orders (6 sample orders, status flow, fake SMS, cancel with reason),
  products (list, edit form with D-09 fields, variants, photo slots, floor-line
  preview, validation, save/archive, edits reflected on the site), categories
  (order, edit), questions inbox, settings («Онлайн захиалга» toggle with
  confirmation, delivery locked off, store info and SMS template), append-only
  audit log. Ordering off hides the cart menu and «Сагсанд нэмэх», makes «Асуулт
  асуух» primary and shows a closed state on `#/cart` and `#/checkout`; the
  change is live across tabs.
- **Verified on the final file:** admin QA 0 fails, admin-catalog QA 0 fails,
  shop and checkout QA 0 fails, mobile audit 195/195, intro 1440+360 OK, shop unit
  11/11, 0 console errors.
- **Decision D-13** recorded. Figma: interactive prototype not possible on the
  Starter/View seat, so updates stop.
- **Open** (requests in the work dir `~/.local/share/nogoolin-proto/e/REQUESTS-*.md`,
  fix in real code): cancelled-order timeline step, store info from settings not
  used in checkout, small runtime wrappers around data.js and shop.js (data
  reindex hook, `ng:catalog` rebuild), `[data-save]` handler scope.
- **Next:** step 4 (SRS + AGENTS amendments, owner approval), then step 5 (real UI
  in `apps/web` via OpenSpec).

### 2026-11-08 — Prototype E v1.1 built (step 1)
- **Result:** `docs/nogoolin-prototype-e.html` (421,475 B) rebuilt; images regenerated
  (object ≤88% height, 7% side margin, floor 94%; v1.0 images kept in the work dir).
  Range sliders for price/size (URL `price=lo-hi`, legacy values mapped), radius
  tokens 6/10/16, justified prose (Chrome hyphenates Mongolian: max space 23 px,
  p90 12 px at 360), arrow-only section links on mobile, 1–2 item categories as a
  grid, quick-view drag-to-close, sticky detail buy bar, mobile back link,
  «Асуулт» wording, palette fixed to v4 (FAB + switcher removed, panel via footer
  «Prototype тохиргоо»), header hides on scroll, checkout one-line stepper +
  collapsible summary, 44 px remove «×», tel/one-time-code inputs, theme-color #1B4634.
- **Verified:** mobile audit 195/195 (320/360/390 × 8 routes: no overflow, targets
  ≥44, inputs ≥16, text ≥14, no fixed overlap, heading+link one line, no FAB, no
  «Хүсэлт»); shop QA (360/320/1440) and checkout QA pass with 0 console errors;
  shop unit 11/11; intro 1440+360 (r128, skip 128–167 ms, final → home, reduced motion).
- **Work dir moved** to `~/.local/share/nogoolin-proto/e/` (scratch was pruned twice).
- **Open:** price slider is linear 0–3.85M₮ (most items in the first 13% of the
  track: owner to choose log/stepped scale); one 40 px scroll band in the mobile
  cart shows two «Захиалах»; unused palettes still in tokens.css.
- **Next:** step 2, the admin prototype.

### 2026-11-08 — Prototype E feedback + mobile audit → plan v1.1
- **Result:** owner feedback recorded as queue «Prototype E v1.1 → Admin
  prototype → real UI» above: range sliders, radius tokens, tighter image
  margins, justified text, arrow-only «Бүх бүтээгдэхүүн» on mobile, remove the
  «Өнгө» palette button (colours fixed), admin page with «Онлайн захиалга» toggle.
- **Mobile audit** (320/360/390, 8 routes): 0 overflow, 0 console errors. Found:
  the FAB covers content and sticky CTAs, the detail CTA is far below the photo,
  breadcrumb links are 34 px, the sort select is 15.5px (iOS zoom), the checkout
  stepper wraps, the consent box is 22 px, the inquiry page still says «Хүсэлт»,
  the cart has a duplicate total/CTA, and 1-item rows look empty.
- **Next:** step 1 (v1.1). Nothing changed in code yet.

### 2026-11-04 — Prototype E built (HTML) and captured to Figma
- **Result:** `docs/nogoolin-prototype-e.html` (404,310 B) + `docs/prototype-e-assets/`
  (34 files, ≈3.0 MB, alpha cut-outs on a shared floor line). Steps 0–6 of the queue
  above done as a design prototype (D-12): C-style header + borderless search + cart
  badge; «Бүтээгдэхүүн» page with checkbox filters, one row per category, hover
  turn/crossfade/zoom, quick view (`?qv=`); faked guest order (cart → phone → pickup →
  SMS 123456 → order number → lookup); inquiry kept as «Асуулт асуух».
- **Verified (Playwright, file://, 1440 + 375):** lead smoke 24/24, shop QA all logged
  checks OK, order 51 PASS «ALL PASS», chrome all OK + contrast AA on 4 palettes
  (min 4.52 v4 dark muted), intro 47/50 (3 fails = one run where cdnjs three.js loaded
  late; re-run loaded r128), shop unit 9/9, no console errors.
- **Figma:** draft file «Nogoolin · Prototype E»
  <https://www.figma.com/design/k2S7LkjEMoPbR63UHaprDA> — 4 flat captures (home,
  products, quick view, cart) via code-to-canvas; no components, no hover states.
- **Open:** sample data has 1 product in most categories; swipe/reduced-motion on
  cards not scripted; SRS/delivery/v4-token conflicts listed in D-12 still open.
- **Next:** owner review in Figma/HTML.

### 2026-11-01 — Prototype D delivered; Prototype E planned
- **Result:** `docs/nogoolin-prototype-d.html` (≈292 KB) + `docs/prototype-d-assets/`
  built and browser-checked (intro 50/50, pages 63/63, chrome/search 149/149,
  search unit 37/37, contrast 48/48 AA). Not committed.
- **Plan:** Prototype E queued above (filter sidebar, single-row results,
  calm turn/crossfade/zoom card motion, quick view, guest order). Owner
  rejected rail swing/sway physics. Nothing started.
- **Next:** owner answers step 0, record D-xx, then step 1.

### 2026-10-30 — Audit H1/H2 fixed; deploy jobs deferred to PH7
- **Done:**
  - H1: `validateParams` + shared UUID param schemas on the 9 routes with
    `:id`, `:imageId` or `:productId`.
  - H2: `lib/db-errors.ts` `dbError` replaces the 35 repository
    `throw new Error` calls (23505 → 409, 23503 → 400, 22P02/23514 → 400).
  - Tests were written first and failed with 500 (3 tests), then passed.
  - The `deploy` jobs in api-/web-deploy.yml now run only when the
    `DEPLOY_ENABLED` repo variable is `true` (PH7).
- **Owner decision:** no Supabase in CI (H4 won't do). Integration tests run
  locally; `tests/db-errors.test.ts` (6 unit tests) runs in CI.
- **Verified:**
  - `pnpm --filter @nogoolin/api test`: 47/47, 0 skip (local stack).
  - Without the stack: 6 unit tests pass, 3 suites skip.
  - `pnpm run type-check` green; both workflows parse as YAML.
- **Docs:** SRS v2.5 (NFR-SEC-210 statement now includes path params;
  NFR-MAINT-320 question in §8), traceability v2.5, audit QA-05 v1.2,
  register v1.5.
- **Next (PH7):** set `DEPLOY_ENABLED=true` once the cloud exists, and
  resolve the NFR-MAINT-320 question first. Remaining audit items: M1–M10, A1–A6.

### 2026-10-30 — C1 fixed: explicit least-privilege table grants
- **Done:** Wrote `rls.integration.test.ts` first (4 tests). On a simulated
  legacy full-grant DB it **failed** 2/4, confirming C1 at runtime: a customer
  changed their own role and email.
  - Found a deeper root cause: CLI v2.109 default privileges give the API
    roles no DML, so a fresh reset broke 37/39 tests. Grants had silently
    depended on platform defaults (empty `table_grants.sql`).
  - Fix: migration 0008 `20261030120000_explicit_table_grants.sql`. It
    revokes all, then grants least privilege per role. `users` is limited to
    `update (full_name)` for `authenticated`, audit_logs is append-only for
    `service_role` too, and order tables have no grants (closes FR-SET-220).
- **Verified:**
  - `pnpm --filter @nogoolin/api test` gives **38/38 pass, 0 skip**, both
    after a fresh `db reset` and on the simulated legacy state with 0008
    applied.
  - `information_schema.column_privileges` shows `authenticated` UPDATE on
    `full_name` only.
  - Docker access via `sg docker` (the owner added the group).
- **Docs:** SRS v2.4 (NFR-SEC-350, FR-SET-220 → implemented, previous
  status kept), traceability v2.4, audit QA-05 v1.1, ERRORS.md, DB_SCHEMA.md,
  an AGENTS.md grants rule, register v1.4.
- **Not done:** browser check of the profile form (the identical supabase-js
  call is covered by the test). CI still has no Supabase service (audit H4).
- **Next:** audit P0 H1/H2 (path-param and DB-error → 500); CI Supabase (H4).

### 2026-10-30 — D-11: native mobile deferred, PWA this release
- **Done:** D-11 recorded; ADR-004 amended, ADR-010 dormant.
  - SRS v2.3: §4.15 FR-PWA (12 blocks/9 leaf), NFR-PERF-350, NFR-SEC-260,
    NFR-COMP-600. Mobile reqs moved PH8 → Future (D-11); §1.2 and §4.12 keep
    their old text.
  - Traceability v2.3; goals v0.3 (new G7 PWA, G6 gated, old G6 quoted);
    roadmap v0.3 (PH5 step 5, PH6/PH7 PWA, PH8 gate); register v1.3.
  - AGENTS.md, README and ASSET_SPECS §2 note D-11. Added
    `apps/mobile/README.md` (frozen). The Rive backlog item moved to Deferred.
  - Root scripts exclude `@nogoolin/mobile`.
- **Verified:** `pnpm run type-check` is now green (validation-schemas, web,
  api); relative links in the edited files resolve.
- **Next:** C1 fix (needs Docker group access), then the PWA in PH5.

### 2026-10-30 — Docs sync + D-10 phone rule
- **Done:** Register v1.2 (ARC-07 Sem10 diagrams canonical; ARC-05 and the
  Sem4 C4 frozen; W10 row corrected, Sem7/Sem9 rows added, QA-04 source
  fixed; old wording kept in the changelog). `docs/diagrams/README.md` now
  points to Sem10, with the previous text kept. Root README now points to
  the register, roadmap v2 and SRS v2. Three broken ICSI438 links point to
  GitLab (targets checked: HTTP 200). D-10 = ADR-012 option A; SRS and
  traceability v2.2.
- **Verified:** relative links in the edited files all resolve; GitLab
  paths for Sem7/9/10 and the Pages URLs return 200.
- **Code (D-10):** `phoneSchema` changed to `^\d{8}$`, with 3 rejection
  cases added to `inquiry-cart.integration.test.ts`.
  - Ran `pnpm install --frozen-lockfile` and type-check: validation-schemas,
    api and web OK. Mobile has 1 TS2786 error (`Stack` JSX) that also fails
    on unchanged HEAD, so it is not caused by this change.
  - A direct schema check passed all 9 cases (2 valid, 7 invalid).
  - API test run: 0 fail, **2 suites skipped**, because Docker is not
    accessible (user not in the `docker` group).
- **Next:** ADR-012 → Accepted in the ICSI438 repo; run the integration
  suites once Docker access exists; owner review for PH1 exit.

### 2026-10-30 — Docs freshness audit after ICSI438 Sem10
- **Done:** Read-only audit of `docs/`, `agent-context/` and the root README against the code and the Sem7/9/10 course work. Code is unchanged since 2026-10-14, and the core docs are current as of 2026-10-27. Gaps and the owner's decisions (canonical Sem10 diagrams, old diagrams frozen, no proactive planned docs) were queued under «Next — docs sync + PH1 exit».
- **Next:** Work through that list top-down. The phone-rule item needs the owner's decision first.

### 2026-09-30 — OpenSpec and Context7 CLI foundation
- **Done:** Initialized official OpenSpec only in Nogoolin for Codex and Hermes. Added the unapproved, unimplemented `demo-catalog-filter-summary` proposal/spec/design/tasks to demonstrate the workflow; strict validation passed. Added concise OpenSpec and targeted Context7 guidance to AGENTS.md and the shared vault rules. Context7 CLI's narrow Next.js documentation lookup worked anonymously.
- **Context7 integration:** Its standard `setup --cli --codex` required device login, so installed the public official `find-docs` skill directly from `/upstash/context7` using `ctx7 skills install` into the standard universal skills directory; Hermes discovers the same skill through a shared-vault symlink. Documentation queries work anonymously; no credentials or MCP configured. No application code, API, schema, or existing course work was changed for this setup.
- **Next:** If the owner approves the demo feature later, review its spec before implementation. Use Context7 only when external version-sensitive documentation is needed.

### 2026-07-26 — Phase 4 web UI: inquiry form, wishlist, profile, admin inbox (`feature/inquiry-ui`)
- **Done (web only — mobile untouched per task):** 4 new routes —
  `/products/[slug]/inquiry` (WF §3.6 dedicated page + WF-INQ-04 success),
  `/wishlist`, `/profile`, `/admin/inquiries` — all wired to the REAL Phase 4
  API, zero mock data. Detail-page inquiry CTA (disabled since Phase 2) is now
  live; Save toggle added to product cards + detail; session-aware nav links;
  admin sidebar "Хүсэлтүүд (Phase 4)" → real `/admin/inquiries`.
- **Key decisions (both owner-approved):** (1) inquiry is a DEDICATED ROUTE,
  not embedded — the task's "embed unless the wireframe says otherwise" clause
  resolved to the wireframe, which defines §3.6 as its own page with a sticky
  summary card and points WF-DET-04's CTA at it. (2) email field OMITTED
  despite WF-INQ-01 listing it — no email column/API field exists (FR-INQ-002
  is phone-only) and rendering it would silently discard input. (3) the
  WF-INQ-04 `INQ-YYYY-NNNN` number is DERIVED display-only from
  created_at + uuid (no migration) — swap `formatInquiryNumber` if a real
  sequence is ever added.
- **Validation:** client uses the SHARED `inquiryInputSchema` as its base,
  extended with WF-INQ-01's stricter rules + exact MN strings; a compile-time
  `InquiryFormValues extends InquiryInput` assertion prevents client/server
  drift. Client rules are a strict subset, so anything passing the form passes
  the API. NOTE: this module is web-local — **lift it to
  packages/validation-schemas when the mobile inquiry form is built.**
- **Verified in real Chrome (2 E2E suites, 35 checks):** guest suite 13/14
  (sole miss = pre-existing missing `/favicon.ico`); authenticated suite 21/21
  — save→persist→remove, name pre-fill, auth submission linking customer_id,
  profile history + name edit, admin inbox listing/expand/status-update/
  server-side filters. Rate-limit (429) UI verified separately: shows the
  Mongolian retry message and does NOT fake success.
- **1 real bug found + fixed** (ERRORS.md): the profile save confirmation could
  never render — `dirty` compared against a stale server-render prop. Also
  logged: `next build` breaks if the root `.env` (NODE_ENV=development) is
  sourced — environment footgun, not a code bug.
- **Polish audit:** no red anywhere (zero red-family Tailwind classes, zero red
  keywords); the ONE new color is `--warn: #d98a6a`, the exact value WF-INQ-01
  mandates for invalid fields and which the wireframe itself calls "orange" —
  ⚠ **flagged for owner veto** if it reads as red. All 3 list views have
  loading + error-with-retry + empty states. `prefers-reduced-motion` block
  added to globals.css and verified in-browser (transition-duration → 0s).
- **Not done (next task):** mobile inquiry form + mobile wishlist.

### 2026-07-26 — Phase 4 soft inquiry system + cart draft API (`feature/inquiry-api`)
- **Done (API only, no UI — per task):** the soft inquiry system + a wishlist /
  cart draft, all Controller→Service→Repository. Migration 0007 adds
  `inquiries.customer_id` (nullable, links authenticated submitters; NULL for
  guests) + an `inquiries_select_own` RLS policy, and a new `cart_items` table
  (per-user save list, own-row RLS, explicit grants). New endpoints:
  `POST /inquiries` (guest OR auth via a new `optionalAuth` hook; 3/hr rate
  limit), `GET /inquiries/mine` (auth, own history), `GET /admin/inquiries`
  (status + product_id + date-range filters, newest-first pagination),
  `PATCH /admin/inquiries/{id}/status` (audit-logged), and `GET/POST/DELETE
  /cart`. Added a new authenticated (non-admin) route scope in app.ts.
  Shared Zod: `inquiry.schema` (customer_id, admin list query) + new
  `cart.schema`. **12 new integration tests, 34/34 green** vs the live stack.
- **Owner decisions honored (both diverge from docs/04+08 — flagged):**
  (1) added `customer_id` + customer self-read (docs/phase-0/04 had no such column,
  docs/phase-0/08 was admin-only-read); (2) single `cart_items` table (docs/phase-0/04 has NO
  cart entity — the task's "per 04 CART/CART_ITEM" premise was false).
  Email was NOT added — FR-INQ-002 specifies phone only.
- **2 bugs (ERRORS.md 2026-07-26):** (a) rate-limit responses were 500 not 429
  (@fastify/rate-limit throws the builder payload w/o statusCode; pre-existing
  latent bug in the global limit too) — fixed in the central error handler;
  (b) discovered migration `0006_table_grants.sql` is **0 bytes** (grants live
  only in the manually-patched running DB) → a fresh `supabase db reset` would
  lack grants. Mitigated: 0007 grants its own objects; broader fix flagged.
- **Doc-update recommendations (not yet applied):** record `inquiries.customer_id`
  + `cart_items` in docs/phase-0/04-er-diagram.md and the self-read policy in
  docs/phase-0/08-security.md §6.10; consider an FR for the wishlist.
- **Next:** owner reviews/merges; remaining Phase 4 items = basic user profile,
  mobile inquiry form, and wiring the inquiry form + wishlist into web/mobile UI.

### 2026-07-20 — Working `docker compose up --build` for api+web (uncommitted)
- **Done:** added `apps/web/Dockerfile` (dev-only, single-stage — web
  still deploys via Vercel in prod, per docs/phase-0/09) and a `web` service to
  `docker-compose.yml`; both services set `network_mode: host` (Linux)
  so `next dev`'s own "Network: http://<lan-ip>:3000" log line — and
  Fastify's own listen log — reflect the machine's REAL LAN IP for free,
  no custom scripting needed.
- **3 real bugs found + fixed while actually running it** (details in
  ERRORS.md): (1) `.dockerignore` blanket-excluded `apps/`, blocking the
  new web build; (2) neither Dockerfile copied root `tsconfig.base.json`,
  so `tsc` failed inside the image only; (3) the API container crashed
  at startup — `@supabase/supabase-js` requires native `WebSocket`
  unconditionally, absent on the pinned `node:20-alpine` (Node 22+ only)
  — fixed with a `ws` polyfill, not by touching the locked Node version.
- **Verified live:** both containers build + start clean; `curl`
  confirmed `/api/v1/health` and `/api/v1/categories` (real seeded data)
  on `:3001`, web `200` on both `localhost:3000` and the LAN IP.
- **Not done:** these changes are UNCOMMITTED — this turn was a request
  for testing advice, not an explicit commit instruction, so per the
  git-safety rule (commit only when asked) they're left in the working
  tree on `chore/phase3-closeout` for review.
- **Next:** owner reviews/commits (or asks for a separate branch); mobile
  stays on `pnpm --filter @nogoolin/mobile start`, intentionally not
  containerized (Expo dev client needs the host's Android tooling).

### 2026-07-20 — Phase 3 web close-out (`chore/phase3-closeout`)
- **Task 1 (E2E integration check):** Built a real-Chrome (puppeteer)
  end-to-end suite against the production build — not a code read, an
  actual browser drive. 8/8 checks green: skip button visible + clickable
  within ~450ms of navigation and works instantly during the loading
  phase; skip jumps straight to the exact 35vh shrunk home with scroll
  unlocked; the 5s arc lands at the EXACT spec pose (az 0.0000, r 6.200,
  y 2.200); the morph height was traced at requestAnimationFrame
  resolution against the closed-form smootherstep curve with ZERO
  out-of-envelope samples (see bug below — this caught a real one);
  setViewOffset ramps to e=1 in sync with the morph, landing on
  phase=home; exactly one canvas element exists throughout (never
  remounted); prefers-reduced-motion → instant shrunk home with offset
  pre-applied; a same-tab reload after skipping does not replay the
  intro (sessionStorage). Mobile: **could not test — see Task 2.**
- **Real bug found & fixed:** the rAF height trace showed a one-frame
  collapse to 0px exactly at the morph→home boundary — a genuine visual
  pop, not a measurement artifact. Root cause: the container height had
  two writers (the imperative rAF morph driver AND a React `style` prop
  that set `height: undefined` in the home branch); the phase-change
  re-render clobbered the driver's inline height for one paint. Fixed by
  making height exclusively imperative (removed from the style prop
  entirely). Re-ran the full suite after the fix: 0 deviation. Logged in
  ERRORS.md with a "single-writer rule" prevention note.
- **Task 2 (asset-swap audit) — GLB:** re-verified by SIMULATION, not by
  re-reading old claims: set `DEITY_GLB_URL` to a fake path, ran
  `tsc --noEmit` + `next build` (both green), reverted. Confirmed exactly
  one line changes. While doing this, found and fixed a real gap: drei's
  `useGLTF` defaults to loading the Draco decoder from a Google CDN — a
  hidden runtime dependency the "one-line swap" claim didn't actually
  cover, since the final GLB IS Draco-compressed per spec. Self-hosted
  the decoder at `apps/web/public/draco/` (copied from three's installed
  package) and pointed `useGLTF(url, '/draco/')` at it.
- **Task 2 — Rive:** the task brief asserted a `feature/mobile-rive-intro`
  branch and implementation already existed. Verified this directly
  (`git branch --list`, grep for "rive"/".riv" across apps/mobile): **no
  such branch, no .riv file, no @rive-app dependency — only forward-
  looking code comments from Phase 1/2 ("Phase 3 replaces the plain stack
  entry with the Rive..."), never built.** Corrected the premise rather
  than fabricating an audit of code that doesn't exist. Converted the
  "re-verify the swap point" task into "write the contract the future
  code must satisfy" instead (Task 3).
- **Task 3 (ASSET_SPECS.md):** new file consolidating: GLB requirements
  (format/compression/size, +Y up axis, faces +Z, ~2.2 unit height,
  bottom-center origin, the verified one-line swap procedure, an
  acceptance checklist) and a PROPOSED Rive contract (artboard `Intro` at
  430×932, state machine `IntroMachine`, inputs `skip` trigger +
  `reducedMotion` bool, `finished` event, motion-principle notes, size/
  naming acceptance checklist) — explicitly labeled proposed-not-built so
  it reads correctly for someone learning Rive from scratch.
- **Task 4 (tracking):** PROGRESS.md Phase 3 status corrected to "web
  code-complete, asset-pending" (not "done" — D-04 needs the real GLB,
  Rive isn't started) with Phase 4-can-proceed-in-parallel called out
  explicitly per owner instruction; MEMORY.md "where we are" updated;
  TASKS.md backlog re-scoped (GLB/intro/morph items marked done and
  removed from backlog, Rive item corrected to "NOT STARTED" with the
  ASSET_SPECS.md pointer).
- **Next:** Rive intro build (whenever the owner's .riv or a placeholder
  is ready) + WF-HOME catalog section; Phase 4 can start now in parallel.

### 2026-07-20 — Intro camera system on placeholder (`feature/intro-camera-system`)
- **Done:** apps/web/src/components/intro/: intro-config.ts (ALL locked
  constants + DEITY_GLB_URL single swap point + GLB artist requirements),
  deity.tsx (WF-INTRO-03 placeholder / future GLB via config), intro-scene
  (CameraRig: position ONLY from (az,r,y) spherical; per-frame setViewOffset
  ramp, never cleared; breathing + particles per exact spec formulas),
  hero-intro (state machine, JS morph height driver sharing the camera's
  smootherstep, skip/loading/title/nav/copy overlays, reduced-motion +
  no-WebGL + returning-visitor paths, scroll lock, replay, ?debug=camera
  overlay), static-hero fallback; home page hosts hero + catalog slot.
  Deps: three 0.185, @react-three/fiber 9.6, drei 10.7 (lazy-loaded —
  home first-load stays 110kB, skip never blocked).
- **Verified:** type-check + build green; grep audit = exactly ONE camera
  position write (the arc formula), zero translateX/position.x, zero
  clearViewOffset; headless-Chrome virtual-time runs: endpoint az 0.0000 /
  r 6.200 / y 2.200 / x-drift 0.000; midpoint self-consistent (e=0.3525
  across all three params). No lateral-translate-bug symptoms observed
  (nothing to log in ERRORS beyond process notes).
- **Next:** home white catalog section (WF-HOME), then 360° viewer; GLB
  swap when the art asset lands (one line + D-04 re-tune).

### 2026-07-19 — Public catalog + SEO + mobile screens (`feature/public-catalog`) — PHASE 2 COMPLETE
- **Done:** web /products listing (server-rendered, WF-LIST: single-row
  chips + right fade, ?category/?q/?page URL state, 300ms debounce → API
  `search` param, numbered pagination, exact empty-state copy, skeleton via
  route group `(list)`) and /products/[slug] detail (breadcrumb, gallery +
  thumbnails, tabs w/ parsed numbered usage steps, inquiry CTA disabled til
  Phase 4, not-found page); SEO: generateMetadata (title/desc/OG/canonical),
  Product JSON-LD, dynamic sitemap.ts (walks all pages), robots.ts,
  next/image remotePatterns; mobile: products list (chips/search/2-col grid/
  pull-refresh/load-more) + [slug] detail (paged swipe gallery + dots,
  numbered steps) with TYPE-ONLY shared-schema imports; nav/footer shared
  public components. Seeded demo data (8 published incl. multi-image +
  1 draft) via scratchpad script w/ generated PNGs.
- **Verified:** SSR HTML contains products; NO draft/archived leakage
  (listing excludes, detail 404s); search hits for "Ногоон"/"green tara"/
  "nogoon dar eh"; 404 statuses correct after the route-group fix
  (ERRORS.md); sitemap 14 urls; Lighthouse (mobile, slow-4G sim): detail
  SEO 92 + Perf 100 (LCP 1.9s), listing SEO 100 + Perf 96 (FCP 0.9s,
  SI 1.4s, LCP 2.2s). meta-description audit is a false negative (tag
  verified in SSR HTML and post-JS DOM).
- **Next:** Phase 3 (⚠ highest-risk): GLB prep → 3D intro → shrinking hero
  (setViewOffset!) → 360° viewer → Rive mobile intro.

### 2026-07-19 — Admin UI wired to live API (`feature/admin-ui`)
- **Note:** owner's message said v0.dev components were pasted but none were
  attached — integrated the existing admin components from
  feature/admin-catalog-ui instead (same goal); flagged to owner.
- **Done:** API: GET /admin/categories (all + product_count via
  `products(count)` join; FR-ADM-005, 06-spec gap noted) + integration test
  (22/22 green). Web: lib/api/client.ts (envelope parsing, Bearer from
  Supabase session, 401→/login?next=…, XHR apiUpload with progress) +
  lib/api/admin.ts typed calls; CategoryTable/ProductTable/ProductForm
  rewired — loading/error/empty states, optimistic toggle + drag-reorder
  persisted via PATCH sort_order (revert on failure), server-side product
  filters + debounced search + meta pagination, create-product two-phase
  flow (POST → image upload w/ progress bar, upload-failure state offers
  retry or continue), client validation via the SAME shared Zod schemas,
  409/4xx errors surfaced inline. mock-data.ts deleted. next.config
  extensionAlias fix for NodeNext .js specifiers (ERRORS.md). Verified:
  type-check + next build green; CORS + 401 behavior confirmed against the
  running API.
- **Still mock/stub:** nothing uses mock data; product Засах (edit) button
  is a stub pending an admin get-by-id endpoint.
- **Next:** product edit page (+ GET /admin/products/{id}), manual browser
  smoke test, then public listing/detail (Week 3).

### 2026-07-19 — Admin catalog UI, mock data (`feature/admin-catalog-ui`)
- **Done:** /admin/categories (CategoryTable: drag-reorder, active toggle,
  product-count delete guard, add/edit modal with live slug preview),
  /admin/products (ProductTable: thumbnail/halo placeholder, category +
  status filters, search, publish-toggle/archive/delete with FR-ADM-008
  confirm dialogs), /admin/products/new (ProductForm: Cyrillic name + slug
  preview, category/price/status, markdown description, repeatable
  usage-instruction steps serialized to markdown, drag&drop multi-image
  zone with type/size validation + reorder + primary badge). Shared atoms in
  components/admin/ui.tsx; v4 tokens only, no red (saffron-deep = caution).
  All on MOCK data (lib/admin/mock-data.ts typed with shared schemas).
  Parent-category field from the request was intentionally NOT built —
  schema has no parent_id (docs/04, flat categories); flagged to owner.
  Verified: type-check + next build green (routes dynamic/auth-gated).
- **Next:** wire tables/form to the live API (fetch layer + mutations),
  then public listing/detail pages.

### 2026-07-19 — Catalog API (`feature/product-category-api`) — Phase 2 Week 1
- **Done:** local stack started (DOCKER_HOST workaround, ERRORS.md) — RLS
  true on all 11 tables, buckets created; migrations 0004 search_vector
  (generated tsvector over name+name_en+search_tags, drops old expression
  index), 0005 storage_policies, 0006 table_grants (CLI image grants gap);
  config.toml bucket declarations; validation-schemas updated to spec query
  params (+ productImagePatchSchema, images/category joins on Product);
  API: category/product/product-image/storage repositories + services +
  public/admin controllers, translit + slug utils, ApiError + global error
  envelope, @fastify/multipart; endpoints exactly per 06-api-spec (11 new
  routes); audit log on every admin mutation; /settings/public now {data}-
  enveloped per spec. Tests: 21 integration tests, idempotent, green twice;
  suite self-skips if stack down. All packages type-check.
- **Next:** admin web UI for categories/products, then public listing/detail.

### 2026-07-17 — Auth + admin + mobile init (`feature/auth-admin-scaffold`) — PHASE 1 COMPLETE
- **Done:** config.toml auth finalized (site_url localhost:3000, redirect
  allowlist incl. nogoolin:// deep link, sessions timebox 168h = 7d,
  [auth.external.google/facebook] via env() — placeholders OK);
  API: requireAuth/requireAdmin hooks per docs/phase-0/08 §5.4 + user/audit-log
  repositories + `/api/v1/admin/ping` smoke route; web: Next.js 15 app
  (@supabase/ssr cookies + middleware refresh, login/signup/reset/update
  password, /auth/callback PKCE exchange, OAuth buttons with not-configured
  state, protected /admin layout + dashboard, v4 tokens in globals.css);
  mobile: Expo SDK 52 dev-client/CNG app (expo-router, Zustand auth store,
  login/signup screens, eas.json with development profile); .env.example
  finalized; README OAuth redirect-URL guide + mobile build commands.
  Verified: all 4 packages type-check; `next build` passes (admin/callback
  dynamic, rest static); `expo prebuild -p android` generates native project.
  NOT verified at runtime (Docker still down). NOT pushed.
- **Next:** Phase 2 — runtime smoke test first, then storage buckets +
  category/product CRUD.

### 2026-07-16 — Local DB schema + backend structure (`feature/db-schema-local`)
- **Done:** Supabase CLI added as root dev dep (`pnpm exec supabase ...`);
  `supabase init` (config.toml: project_id nogoolin, jwt_expiry 900);
  3 migrations in `supabase/migrations/` — init_schema (6 enums, 11 tables,
  9 indexes, updated_at triggers), rls_policies (is_admin(), auth trigger,
  22 policies, RLS on all 11 tables), seed_system_settings
  (delivery_enabled=false); `packages/validation-schemas` implemented (9 src
  files: entity + input schemas per docs/phase-0/08 §7.2); `backend/api` layered
  scaffold (env config, supabase client factory, helmet/cors/rate-limit
  plugins, validateBody hook, DB-agnostic repository interfaces + supabase
  settings impl, settings service, health + /settings/public controllers);
  README local-dev docs; .env.example local values; migrations location
  moved database/→supabase/ (ADR-011, CLAUDE.md + workflows updated).
  Both packages type-check clean. NOT pushed (owner: wait for go-ahead).
- **Next:** start Docker → `supabase start` → verify migrations + RLS live.

### 2026-07-16 — Created agent-context/ layer
- **Done:** 9 files (PROJECT_BRIEF, DECISIONS, DB_SCHEMA, design, MEMORY,
  PROGRESS, TASKS, ERRORS, diagrams/×3) condensed from docs/; CLAUDE.md updated
  with session-start + task-end standing instructions. Branch `feature/agent-context`.
- **Next:** merge the three feature branches to `main`, create `develop`, then
  start Phase 1 Week 2 (Fastify init + Supabase).

### 2026-07-16 — Docker + CI/CD scaffolding (`feature/docker-cicd`)
- **Done:** `backend/api/Dockerfile` (builder + lean prod stage, pnpm deploy,
  non-root), `.dockerignore`, `docker-compose.yml` (hot-reload, env from .env,
  no local Postgres — cloud Supabase), 3 GitHub Actions skeletons with path
  filters + lint/typecheck gates. Mobile builds = manual workflow_dispatch (ADR-010).
- **Next:** agent-context/ layer (done — see above).

### 2026-07-15 — Monorepo scaffold (`feature/monorepo-setup`)
- **Done:** CLAUDE.md; folder structure; root package.json + pnpm-workspace.yaml;
  tsconfig.base.json; .gitignore; .env.example (placeholders only); README;
  stub package.jsons for 5 workspaces; layered src/ dirs in backend/api.
- **Next:** Docker + CI/CD scaffolding (done — see above).


### 2026-09-15 — ICSI405 consolidation and M2 documentation draft
- **Done:** Read Downloads handover plus W2 handout/Lecture 02 and Chinchilla pp. 53–55. Moved all 120 ICSI405 course files into `docs/ICSI405/`; original Git metadata preserved at `/home/tengis/Documents/Tengis/.git-recovery-20260915/ICSI405.git`. Kept submitted Seminar 1 content unchanged; updated course AGENTS for the explicit W2 Nogoolin pivot.
- **Done:** Grouped all 19 numbered Phase 0 files (01–10, EN/MN + YAML) into `docs/phase-0/`; repaired navigation and source references, including 16 pre-existing MN filename mismatches. Added docs, API, diagram, Phase 0 and course indexes.
- **Done:** Wrote Mongolian SRS/SDD templates, 5 testable requirements (2 FR + 3 NFR), 8-column traceability, one-page Scope Charter, a transparent W1-to-W2 persona bridge, and a peer-review draft. Exported editable LaTeX plus `docs/ICSI405/sem2/sem2_merged.pdf` (10 pages) and `SRS-Scope-Charter.pdf` (1 page).
- **Verification:** Original course files present; only AGENTS intentionally changed. 5 requirement IDs, 5 matrix rows/8 columns, 27 mapping rows; LaTeX font/overflow checks and visual PDF review. Details in `docs/ICSI405/sem2/tmp/validation-report.json`. No application runtime tests or product implementation changes; code/workflow edits only update documentation references.
- **Scope:** Owner explicitly asked to skip peer-review delivery and Confluence/LMS publication/submission because no recipients/links are available. No messages sent, commits pushed, or deployment performed.
- **Next:** W3 expand scoped SRS and get stakeholder input/persona-bridge review when available. NFR-03 remains a real gap: integration tests skip when local DB is unreachable, and CI does not provision it. Do not infer runtime success from a zero-exit all-skipped run. Later milestones: W4 architecture, W5 API drift reconciliation, W8 diagrams, W9 CI evidence.


### 2026-09-15 — Seminar 2 LaTeX build-on-save
- **Done:** Studied the read-only `rag_chatbot/.vscode/settings.json` and `report/.latexmkrc`. Added the same LaTeX Workshop onSave + latexmk/XeLaTeX workflow to Nogoolin, plus a focused `docs/ICSI405/sem2/sem2.code-workspace` for users who normally open the parent Tengis folder.
- **Done:** PDF + SyncTeX go directly to `sem2/`; aux/log files remain in `sem2/tmp/pdfs/`. Added local `.latexmkrc`; error messages remain visible. Changed `build.py` default to compile existing TeX; Markdown regeneration now requires explicit `--from-markdown`.
- **Verification:** Ran the exact editor build recipe successfully (10-page merged PDF + SyncTeX, no overflow/missing characters). Hash-checked all existing TeX sources unchanged. VS Code Ctrl+S event itself was not driven through the UI; workspace onSave config and the compiler command were verified.
- **Next/use:** Open sem2.code-workspace or Nogoolin as the VS Code workspace; edit latex/sem2_merged.tex, save, and use LaTeX Workshop's PDF preview. Exported 01–07 fragments are not inputs to the merged source.


### 2026-09-21 — Seminar 2 assignment re-audit
- **Verified:** Re-read the W2 handout (US-2.1–2.3, UE-2, DoD) and Lecture 02 slides 2, 5, 8 under the current `docs/ICSI438/` path. M2 asks for project-adapted SRS and SDD templates, IEEE section mapping, five testable draft requirements, eight-column traceability with a W1 persona link, a one-page Scope Charter, and peer-review draft. Full SRS writing (15 FR + 5 NFR) belongs to W3/M3.
- **Finding:** Existing files already contain mapping and the five required examples, but templates are overfilled with project implementation/design details, particularly SDD. A blank outline alone would also miss M2 requirements. Source interview remains missing; publication/delivery remain skipped per owner instruction.
- **Next:** Rework templates as section headings + what to fill + concise project context + planned/n-a status; keep five draft requirements and traceability distinct. Preserve manual TeX edits. This task only audited the assignment; no seminar sources/PDFs were rewritten. Existing ICSI405 references are stale after the folder became ICSI438.

### 2026-09-21 — Seminar 2 combined IEEE 830 + ISO 29148 template v0.2
- **Done:** Reworked the M2 SRS into an actual fillable template: IEEE 830 section structure and section-status mapping, plus an ISO/IEC/IEEE 29148-oriented requirement card (priority, source/owner/interview, Given-When-Then acceptance criteria, Test/Inspection/Analysis, dependency/risk/status) and the eight W2 quality-review questions. Reworked the SDD into a fillable design outline instead of a completed architecture narrative.
- **Done:** Kept the separate five requirement examples, eight-column/five-row traceability and W1 persona links. Made the peer-review draft explicit in the bundle and added a review question for the combined-standard approach. Preserved the earlier manual Scope Charter reader correction and corrected affected course paths/header to the current `ICSI438` location.
- **Artifacts:** Rebuilt `docs/ICSI438/sem2/sem2_merged.pdf` (10 A4 pages) and `SRS-Scope-Charter.pdf` (1 A4 page), plus editable LaTeX exports. Peer-review sending and Confluence/LMS publication remain intentionally skipped because no recipient or link exists.
- **Verification:** XeLaTeX completed with no overfull boxes, missing characters or undefined references; 96 local Markdown links passed; five IDs and five 8-column traceability rows were confirmed; all PDF pages were rendered and visually checked, including the landscape matrix and peer-review page.
- **Next:** Use the peer-review draft when a recipient becomes available; W3/M3 expands this template to the full 15 FR + 5 NFR SRS and records real stakeholder interview evidence.

### 2026-09-21 — Seminar 2 layout/content simplification
- **Done:** Indented all LaTeX section levels by the same 1.25 cm used for paragraphs. Removed `Бөглөх` from every SRS placeholder and removed the requested standards-disclaimer sentence. Shortened the persona metadata to `Өөрийн ажиглалт.`
- **Done:** Removed the “Таван шалгаж болох шаардлага” and “Peer review draft — M2” chapters from the merged report while retaining their separate source artifacts for the course. Converted the traceability matrix from landscape to portrait; it remains five rows by eight columns and wraps downward.
- **Artifacts:** Rebuilt the merged PDF as 7 portrait A4 pages and the Scope Charter as 1 portrait A4 page. Per owner preference, no screenshots or page-image rendering were produced for this and future routine LaTeX revisions.
- **Verification:** XeLaTeX passed with no overfull boxes, missing characters or undefined references; PDF text confirms both removed chapter titles are absent; `pdfinfo` confirms all seven merged pages are portrait A4; Git diff whitespace check passed.

### 2026-09-21 — Public repository link in Seminar 2 PDF
- **Done:** Added the public repository URL `https://github.com/Tengis01/Nogoolin` to the Scope Charter project identity, SRS §1.4 references, and SDD source-material paragraph. Rebuilt the merged report and standalone Scope Charter.
- **Verification:** Poppler URL annotation inspection confirms three clickable repository links in the 7-page merged PDF and one in the Scope Charter. XeLaTeX logs remain free of overfull boxes, missing characters and undefined references. No screenshots were produced.

### 2026-09-22 — Seminar 3 / M3 assignment audit
- **Done:** Read all 8 pages of Lecture 03 and all 4 pages of the Week 03 handout. M3 requires a published SRS v1.0 with 15 FR + 5 NFR, one traceability row and named test procedure per requirement, at least five FR mock-UI acceptance screenshots, an ISO-quality checklist, a three-error Human-vs-AI comparison, and a documented v0.9 → v1.0 peer-review loop. The separate mandatory UE-3 requires five Corg.ly FRs, an AI alternative, three Concise/Usable violations, a requirement diff, and a one-page reflection.
- **Gap:** The M2 seed currently has 2 FR + 3 NFR, so M3 needs 13 additional FRs and 2 additional NFRs. Week 03 explicitly uses `must/should/could`, which supersedes the M2 template's `must/shall/may` course notation for this deliverable. At least 16 of 20 requirements must receive trial-test evidence to satisfy the handout's 80% DoD. No peer recipient/comments or publication/submission link exists, so review, v1.0 finalization, and external publication cannot be claimed yet.
- **Next:** Build an honest v0.9 SRS from the scoped Nogoolin sources, expand the 20-row traceability and verification plan, create the AI-comparison and UE-3 artifacts, prepare five mock-UI acceptance images, run trial checks, then incorporate three real peer comments into v1.0 when a reviewer is available.

### 2026-09-22 — Seminar 3 scope decision
- **Owner decision:** Skip the peer-review loop and the 80% trial-test execution for M3. No real peer comments exist, and the main implementation has not started far enough to produce credible trial-test evidence within the available time. Do not fabricate review comments, test runs, logs, or pass results.
- **Documentation rule:** Keep test procedures and planned verification methods in the requirements and traceability matrix, but label execution evidence as not performed/pending. State transparently in the Seminar 3 README/report that peer review and the handout's 80% trial-test DoD were not completed; do not claim full compliance with those rubric items.
- **Remaining scope:** Complete the SRS content with 15 FR + 5 measurable NFR, 20 traceability rows, at least five mock-UI acceptance screenshots, ISO quality review, Human-vs-AI comparison with three corrected issues, UE-3 Corg.ly exercise, and written reflection.

### 2026-09-22 — Seminar 3 / M3 deliverable draft
- **Done:** Created `docs/requirements/srs-v1.0.md` with the scoped Nogoolin SRS: 15 FR, 5 NFR across five quality categories, Week 3 `must/should/could` priorities, source/owner, named procedures, measurable pass/fail boundaries, interface/context sections and the eight-item quality checklist. Added a separate 20-row/8-column traceability matrix.
- **Done:** Added five 1280×720 mock UI PNGs and editable HTML/SVG sources for inquiry form, inquiry success, inquiry history, admin inbox and wishlist. Added the three-error Use–Verify–Cite comparison, UE-3 Corg.ly five-FR exercise with diff and one-page reflection, and the Seminar reflection. External boundary examples cite Akamai (2-second catalog target) and Stripe (24-hour idempotency pattern).
- **Artifacts:** Created editable Pandoc/XeLaTeX sources, `.latexmkrc`, Ctrl+S workspace settings and `docs/ICSI438/sem3/sem3_merged.pdf` (16 A4 portrait pages). Corrected the nested course index/rules from stale ICSI405 labels to the actual ICSI438 path and linked Seminar 3.
- **Verification:** Source counts are exactly 15 FR, 5 NFR, 20 traceability rows and 5 mock PNGs. XeLaTeX completed with no overfull boxes, missing glyphs, undefined controls or LaTeX errors; the PDF is 16 portrait A4 pages and contains five 1280×720 image objects plus clickable public links. Per owner preference, PDF pages were not rendered to screenshots; mock UI artifacts themselves were visually reviewed once.
- **Explicit omissions:** Peer review/comment loop and 80% trial-test execution remain skipped by owner decision. The PDF says `v1.0 draft`, marks procedures not executed, and claims no requirement as verified. No application tests, remote publish, submission, commit or push occurred.
- **Next:** Owner reviews the wording and mock UI; edit the Markdown then run `python3 docs/ICSI438/sem3/latex/build.py --from-markdown`, or edit the generated TeX and use Ctrl+S. Add real peer/test evidence only if it later becomes available.

### 2026-09-22 — Seminar 3 print-template redesign plan
- **Reviewed:** Compared the Seminar 2 TeX standard with the first page and source of `rag_chatbot/report/main.pdf`. The current Seminar 3 Pandoc title is too sparse for a print-ready course submission.
- **Approved direction:** Preserve Seminar 2 typography exactly for body pages: Liberation Serif/Sans, 10.5/12.5 pt body, 1.25 cm paragraph and heading indent, `Large` sans/bold section headings, `normalsize` sans/bold lower headings, 4 pt table padding and 1.08 row height. Only the 8-column traceability matrix uses `footnotesize` and 2 pt padding; remove Seminar 3's current global `scriptsize` longtable override.
- **Print layout:** Adopt the internship report's A4 geometry: left 3 cm, right 2 cm, top 2.5 cm, bottom 2 cm, `includefoot`. Keep the Seminar 2 body header pattern (`ICSI438 / SEMINAR 03`, `Nogoolin / M3`) and page-number-only footer; suppress both on the cover.
- **Cover:** Recreate the internship report's institutional three-line heading, 6 cm NUM logo, centered assignment title, two-column metadata block, and Ulaanbaatar/2026 footer. Use course-specific fields: ICSI438, Seminar 3/M3, Nogoolin, Ph.D. Batnyam Battulga, Ц. Тэнгис, 22B1NUM6249. Copy the logo into the Seminar 3 area so the build does not depend on the separate rag_chatbot repository.
- **Remove:** Pandoc's generic title page; do not add a table of contents, list of figures, list of tables or list of code. Start the SRS directly after the cover and reset Arabic page numbering to 1.
- **Implementation next:** Extract a reusable course `sem3-title.tex` and unified style block, update the Pandoc build to inject the custom cover and Seminar 2 table rules, rebuild, and validate margins/font sizes/table wrapping/logs. This turn produced the plan only; Seminar 3 artifacts were not rewritten.

### 2026-09-22 — Seminar 3 print-template redesign completed
- **Done:** Replaced the generic Pandoc title with a custom NUM cover using the local 6 cm logo, institutional heading, course metadata and the exact course title `ПРОГРАМ ХАНГАМЖИЙН ТӨСЛИЙН БАРИМТ БИЧИГ`. The cover suppresses headers/page numbers; the SRS starts on Arabic page 1.
- **Layout:** Final A4 geometry follows the owner's correction: left 3 cm; top, right and bottom exactly 2 cm. Body typography now matches Seminar 2 at 10.5/12.5 pt with the same heading styles, 1.25 cm heading/paragraph indent, table padding and row spacing. Dense 8-column traceability and 5-column AI comparison tables use local `footnotesize`/2 pt padding only.
- **Artifacts:** Rebuilt `docs/ICSI438/sem3/sem3_merged.pdf` as 17 portrait A4 pages. Kept the exercise format direct: no table of contents, list of figures or list of tables. Updated the Markdown build path so `--from-markdown` reproduces the cover and local dense-table rules.
- **Verification:** XeLaTeX completed with no overfull boxes or table-width rerun warnings. `pdfinfo` confirms 17 A4 pages. Targeted visual QA checked the cover, portrait traceability matrix and Human-vs-AI table; margins, wrapping, headers and footer numbering are intact.

### 2026-09-22 — Seminar 3 second-level heading correction
- **Done:** Increased second-level headings such as `1.5 Баримтын бүтэц` from body-sized `normalsize` to `large` (about 12 pt), while keeping body text at 10.5/12.5 pt and third-level headings at body size with bold emphasis. This restores a clear H1/H2/H3 hierarchy without changing the approved margins or table rules.
- **Verification:** Regenerated the TeX from Markdown and rebuilt the 17-page A4 PDF. The final log has no overfull boxes or table-width warnings; per owner preference, no routine page screenshots were generated.

### 2026-09-22 — Seminar 3 third-level heading correction
- **Done:** Increased third-level headings such as `3.1 Хэрэглэгчийн интерфэйс` from 10.5 pt to 11.5/13.5 pt bold sans-serif. The hierarchy is now H1 `Large`, H2 `large`, H3 11.5 pt, and body 10.5 pt, avoiding the smaller-looking sans-serif effect reported by the owner.
- **Verification:** Regenerated and rebuilt the 17-page A4 PDF; no overfull boxes or table-width warnings were reported. No routine page screenshots were generated.

### 2026-09-22 — ICSI438 print rules saved to Obsidian
- **Done:** Consolidated the approved Seminar 3 revisions into `00-Vault/DESIGN-RULES.md` as the reusable ICSI438-only profile: 3/2/2/2 cm margins, 10.5/12.5 pt body, H1/H2/H3 hierarchy including the 11.5 pt H3 correction, 1.25 cm alignment, header/footer behavior, dense-table exceptions, NUM cover composition, direct exercise structure, and targeted PDF QA policy.
- **Reason:** Liberation Sans headings at the same nominal size as the serif body looked smaller. The saved rules explicitly prevent H2/H3 from reverting to body size and prevent global table shrinking when only one dense table needs adjustment.


### 2026-09-28 — Seminar 4 handout reconciliation and completed local package
- **Reassessed:** Read the newly supplied two-page Week 04 Lab Assignment. Its binding scope is populated arc42 §1/§3/§5, C4 Context/Container, Tech Stack/Persistence/Interface MADRs with W1 links, ≥80% functional mapping, UE4 Magic Container Before/After plus a one-page refactoring ADR, and book-based reflection. Lecture 04 is still absent.
- **Done:** Updated the canonical arc42 and 20-ID architecture traceability; added the Architecture workspace/ADR index, Interface MADR, W1 role/pain mapping, UE4 rework and reflection. Retained §6 dynamic views and the lean 12-section structure. All 15 FR have responsible building blocks (100%; orphan FR 0). NFR-03/05 gaps remain planned, not verified.
- **Artifacts:** Completed seven Mermaid sources/SVGs, pinned local CLI/lockfile, portable render/build scripts, editable Markdown/TeX and `docs/ICSI438/sem4/sem4_merged.pdf` (19 portrait A4 pages). Preserved the approved NUM cover, 3/2/2/2 cm margins, body/heading/table hierarchy and exercise format without a TOC. Git ignores compiler/QA caches; a clean checkout can compile committed SVGs without Mermaid/Chromium, then use Ctrl+S.
- **Verification:** Checked the 12 sections, exact 20 baseline IDs and SRS anchors, 7 source/render pairs, three MADR mandatory fields/persona links, local links, public URL annotations and the one-page UE4 ADR (physical PDF page 18). XeLaTeX completed without overfull boxes, missing glyphs, undefined controls or LaTeX errors. Targeted diagram/layout QA resolved labels, vector text and figure placement; no further routine screenshots were needed. A separate clean copy containing only committed LaTeX/assets rebuilt all seven vector intermediates and the PDF successfully; `git diff --check` passed.
- **Limitations:** W1 contains one developer persona, so three business actors explicitly map to that persona's pain points rather than claiming three original personas. No peer feedback, runtime tests, remote publication/submission, commit or push is claimed. The ≥80% M4 criterion is architecture mapping, distinct from the skipped M3 trial tests.
- **Next:** Owner reviews the local package; if the instructor requires three distinct original W1 personas, clarify that interpretation. Use the Seminar 4 README build commands for further edits.


### 2026-09-28 — Seminar 4 prevention rules saved to Obsidian
- **Done:** Added course-scoped Mermaid/SVG/vector-PDF/layout and portable-build lessons to `00-Vault/DESIGN-RULES.md`; added handout reconciliation, requirement coverage versus test execution, persona/source fidelity, MADR indexing and book/page/evidence checks to `00-Vault/WORKFLOW.md`. Updated the existing course index to link these rules and recognize the active ICSI438 path.
- **Instruction alignment:** Linked the vault rules from `docs/ICSI438/AGENTS.md` and replaced the stale requirement to screenshot every changed PDF page with targeted QA only for new layouts, suspected defects or explicit requests.
- **Verification:** Checked all Markdown file paths and heading anchors in the four edited knowledge files, reviewed the course instruction diff and preserved existing content. No PDF rerender, app tests or package installation were needed for this documentation-only change.
- **Next:** Apply the course workflow before the next seminar and reuse the approved print/diagram build profile; update only newly verified lessons.

## 2026-09-29 — ICSI438 durable course knowledge foundation

Analyzed the two W01–W15 combined handout PDFs; added COURSE-HOME/ROADMAP, weekly tracker, documentation standard/template, reusable knowledge notes and Sem5 source/preparation index. Preserved existing Sem1–Sem4/PDF/code; marked external review/test/submission gaps explicitly. Shared course-maintainer skill keeps Obsidian course docs authoritative. Next: use Sem5's actual handout for OpenAPI/code sample preparation; no implementation, deployment, new coursework submission or scheduled automation executed. See docs/ICSI438/COURSE-HOME.md.

## 2026-10-01–02 — ICSI438 Seminar 5 local lab draft

- **Done:** Read the specific W5 handout and targeted Bhatti Ch.5/Chinchilla Ch.6 pages; built a five-operation OpenAPI 3.0.3 slice from actual Nogoolin controllers/Zod schemas, reusable security/error/data schemas, examples, and Sem3/Sem4 trace links. Added three editable UE-5 Corg.ly Python samples, honest five-axis audit (3.6/5), exactly 100-word Swagger-vs-Redoc decision, reflection, course-consistent editable TeX and five-page A4 PDF. Built local Swagger UI and Redoc HTML from the same YAML, pinned Swagger UI dependency, updated Sem5 README and course progress.
- **Verified:** Redocly lint valid/0 errors (two metadata/local-server warnings), Python syntax, 100-word count, Redoc build, local HTTP 200 for both HTML pages/YAML/Swagger asset, Markdown links, PDF A4/page count and no TeX overfull/missing glyph/compile errors. No routine PDF screenshots. Existing app code untouched.
- **Open:** Corg.ly server/field contract and real returned payload unavailable; samples not live-tested. Public Swagger/Redoc URLs, functional Try-It-Out, workspace upload, CI bonus, commit/push, and grade not claimed; audit remains below 4/5. Sem3 FR-03 says eight digits but current `phoneSchema` allows 8–15 characters with punctuation; mini-spec follows implementation and documents drift.
- **Next:** Resolve phone rule in SRS or code by product decision; obtain a real Corg.ly sandbox/contract or approved mock, capture responses, repeat audit, and publish/verify two URLs only when hosting is provided and authorized. Continue to W6 handout when available.

## 2026-10-05 — Sem5 repo and renderer links in report

- **Done:** Added the `origin`/`main`-derived GitHub URL for `docs/ICSI438/sem5` and identified `renderers/redoc.html` and `renderers/swagger.html` near the start of the Seminar 5 report and README. Regenerated the editable TeX and five-page PDF.
- **Verified:** PDF contains the visible URL and clickable GitHub/renderer annotations; A4/page count and LaTeX log remain clean, Markdown local links resolve, `git diff --check` passed. Remote GitHub page availability was not confirmed; no push or publication occurred.
- **Next:** Keep the link aligned if the remote branch/path changes; remaining Sem5 runtime/public DoD is unchanged.

## 2026-10-06 — ICSI438 Seminar 6 local code-documentation package

- **Source/scope:** Read the two-page Sprint 06 handout, relevant current services/controller/schema and targeted Bhatti Ch.4/5 + Chinchilla Ch.3/6/7/9 pages. Specific handout supersedes the narrow W06 roadmap preparation. User confirmed no GitLab project exists.
- **Done:** Added structured JSDoc to all 44 symbols of six selected backend service modules (23 methods); internal-helper exclusion explanations; corrected the misleading inquiry lifecycle comment. Built TypeDoc HTML/JSON, AST inventory, 37 snippet type-checks, source-based inquiry audit/diff and a clearly disclosed controlled faulty draft/negative fixture. Added warning-as-error GitLab CI include/Pages jobs, an allowlisted standalone source export and mobile encrypted-session issue draft/local TODO link. Created editable Markdown/TeX and five-page A4 sem6_merged.pdf using the approved NUM/course template, GitHub Sem6 URL and on-save workspace. Updated course home/roadmap/progress and reusable knowledge.
- **Verified:** 44/44 scoped documentation; 9/9 tests (7 inquiry behavior, snippet compiler check, reflection); TypeDoc zero warnings; six services plus mobile emitted JavaScript unchanged. Clean standalone bundle cached install/check/test/build passed. CI YAML parse/include/job structure, local generated HTML/Markdown links and PDF required content/clickable URL/A4/pages/no overfull or missing glyph/compile errors checked. No routine PDF screenshots.
- **Open/limits:** No GitLab pipeline execution/CI Lint/Pages URL/issues/submission/grade/commit/push. Scope is six service modules, not every repo export. Baseline is AI-assisted, not falsely attributed to independent manual authoring; controlled/seeded faults are not spontaneous GPT-4/Claude output or discovered hallucinations. Those literal handout criteria remain open. Product behavior unchanged; pre-existing unrelated edits preserved.
- **Next:** Owner reviews local PDF/reference. If a GitLab project is created, export only the allowlisted source and verify actual CI/Pages/issue IDs. Obtain independent manual/model comparison if required; use the specific Sem7 handout next.

## 2026-10-07 — AI context consolidation and structure/storage review

- **Found:** duplicated stack/rules/status in AGENTS/CLAUDE/MEMORY/PROJECT_BRIEF;
  stale Phase 1 brief, contradictory archived phase labels, and six duplicated
  OpenSpec workflow bodies with only provider invocation wording differences.
- **Changed:** AGENTS is the shared rule source; CLAUDE and MEMORY route to it
  and relevant evidence. PROJECT_BRIEF content is routed through MEMORY and
  original vision/scope sources. Hermes metadata/entry points load canonical
  .agents workflows. Product records retain dates; archived checklists are
  marked historical. README course/migration/status paths corrected.
- **Storage review:** system TeX installation is shared; local dependency/tmp
  trees account for most repository storage. Cleanup/template/tool migration
  remains a plan, not implemented by this documentation task.
- **Validation:** local links, skill metadata/shared-body routing, historical
  record preservation and focused diff checked; no app/PDF rebuild required.
  Bundled skill validator rejects an unchanged OpenSpec compatibility key;
  standard fields/body passed separately with that extension omitted only in
  temporary validation copies. Hermes runtime discovery was not exercised.
- **Next:** use task-specific source and fresh evidence; perform the separate
  storage/template cleanup plan when requested. No product behavior changed.

## 2026-10-07 — Documentation conversation handoff

- Saved [DOCUMENTATION-ICSI438](../../00-Vault/Handoffs/DOCUMENTATION-ICSI438.md)
  with accepted scope/style, dated local verification, open criteria and the
  unimplemented storage plan; linked existing sources instead of copying them.
- Checked eight sections and local links/anchors. No raw chat archive, app source,
  tool configuration, PDF rebuild or external publication in this task.
- Next: new agent reads the minimal handoff/startup set and follows the user's
  next selected task; preserve the existing uncommitted context cleanup.

## 2026-10-07 — Locate original UI prototype

Confirmed `docs/nogoolin-prototype-a-v4.html` exists and is linked from the documentation index; returned its path. No design changes.

## 2026-10-08 — Standalone Nogoolin concept B

- **Done:** Added `docs/nogoolin-prototype-b-codex.html` as a separate Mongolian
  public-flow concept (home, searchable/filterable catalog, product detail,
  inquiry). Kept prototype A intact. The new direction uses an editorial
  ceramic-garden palette, authored SVG product studies and an optional
  Three.js hero with a static fallback. Demo inquiry is local-only and clearly
  says it does not send or retain personal data.
- **Verified:** 19 earlier browser assertions passed; final desktop/mobile
  visual review passed at 1440px and 390px with no horizontal overflow, and
  focus on the main region has no outline. Inline JavaScript syntax and
  `git diff --check` passed. Impeccable detector reported only its generic
  cream-palette warning; this palette is an intentional fit for the ceramic
  product concept. Remote font/Three.js loading was blocked in the local
  browser, so the final visual check used the static SVG fallback.
- **Next:** Review the standalone concept in a normal browser; implementation
  remains a design prototype, not an integration into the application.

## 2026-10-08 — Durable UI handoff

- Saved [NOGOOLIN-UI-CONCEPT-B](../../00-Vault/Handoffs/NOGOOLIN-UI-CONCEPT-B.md)
  with scope, accepted decisions, verified prototype state, external-loading
  limits, next steps and the minimum agent reading set. Linked it from the
  AI workspace handoff instead of duplicating the UI details there.
- **Next:** Future UI work starts from this handoff and rechecks current source
  per AGENTS.md; no app integration was authorized by the handoff task.

## 2026-10-14 — ICSI438 course docs split into a GitLab repo

- **Done:** Moved `docs/ICSI438` to its own repo,
  [gitlab.com/Tengis01/icsi438-nogoolin](https://gitlab.com/Tengis01/icsi438-nogoolin)
  (local `/home/tengis/Documents/Tengis/ICSI438`), history kept via
  `git filter-repo`. It pins this repo as the `product/` submodule (`885e591`).
  Removed `docs/ICSI438` and the root `.gitlab-ci.yml` here; product docs
  (arc42, SRS, ADRs, traceability) and the mobile session comment now link to
  the GitLab copies.
- **History rewrite:** With owner approval, rewrote this repo's history to drop
  books, lectures and lab handout PDFs from every commit, then force-pushed
  `main` and `chore/phase3-closeout`. Old SHAs such as `424e6af` are gone; do
  not push from any older clone. GitHub may still serve cached old commits by
  SHA until GitHub Support purges them (not requested yet).
- **Verified:** Rewritten HEAD tree is identical to the pre-rewrite tree
  (15 commits, pack 18.8 → 3.8 MiB). Deploy workflows were not triggered
  (path filters). GitLab pipeline `2945035909`: `sem5-openapi`, `sem6-docs`,
  `pages` all passed; Pages is public at <https://icsi438-nogoolin-442a5f.gitlab.io/>.
- **Next:** Course work continues in the ICSI438 repo; see
  [DOCUMENTATION-ICSI438 handoff](../../00-Vault/Handoffs/DOCUMENTATION-ICSI438.md).
  Uncommitted owner changes in this repo (AGENTS.md, agent-context/*, README.md,
  .hermes skills) were preserved and remain uncommitted.

## 2026-10-14 — Standalone Nogoolin prototype C

- **Done:** Added `docs/nogoolin-prototype-c.html` (single standalone file,
  ~173 KB; A and B untouched). Intro reuses prototype A's 3D scene but is
  click-driven: 4 clicks/keys move the camera on circular arcs around the deity
  (upper-right start → left → right → left → centre, burst-then-decelerate
  easing), one sentence per step, final «НОГООЛИН» + [Эхлэх] → morph to a home
  hero (deity right via `setViewOffset`). Site below uses the «thangka mount»
  world (jade/paper/gold-line, maroon accent, Literata + Golos Text), authored
  SVG studio renders labelled «Demo дүрслэл», and working home, categories,
  products (filter/search/pagination/empty), detail (tabs, drag-only 360°
  placeholder), inquiry (07 §3.6.2 strings, local-only demo success), about,
  not-found and mobile menu. Built from fragments by parallel subagents.
- **Spec deviations (prototype only, owner request):** click-driven orbital
  intro replaces WF-INTRO-02's single automatic arc and WF-MO-03's camera
  limits; home hero is taller than 35vh/42vh; the C palette differs from v4
  tokens. Production adoption needs a DECISIONS.md entry first.
- **Verified:** Inline JS `node --check`; Playwright CLI at 1440×900 and
  390×844 with a local Three.js r128 copy: intro steps/keyboard/skip/replay/
  reduced-motion, all routes, inquiry errors/success, no horizontal overflow,
  no console errors except blocked fonts. One fix batch + one recheck.
  Impeccable detect: 2 remaining warnings (scroll-lock clip during intro;
  cream background, intentional).
- **Not verified:** Google Fonts and the Three.js CDN were blocked in the test
  browser (fallback fonts; local three copy). No commit/push.
- **Next:** Owner reviews C in a normal browser; adjust intro sentences/timing.

## 2026-10-18 — SMART goals, D-08, roadmap v2, Document Register, SRS v2

- **Done:**
  - `docs/project/project-goals.md`: main goal plus SMART goals G1–G6. Each goal has an outcome, a metric and a measurement method, plus a segment table, non-goals, risks and proposed dates. Launch is proposed for 2027-01-29.
  - D-08 (Concept C is the main design) is in `agent-context/DECISIONS.md`. D-02 is resolved as maroon accent only. `design.md` has a superseded banner.
  - `docs/project/roadmap.md` is roadmap v2 with PH0–PH8 and an old→new mapping. The old 10-roadmap (EN/MN) is marked legacy, and PROGRESS links to the mapping.
  - `docs/README.md` is now the Document Register: Doc IDs, statuses, a seminar → doc mapping, and a document-clarity checklist.
  - SRS v2 (`docs/requirements/srs-v2.md`): 308 blocks, 247 of them leaf requirements, with sparse hierarchical IDs (FR/NFR-<AREA>-100/110/111). It ships with `traceability-v2.md` (247 rows) and `id-mapping.md` (202/202 old IDs). Area sections were written by 3 parallel subagents, then merged and consistency-checked.
  - ADVANCED-WEB-GUIDE findings F-01…F-12 are reflected in all of the above.
- **Verified:**
  - A script checked for 0 duplicate IDs, 0 unmapped old IDs, 0 undefined mapping targets, and one trace row per leaf.
  - All internal links and anchors in the new and changed docs resolve.
  - `git diff --check` is clean.
- **Not verified:**
  - Implementation status was read from code only; no tests were run.
  - No owner review has happened, and all dates and thresholds are proposals.
  - Two links in PROGRESS.md (`../docs/ICSI438/...`) were already broken before this change and are left as-is.
- **Next:**
  1. Owner approves G1–G6 and the dates, gives the course's names for the 5 requirement checks, and answers SRS v2 §8.
  2. Separate security tasks, one small diff each:
     - F-05 / NFR-SEC-240: escape the JSON-LD at `apps/web/src/app/products/[slug]/page.tsx:85`.
     - NFR-SEC-350: check at runtime whether a customer can change their own `users.role` through the `users_update_own` RLS policy.
     - FR-SET-220: `orders_insert_own` does not check `delivery_enabled`.
  3. Start PH2 (perf baseline, DESIGN.md token hierarchy).

## 2026-10-27 — Code audit vs SRS v2 (quality + architecture)

- **Result:** [docs/quality/code-audit-2026-10-27.md](../docs/quality/code-audit-2026-10-27.md).
  Code provenance: written 2026-07-14…26 on `chore/phase3-closeout` (30/32 commits
  co-authored by Claude Fable 5), squashed into main as `4528492 "ICSI405 merge"`.
- **Key findings:** C1 customer→admin escalation via `users_update_own` + empty
  grants migration (static read, runtime unconfirmed); non-UUID path params → 500;
  DB constraint errors → 500; non-atomic mutation+audit/storage; CI integration
  tests all skip; web bypasses API for `public.users`.
- **Not verified:** no `node_modules` (type-check/lint not run), Docker off
  (integration tests not run), no browser check.
- **Next:** P0 in the report §5 (C1 migration + test, params/DB error mapping, CI Supabase).

## 2026-10-27 — D-09: product media and specification standard

- **Result:** Owner approved D-09 and it is recorded. Tiered shot list
  (Tier A 4–5, Tier B 2) resolves D-03. The per-product 360° becomes a photo
  spin for selected products (amends D-07, stays PH8). Size, weight and
  material are stored as structured fields, not on images.
  - Updated DECISIONS.md and ASSET_SPECS.md §3.
  - SRS v2: new FR-PROD-190, FR-PUB-250, FR-PUB-260; FR-PUB-240 and
    FR-MOB-130 amended; §7.2/§7.3 counts updated.
  - Updated traceability-v2.md, roadmap PH3/PH5/PH8, project-goals G1-A.
- **Not done:** no code change. FR-PROD-190 (migration + Zod + admin form) is
  in the PH3 remainder, after the audit's P0 security fixes.
- **Note:** the sample images in ~/Pictures/Nogoolin_product look
  AI-generated (two elephant shots differ in trunk, ears and lid). Owner to
  confirm before real content entry.

## 2026-10-27 — Version bumps and the keep-history rule

- **Result:** Owner rule recorded: improvements must leave a trace, earlier
  versions are never erased. Added to AGENTS.md → "Maintain knowledge once".
  - Applied to the D-09 edits. SRS v2.0→v2.1 and traceability v2.0→v2.1 (new
    change-history tables; FR-PUB-240 and FR-MOB-130 keep their v2.0 wording
    in "Өмнөх (v2.0)" lines).
  - Roadmap v0.1→v0.2 and project-goals v0.1→v0.2, both with history.
  - DECISIONS D-03 keeps its previous status text. ASSET_SPECS gained a
    changelog.
  - Register docs/README.md v1.0→v1.1, with versions synced and the audit
    added as QA-05 v1.0.
