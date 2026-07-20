# Asset Specs — Green Tara GLB & Mobile Rive Intro

> Handoff spec for the final art assets. The GLB contract is LOCKED and
> code-ready (the web intro runs on a placeholder today). The Rive contract
> is a PROPOSED engineering contract — the mobile Rive intro is NOT yet
> implemented (no feature branch exists as of 2026-07-20), so the .riv can
> be built against this spec in parallel with (or before) that code.

## 1. Green Tara GLB (web 3D intro — deity model)

### File
| Requirement | Value |
|---|---|
| Format | single `.glb` (binary glTF 2.0) |
| Compression | Draco, via `gltf-pipeline -i in.glb -o out.glb --draco.compressionLevel 10` |
| Max size | **≤ 5 MB after compression** (NFR-PERF-005 / FR-3D-009 — hard limit) |
| Textures | PBR metallic-roughness; ≤ 2048px per map; KTX2 preferred, PNG/JPG accepted |
| Contents | geometry + materials ONLY — **no** animations, cameras, lights, or skeleton |

### Orientation, scale, origin
| Convention | Value |
|---|---|
| Up axis | **+Y** (glTF standard) |
| Facing | deity faces **+Z** (camera finishes at azimuth 0 on the +Z axis looking toward −Z — the figure must meet the viewer head-on) |
| Units | meters (glTF standard) |
| Expected bounding box | ≈ **1.6 (w) × 2.2 (h) × 1.2 (d)** — standing height ~2.2 units |
| Origin | **bottom-center** of the figure at (0, 0, 0), centered on x=0/z=0 — the scene lifts it onto the pedestal top (y = 0.35); do NOT bake any pedestal or ground into the file |

### How the swap works (verified 2026-07-20)
1. Host the file (Phase 6: Supabase `model-assets` bucket; local dev is fine
   from `apps/web/public/models/`).
2. Change **one line** — `apps/web/src/components/intro/intro-config.ts`:
   `export const DEITY_GLB_URL: string | null = '<url>';`
   (verified by simulation: type-check + production build green with a URL set)
3. The placeholder icosahedron + wireframe hint disappear automatically.
4. Draco decoding is **self-hosted** at `apps/web/public/draco/` — no CDN
   dependency; nothing else to configure.
5. Then resolve **D-04** (composition re-tune on the real silhouette): the
   only tuning knobs are `VIEW_OFFSET_FRACTION` and `DEITY_SCALE` in the
   same config file. The camera arc numbers are design-locked — do not
   touch them to "fix" composition.

### Acceptance checklist (run before hand-back)
- [ ] `.glb` ≤ 5 MB, opens in https://gltf-viewer.donmccurdy.com/ without errors
- [ ] Faces the viewer when looking down −Z; up is +Y
- [ ] Height ≈ 2.2 units; origin at feet, centered on x/z
- [ ] Set `DEITY_GLB_URL` locally → intro plays with the figure on the
      pedestal, halo ring concentric behind the head area
- [ ] During the "Эхлэх" morph the figure stays perfectly head-on (no
      apparent rotation — that would indicate a scene bug, report it)

## 2. Mobile Rive intro (.riv) — PROPOSED CONTRACT

> Status: engineering for this is NOT built yet. This contract is what the
> code will implement; building the .riv to it means zero rework. Keep it
> beside you while learning Rive — every named string below is an API the
> code will call.

### File
| Requirement | Value |
|---|---|
| Format | `.riv` (Rive runtime file), single artboard used by the app |
| Target size | ≤ 500 KB (vector-first; embed only essential raster assets) |
| Runtime | `@rive-app/react-native` (Nitro runtime — the reason the app uses a dev client, not Expo Go) |
| Fonts | embed/outline any text — no system-font dependency (Cyrillic "НОГООЛИН" must render identically everywhere) |

### Artboard
| Property | Value |
|---|---|
| Name | `Intro` |
| Size | **430 × 932** (9:19.5 portrait reference frame) |
| Fit | code will use `Fit.Cover`, `Alignment.Center` — keep essential content inside a centered ~390 × 800 safe area; edges may crop on other aspect ratios |
| Background | radial feel per design lock: `#245842` center → `#1B4634` edge (never flat dark, reads as pitch black); saffron `#F2C94C` accents; ivory `#F5F2E6` text; **no red** |

### State machine (the code↔asset API)
| Item | Name | Type | Behavior |
|---|---|---|---|
| State machine | `IntroMachine` | — | auto-plays the intro on artboard load |
| Input | `skip` | **trigger** | fired by the app's skip button (visible ≤1 s, FR-3D-005) → jump to the final frame/state immediately |
| Input | `reducedMotion` | **boolean** | set true at load when the OS prefers reduced motion → render the final composed frame with no animation (NFR-ACC-004) |
| Event | `finished` | Rive **event** | fire exactly once when the intro completes (naturally OR via skip) — the app listens for this to navigate to Home (FR-3D-011) |

### Motion content
- Duration: **4–5 s** natural play (web arc is 5 s — keep the platforms
  feeling related).
- Follow the motion principles (they apply to Rive too, WF-MO-01…03): the
  deity/subject artwork itself stays still; atmosphere (glow, particles,
  halo opacity) breathes; movement should feel like an *arrival*, not a
  spin.
- A tap anywhere may also advance (FR-3D-011 "completion or user tap") —
  the app will fire `skip` for taps; no separate input needed.

### Acceptance checklist
- [ ] Plays in the Rive editor preview start→finish, fires `finished`
- [ ] `skip` trigger from ANY point lands on the identical final frame
- [ ] `reducedMotion=true` shows the final frame statically
- [ ] File ≤ 500 KB; artboard/state-machine/input names EXACTLY as above
      (they are string-matched in code)
