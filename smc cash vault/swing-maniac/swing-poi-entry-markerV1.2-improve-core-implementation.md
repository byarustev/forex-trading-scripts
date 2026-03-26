# Core Implementation: `Swing POI Entry Marker` (v1.2 improve)

## Purpose (high level)
This Pine Script builds a multi-timeframe trading “permission + POI + execution” engine:

- Tracks **market structure** (swing + internal) to maintain a **directional bias**.
- Computes an **external HTF bias** with a **flip-warning → BOS-confirmed** workflow (so CHoCH alone does not fully flip permissions).
- Creates a library of **Strong POI zones** (demand for longs, supply for shorts) from multiple sources:
  - swing structure POIs
  - impulse external-confirmation POIs
  - Cash-Vault HTF POIs (OB/FVG + optional swing-OB merge)
  - optional large directional FVG POIs
  - optional continuation sweep FVG “revisit” POIs
  - optional expansion-leg inefficiency context POIs
- Evaluates which zones are **valid** in **discount/premium context**, whether price is **near** or **touching**, and whether the reaction is structurally consistent.
- Either:
  - creates a **limit-style active zone** and triggers an entry on mitigation into the zone, or
  - triggers a **continuation NOW** signal immediately when continuation criteria are met.
- Draws boxes/lines/labels and exposes alerts for “now” and “limit setup” events.

## Main architectural blocks

### 1) Constants + Inputs
- Constants define:
  - leg direction: `BULLISH_LEG`, `BEARISH_LEG`
  - bias: `BULLISH`, `BEARISH`
  - flip states: `FLIP_STATE_NORMAL`, `FLIP_STATE_WARNING`
- Inputs control:
  - swing/internal sensitivity (`swingsLengthInput`, `internalLength`)
  - LTF entry criteria (CHOCH proxy + displacement rules)
  - confirmation TF mapping (auto map by chart TF)
  - Cash-Vault POI augmentation
  - premium/discount evaluation
  - filters (ADX minimum, consolidation/accumulation gating)
  - POI/zone visuals and alert outputs

### 2) Data structures
The script uses Pine `type` structs:

- `pivot` stores:
  - current/last level
  - “crossed” flag
  - bar time/index for when the pivot level was updated
- `trend` stores:
  - bias (`t.bias`)
- `trailingExtremes` stores:
  - running structural extremes used as reference points for reaction/selection logic

Zone/POI state is tracked via many `var` scalars plus arrays:
- `demandZoneTops/Bots/Bars/Touches/Inside/ParentEq`
- `supplyZoneTops/Bots/Bars/Touches/Inside/ParentEq`
- continuation/extra-context arrays:
  - `bullSweepFvg*`, `bearSweepFvg*`
  - `bullExpansionFvg*`, `bearExpansionFvg*`

### 3) Helper functions (split responsibilities)
- **Lux-style leg/swing detection**
  - `leg(size)`, `startOfNewLeg()`, `startOfBullishLeg()`, `startOfBearishLeg()`
  - `getCurrentStructure(size, internal)` returns new POI events when a leg starts
  - `displayStructure(internal)` returns CHoCH-like vs BOS-like break booleans
- **LTF entry criteria**
  - `f_entryCriteriaTf()` produces CHOCH proxy booleans and displacement/impulse booleans for a TF via `request.security`
- **Cash-Vault HTF POI packs**
  - `f_cvObFvgPack()` extracts OB+FVG-like proxy levels
  - `f_cvSwingObPoi()` derives swing-OB style POI ranges by scanning parsed regimes
- **External bias flip origin POIs**
  - `f_firstBiasFlipOriginPoi()` finds origin candle zones that seed POIs around a flip attempt

## Per-bar execution flow (what happens each chart bar)

### A) Update trailing extremes and build structures
1. Compute:
   - `atr`, `body`, `bodyAvg`
2. Update `trailing.top/bottom`:
   - keep extremes “live” between swing updates
3. Build swing structure:
   - call `getCurrentStructure(swingsLengthInput, false)` for swing
   - call `getCurrentStructure(internalLength, true)` for internal
4. When a new swing demand/supply POI is emitted:
   - populate POI scalars
   - push into demand/supply arrays
   - initialize touch counters and inside-state
   - cap arrays by shifting when size exceeds a threshold

### B) Determine swing/internal CHoCH vs BOS behavior
- Compute `swingBullCHoCH/swingBearCHoCH` and break booleans using `displayStructure(false)`.
- Compute internal equivalents using `displayStructure(true)`.
- If `requireSwingBosForChartBias` is enabled, update committed swing direction only on BOS events.

### C) Build LTF confirmation series via `request.security`
- Compute candidate LTF “CHOCH proxy + displacement/impulse” for 5m/15m/60m.
- Choose which TF series is active based on chart timeframe and the auto-TF mapping.
- Also compute `entryAdx` on the selected confirmation TF.

### D) Apply market filters
- Use accumulation and consolidation gating to determine whether trading is allowed:
  - `marketNotAccumulating`
  - `isConsolidating`
- Final gating:
  - `marketTradeAllowed = marketNotAccumulating and not isConsolidating`

### E) Compute HTF “external bias” with flip-warning and BOS confirmation
This is the permission model’s core.

Key tracked state:
- `externalBias`
- `externalFlipState` (NORMAL vs WARNING)
- `candidateExternalBias`
- optional CHOCH reference extreme levels (`htfChochReferenceLow/High`) to enforce stricter BOS confirmation

Workflow:
1. If `externalBias` is unset, initialize it from the first HTF break.
2. In `NORMAL`:
   - if HTF CHoCH is detected against the existing bias:
     - enter `WARNING`
     - set `candidateExternalBias`
     - (optionally) store the CHoCH-bar extreme reference used for later BOS confirmation
3. In `WARNING`:
   - wait for BOS confirmation:
     - if satisfied: set `externalBias = candidateExternalBias`, return to `NORMAL`
     - if invalidated: clear candidate and return to `NORMAL` without changing bias

This prevents entering opposite-direction trades too early.

### F) Build POI/zone candidates from multiple streams
The script pushes new zones into demand/supply arrays when corresponding conditions are met, including:

- First POI on fresh external bias flip (optional)
- External-confirmation POI from origin candle + impulse (optional)
- Cash-Vault HTF POIs (OB+FVG plus optional swing-OB merge) (optional)
- Large directional FVG POIs (optional)
- Impulse OB+FVG continuation POIs (optional)
- Continuation sweep FVG taps (optional)
- Expansion-leg inefficiency context POIs (optional)

Every pushed zone includes:
- top/bottom levels
- bar index
- touch counter initialization
- inside-state initialization
- equilibrium snapshot reference

### G) Evaluate POI context (discount/premium + structural reaction)
Each bar:
1. Compute equilibrium and discount/premium membership from HTF swings.
2. Scan demand zones (newest to oldest) to find best match:
   - validate zone eligibility (directional reaction + correct side)
   - update touch counters and inside-state
   - optionally apply “pre-structure” ranking constraints
   - set `matchedDemandIdx` and `nearStrongLow` plus touch flags
3. Scan supply zones similarly:
   - set `matchedSupplyIdx` and `nearStrongHigh`
4. Derive:
   - `bullPoiContext` and `bearPoiContext`
   - stronger structural contexts from “strong low/high” taps and chart swing touches

### H) Compute armed permissions and entry readiness
- Determine whether demand/supply is allowed to arm:
  - `armedBull` and `armedBear`
- These depend on:
  - whether the matched/touched POI is in the correct value region
  - `allowBullDirection` / `allowBearDirection`, which incorporate:
    - external bias confirmed vs warning states
    - candidate flip restrictions
    - pullback-leg exceptions (where appropriate)

### I) Decide between continuation NOW and strict limit setups
Entry creation branches into two main paths:

1. **Continuation NOW**
   - uses continuation context (strong reactions + sweep revisits)
   - also requires LTF displacement/CHOCH style conditions
   - creates an immediate label/line and sets `nowBullSignal` / `nowBearSignal`

2. **Strict limit setups**
   - create an active “zone box” when strict criteria are met:
     - `strictBullSetup` / `strictBearSetup`
   - zone is defined by `zoneHigh` and `zoneLow` from OB or origin candle logic

### J) Zone lifecycle and mitigation-triggered entry
Active zones evolve per bar:
- If price enters zone:
  - increase `zoneTouchCount` when transitioning from outside to inside
- Expire zone after enough touches:
  - deactivate when `zoneTouchCount >= 3`

Entry trigger:
- `bullEntry` fires when:
  - zone is active and unused
  - direction matches and external bias is bullish-confirmed
  - price mitigates into the zone range
  - an approximate RR check passes (`minRR`)
- `bearEntry` mirrors the logic for shorts.

### K) Visuals and alerts
- Maintains a box overlay if `showZones` is enabled.
- Optional strong/weak POI plotting.
- Sets `alertcondition()` for:
  - NOW bullish/bearish signals
  - limit setup creation alerts

## Pseudocode: how this script executes

```text
INIT
  set constants (bias + flip state)
  read all inputs (TF mapping, POI toggles, filters, RR, visuals)
  initialize structures:
    swing pivots, internal pivots, trailing extremes
  initialize external bias workflow state:
    externalBias, externalFlipState, candidateExternalBias, CHOCH reference extremes
  initialize POI arrays and zone/signal state

HELPERS
  define structure/leg functions (getCurrentStructure, displayStructure)
  define LTF entry criteria functions (f_entryCriteriaTf)
  define Cash-Vault POI extraction functions (f_cvObFvgPack, f_cvSwingObPoi)
  define external flip origin POI function (f_firstBiasFlipOriginPoi)

PER BAR
  compute atr/body/bodyAvg
  update trailing.top and trailing.bottom extremes

  // Build/refresh POI from swing structure
  [newDemandPoi, demandTop, demandBot, demandBar,
   newSupplyPoi, supplyTop, supplyBot, supplyBar] = getCurrentStructure(...)
  if newDemandPoi:
    store scalars; push into demand arrays (touch=0, inside=false, store eq snapshot)
  if newSupplyPoi:
    store scalars; push into supply arrays (touch=0, inside=false, store eq snapshot)

  compute swing/internal CHoCH/BOS booleans
  if requireSwingBosForChartBias:
    update committed swing dir only on BOS

  // LTF confirmation via request.security
  request securities for:
    CHOCH proxy and displacement criteria on 5m/15m/60m
  select one TF's results based on chart timeframe
  compute entryAdx on selected confirmation TF

  // Market gating
  marketTradeAllowed = notAccumulating AND notConsolidating AND (ADX >= threshold if used)

  // HTF context and external bias permission model
  fetch HTF context (swing levels, OB/FVG POIs, equilibrium, flip-origin POIs)

  if externalBias is unset:
    init from first HTF break
  else:
    if externalFlipState == NORMAL:
      if HTF CHoCH detected against bias:
        set WARNING, set candidateExternalBias, (optionally) store CHOCH reference extreme
    else (WARNING):
      if BOS confirmation passes:
        externalBias = candidateExternalBias; set NORMAL
      else if invalidated:
        clear candidate; set NORMAL

  if externalBias changed:
    clear stale zone/setup state

  // Push/augment POI arrays (multiple optional streams)
  if useFirstBiasFlipPoi: push origin POI zones on fresh flip (when eligible)
  if useExternalConfirmPoi: push origin + impulse POIs (when eligible)
  if useCashVaultHtfPoi: push Cash-Vault HTF POIs overlapped with HTF+equilibrium rules
  if useLargeDirectionalFvgPoi: push large directional FVG zones
  if useImpulseObFvgPoi: push impulse OB+FVG zones
  if useSweepFvgContinuation: push sweep revisit zones
  if useExpansionInefficiencyContext: push expansion revisit zones

  // Evaluate POI context for this bar
  compute discount/premium using HTF equilibrium
  scan demandZone arrays:
    - validate reaction pattern + discount membership
    - update touch counters/inside flags
    - set matchedDemandIdx and “near strong low” flags
  scan supplyZone arrays similarly:
    - set matchedSupplyIdx and “near strong high” flags
  derive bullPoiContext and bearPoiContext

  // Compute continuation contexts (if enabled)
  compute continuationBull/Bear context from:
    strong HTF swings + chart swing POI touches + sweep/expansion taps

  // Armed permissions (respect warning + pullback-leg exceptions)
  armedBull = bullPoiContext AND bullHtfValueOk AND allowBullDirection
  armedBear = bearPoiContext AND bearHtfValueOk AND allowBearDirection

  // Decide signal types
  continuationBullNow = continuationNowSignal AND continuationBullSetup
  continuationBearNow = continuationNowSignal AND continuationBearSetup

  if continuationBullNow:
    throttle by POI key
    draw BUY NOW label/line
    set nowBullSignal=true

  if continuationBearNow:
    throttle by POI key
    draw SELL NOW label/line
    set nowBearSignal=true

  // Strict limit setup -> create an active zone
  if strictBullSetup and RR/target distance ok:
    zoneDir=BULLISH; set zoneHigh/zoneLow/entryMid; zoneActive=true; zoneUsed=false
    draw limit line

  if strictBearSetup and RR/target distance ok:
    zoneDir=BEARISH; set zoneHigh/zoneLow/entryMid; zoneActive=true; zoneUsed=false
    draw limit line

  // Zone lifecycle
  if zone is active:
    if price is inside zone:
      update zoneTouchCount when entering
    if zoneTouchCount >= 3:
      deactivate zone

  // Mitigation-triggered entry
  if bullEntry fires:
    approximate RR passes:
      draw BUY NOW [ZONE] label/line
      zoneUsed=true; set nowBullSignal=true

  if bearEntry fires:
    approximate RR passes:
      draw SELL NOW [ZONE] label/line
      zoneUsed=true; set nowBearSignal=true

VISUALS + ALERTS
  update POI box overlay if showZones
  set alertcondition() for now and limit signals
```

