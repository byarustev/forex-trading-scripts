# Swing POI Entry Marker V1 - Current Assessment

## Overall Score: 60%

This version is a meaningful step forward. It combines structure, POI context, continuation logic, and market-condition filters in a way that is far more practical than a basic CHOCH/BOS trigger model. At the same time, there are still edge cases and complexity trade-offs that keep it in "workable but not final" territory.

---

## What This Script Achieves

- Detects structure and POIs using swing + internal logic.
- Builds directional setup context from demand/supply POI interaction.
- Uses lower-timeframe confirmations mapped to higher-timeframe context.
- Filters out poor conditions (accumulation/consolidation).
- Avoids entries where target is too close (or too far) relative to ATR.
- Supports continuation-style entries and staged limit-to-now execution.
- Adds protective logic around external bias transitions (warning -> confirm).
- Prioritizes stronger pre-structure POIs after a fresh CHOCH/BOS.

---

## Key Decisions Made (And Why)

## 1) Confirmation Timeframe Mapping
- **Decision:** Use deterministic mapping:
  - 4H -> 15m confirmations
  - 1H -> 5m confirmations
  - Above 4H -> 1H confirmations
- **Why:** Keeps confirmation consistent with intended execution model and avoids noisy/accidental chart-timeframe coupling.

## 2) Consolidation Filtering
- **Decision:** Block entries in chop using:
  - Range compression vs ATR
  - Trend-efficiency (net move / total range)
- **Why:** Raw structure signals in sideways markets produced low-quality entries; this reduces false positives.

## 3) Hardcoded Target-Distance Guard
- **Decision:** Enforce hardcoded ATR distance bounds:
  - Min target distance = `1.25 * ATR`
  - Max target distance = `8.0 * ATR`
- **Why:** Prevents entries when nearest major target is too close to justify risk (and avoids overstretched cases).

## 4) External Bias Transition State Machine
- **Decision:** Replace instant flip with staged logic:
  - Opposite CHOCH -> warning state
  - BOS/acceptance -> confirmed new direction
- **Why:** Immediate flips were too reactive and often invalidated; staged confirmation better reflects real shift quality.

## 5) Parent-Leg Trade Continuation
- **Decision:** Even after a confirmed counter direction, allow parent-direction trades only if parent safe areas remain (unmitigated relevant zones).
- **Why:** Legacy external legs often still contain valid liquidity/POI reactions before fully exhausting.

## 6) Post-Structure POI Prioritization
- **Decision:** After fresh CHOCH/BOS, prefer last/second-last pre-structure POIs for a window.
- **Why:** Immediate post-break POIs were observed to fail more often than deeper POIs from the impulse leg.

## 7) Direction-Specific POI Validation
- **Decision:**
  - Bullish POI must be demand + bullish impulse signature.
  - Bearish POI must be supply + bearish impulse signature.
- **Why:** Not every zone in discount/premium is structurally equal; directional impulse at zone origin improves POI quality.

## 8) Confirmed-Bias Countertrend Location Guard
- **Decision:** When bullish bias is fully confirmed, bearish setups are only allowed in premium or valid unmitigated bearish POI context (and vice versa).
- **Why:** Prevents countertrend signals from firing in wrong value areas (for example, sells in discount during confirmed bullish context).

## 9) Runtime Safety for Deep History Access
- **Decision:** Clamp dynamic history indexes before evaluating zone-origin impulse checks.
- **Why:** Prevents Pine runtime errors from invalid bars-back references in large histories.

---

## Why This Is 60% (Not Higher Yet)

- Logic is now much more robust, but still dense and interdependent.
- Some components still rely on heuristic thresholds that may need pair/session tuning.
- Parent vs current zone handling is context-driven rather than fully separated zone ledgers.
- The system is strong for discretionary alignment, but still needs more forward/live validation before "production-grade confidence."

---

## Suggested Next Improvement Areas (Later)

- Separate parent-zone and current-zone storage explicitly.
- Add lightweight debug state labels for flip status and direction permissions.
- Add per-session calibration presets (London/NY/Asia behavior differences).
- Add a compact test checklist to replay key scenarios consistently.

