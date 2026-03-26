# Swing POI Entry Marker (Earlier Version)

This document explains how `swing-poi-entry-marker.pine` works and why it tends to produce more entries than `swing-poi-entry-markerV1.pine`.

## What this script is doing

- Builds market structure from two layers:
  - `swing` pivots for major bias/context.
  - `internal` pivots for faster CHOCH/BOS behavior.
- Maintains an `externalBias` from HTF (`contextTf`, default 4H) swing breaks.
- Continuously creates and tracks POIs (demand/supply) from multiple sources.
- Arms setups when price returns to valid value area (discount for buys, premium for sells).
- Uses lower-timeframe confirmation (CHOCH + displacement) to create limit zones or immediate continuation signals.
- Emits alerts for both:
  - `NOW` entries (`nowBullSignal`, `nowBearSignal`)
  - limit setup creation (`limitBullSignal`, `limitBearSignal`)

## Core flow

1. Detect swing/internal pivots and structure breaks.
2. Derive HTF range, equilibrium, discount/premium.
3. Build POI pools:
   - swing origin candles
   - external-confirmation POIs
   - first-bias-flip origin POIs
   - impulsive OB+FVG POIs
   - large directional FVG POIs
   - Cash-Vault HTF POIs (OB/FVG + optional swing OB merge)
4. Track touch/mitigation state per POI (up to 3 touches).
5. Require context alignment:
   - bullish in discount
   - bearish in premium
6. Confirm with entry-TF signals (5m/15m/60m auto-mapped).
7. Create limit zone or continuation NOW signal.
8. Fire final NOW entry when zone is mitigated and RR/filters pass.

## Entry logic in this earlier version

### Strict setup path

`strictBullSetup` / `strictBearSetup` needs:
- POI context armed in the correct side of range.
- Entry-TF CHOCH + displacement.
- ADX accumulation filter pass (`marketNotAccumulating`).
- target distance not too far (`continuationMaxTargetAtr` upper bound).

### Continuation setup path

`continuationBullSetup` / `continuationBearSetup` needs:
- Continuation context from revisits (zone/FVG/sweep).
- continuation trigger enabled.
- candle closes through continuation POI midpoint.
- `(ltfDisp OR ltfChoch)` on entry TF.
- same max target distance + ADX filter.

Can generate either:
- immediate NOW (`continuationNowSignal = true`), or
- limit setup if immediate mode is off.

### PD auto-eval path

`pdBullSetup` / `pdBearSetup` can trigger from discount/premium zone context with direction candle + target-distance + ADX filter.

## Why this version can produce more entries

Compared to `swing-poi-entry-markerV1.pine`, this earlier version is looser in several high-impact places:

1. **Immediate external bias flips**
   - Here, opposite external break flips bias immediately.
   - No CHOCH-warning + BOS-confirmation staging.
   - Effect: faster directional changes and more opportunities.

2. **No warning-mode directional restriction**
   - No temporary "safe mode" suppression during pending flip conditions.
   - Effect: fewer blocked setups around uncertain structure transitions.

3. **No continuation minimum-distance floor**
   - Continuation only checks maximum distance to target.
   - Effect: accepts more continuation trades that are near target.

4. **No continuation POI proximity cap**
   - No required max ATR distance from continuation POI midpoint.
   - Effect: continuation setups can trigger from farther away.

5. **No optional 5m OB retest gate**
   - CHOCH/displacement alone can pass in 5m-only mapping.
   - Effect: more strict-path entries on fast charts.

6. **Lower structural gating complexity**
   - No legacy-reaction direction remapping and no separate warning-state direction logic.
   - Effect: simpler and more permissive pass conditions.

## Inputs that most impact entry frequency here

- `nearAtrMult` (default `0.35`): lower means tighter POI nearness.
- `bodyImpulseMult` (default `1.5`): higher means harder displacement requirement.
- `minAdxForTrades` (default `18`): higher filters more ranging periods.
- `largeFvgMinAtr` (default `0.8`): larger threshold reduces FVG-derived POIs.
- `minRR` (default `3.0`): higher reduces final zone-triggered NOW entries.

## Practical implication

This version will often react earlier and more frequently around structure transitions because it does not enforce the additional safety/confirmation layers introduced in V1.
