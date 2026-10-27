# Asset Specs — Green Tara GLB, Mobile Rive Intro, Product Photography

> Handoff spec for the final art assets. The GLB contract is LOCKED and
> code-ready (the web intro runs on a placeholder today). The Rive contract
> is a PROPOSED engineering contract — the mobile Rive intro is NOT yet
> implemented (no feature branch exists as of 2026-07-20), so the .riv can
> be built against this spec in parallel with (or before) that code.

## Changelog

Earlier contract text is not deleted; superseded items are marked, not removed.

| Date | Change |
|---|---|
| 2026-10-27 | Added §3 Product photography standard (D-09); title now includes product photography. §1 and §2 unchanged |
| 2026-10-21 | §1: added "Sourcing the model" options and status (Meshy, Hunyuan3D-2, photogrammetry) |
| 2026-07-20 | §1 GLB contract locked; §2 Rive contract proposed |

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

### Sourcing the model (options, checked 2026-10-21)
- **Meshy:** 7.1 image-to-3D gave a good result, but downloading needs Pro.
  6 lite was poor. Do not extract the GLB from Meshy's viewer: that breaks
  their terms and leaves commercial-use rights unclear. If you choose Pro,
  take one month, download, then cancel. Check that the plan includes
  commercial-use rights first.
- **Blender alone cannot do image-to-3D.** Use Blender only after you have a
  mesh: decimate, downscale textures, export GLB, then apply Draco as above.
- **Hunyuan3D-2 (open weights, `tencent/*` on Hugging Face).**
  - Download sizes come from the HF API, 2026-10-21. Each file exists as both
    `.ckpt` and `.safetensors`; download only one.

    | Option | Download | Fits local GPU (RTX 4070 Laptop, 8 GB)? |
    |---|---|---|
    | HF Space demo | none (upload image, get GLB ~10–50 MB) | n/a |
    | `Hunyuan3D-2mini`, turbo, shape only (`hunyuan3d-dit-v2-mini-turbo` 3.82 GB + `hunyuan3d-vae-v2-mini-turbo` 0.41 GB) | ≈ 4.2 GB | likely |
    | 2mini shape + texture (paint model from `Hunyuan3D-2`) | + ~5–7 GB | texture step likely exceeds VRAM |
    | `Hunyuan3D-2.1`, full (shape 7.37 + 0.66 GB, paintpbr ≈ 6.9 GB) | ≈ 15 GB | no (officially needs ~10 GB+ / ~21 GB VRAM) |

  - Any local install also needs PyTorch + CUDA, about 3 GB more.
    Disk space is not a constraint (~236 GB free).
- **Plan:**
  1. Try the HF Space with the same image used in Meshy 7.1, and compare.
  2. If it is good enough, install 2mini-turbo locally (≈ 7 GB total) to
     generate the shape. Add texture via the Space or Blender, then optimise
     to ≤ 5 MB.
  3. If it is clearly worse than Meshy 7.1, skip the download. Use Meshy Pro
     (one month) or photogrammetry instead: 50–80 photos of the real statue
     around 360°, even light, processed with RealityScan or Meshroom.
     Photogrammetry gives the true product rather than an AI guess.
- **Status:**
  - 2026-10-21: the owner tried the Hunyuan3D-2 HF Space. The result was very
    poor: only the rough overall shape, no detail. Local Hunyuan install is
    dropped per step 3.
  - Nothing has been downloaded or installed. D-04 stays open.

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

## 3. Product photography standard (D-09)

> Decided 2026-10-27. Resolves D-03. Applies to every product image uploaded
> through admin. The per-product photo spin (PH8) reuses the same setup.

### Shot list by tier

| Tier | Products | Shots, in gallery order |
|---|---|---|
| A: high detail | Deity statues, incense burners, ornate pieces | 1 front · 2 side · 3 back · 4 detail close-up (face, crown or engraving) · 5 base underside (shows whether it is sealed/consecrated) |
| B: simple or small | Malas, incense, khadag, small vessels | 1 front · 2 side · (optional) 3 detail close-up |

Shot 1 is the primary image (card and OG image). Do not upload multi-view
composites (several angles in one image) as product images: they duplicate
the gallery and are too small on mobile. Use them only for marketing.

### Capture rules

- [ ] Real product only. AI may remove the background or balance colour; it
      must not redraw or "enhance" the object (2026-10-27 sample review: two
      AI images of the same elephant showed different trunks, ears and lids)
- [ ] One aspect ratio for all products: **4:5 portrait** (1600×2000 source,
      ≥2000 px long side for zoom)
- [ ] Object centred, filling ~80–85% of the frame height
- [ ] Camera at the object's mid-height; same light setup for every product
- [ ] Background: plain, consistent, and matched to the C paper tone, or
      removed (transparent). Pure #FFFFFF boxes clash with the C paper
      background
- [ ] No text, rulers or dimension lines in the photo. Size, weight and
      material go in product fields (FR-PROD-190); the UI may draw a
      dimension overlay from those fields (FR-PUB-260)

### Delivery

- Format: WebP (or AVIF), target ≤ 300 KB per image after export
- Filename: `<slug>-<nn>-<view>.webp`, e.g. `green-tara-01-front.webp`
- Alt text: "<product name> — <view>" (NFR-SEO-330)

### Photo spin (PH8, selected Tier A products only)

- 24–36 frames on a turntable, same camera, light and background as above
- Exported as a numbered WebP sequence, loaded only when the visitor opens
  the spin
- Enabled per product by an admin flag; products without it show the gallery
