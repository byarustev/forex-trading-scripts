# Athena Inv V2.5 — Logic Flowchart

## High-Level Flow

```mermaid
flowchart TB
    subgraph init["Per-Bar Start"]
        A[New Bar] --> B[4H Structure]
    end

    subgraph struct["4H Structure (240)"]
        B --> C[Pivot Highs/Lows]
        C --> D{BoS?<br>close > last_swing}
        D -->|Yes| E{ChoCH?<br>close > prev_swing}
        E -->|Both| F[Trend Confirmed]
        F --> G{Bull or Bear?}
        G -->|Bull| H[bias=1, demand POIs]
        G -->|Bear| I[bias=-1, supply POIs]
    end

    subgraph poi["POI Management"]
        H --> J[Add: main zone, 4H Breaker]
        I --> J
        J --> K[4H FVG as POI?]
        K --> L[Continuation OB+FVG → arrays]
        L --> M[POI Revisit Check]
        M --> N{Price in any POI?}
        N -->|Yes| O[revisited_4h_poi / revisited_1h_poi]
    end

    subgraph fvg["1H FVG & Storage"]
        O --> P[Detect 1H FVG<br>bull/bear]
        P --> Q[Push continuation POI<br>OB + FVG to arrays]
        Q --> R[Store hist FVG<br>bear→bull bias, bull→bear bias]
    end

    subgraph entry["Entry Logic (Priority Order)"]
        R --> S{entry_taken?}
        S -->|No| T{ChoCH + 4H POI?}
        T -->|Yes| U[ChoCH Limit at OB]
        T -->|No| V{MSS + POI?}
        V -->|Yes| W[MSS Limit at yellow zone mid]
        V -->|No| X{iFVG inverted?}
        X -->|Sell| Y[iFVG Sell at mid]
        X -->|Buy| Z[iFVG Buy at mid]
        Y --> AA[Liquidity POI<br>below EQL / above EQH]
        Z --> AA
        W --> AA
        U --> AA
    end

    subgraph reset["Reset on New BoS"]
        D --> AB[bos_bull/bos_bear]
        AB --> AC[Clear entry, POIs,<br>FVG, MSS markers]
        AC --> A
    end
```

---

## 4H Trend Confirmation (Detail)

```mermaid
flowchart LR
    subgraph inputs
        A[ph_4h, pl_4h] --> B[last_swing_high/low]
        C[close_4h] --> D
    end

    subgraph conditions
        D[BoS: close > last_swing] --> E{trend_confirmed}
        F[ChoCH: close > prev_swing] --> E
        E -->|Both true| G[bias set]
        G -->|Bull| H[demand_zone arrays]
        G -->|Bear| I[supply_zone arrays]
    end
```

---

## Entry Model Priority

```mermaid
flowchart TD
    A[Entry Evaluation] --> B{use_4h_poi_choch?}
    B -->|Yes| C{revisited_4h_poi + ChoCH?}
    C -->|Yes| D[**1. ChoCH**<br>Limit at prev_1h OB]
    C -->|No| E{use_poi_mss_entry?}
    E -->|Yes| F{mss_poi_ok + MSS + liq_grab?}
    F -->|Yes| G[**2. MSS**<br>Limit at yellow zone mid<br>OB+FVG or Fib 0.618]
    F -->|No| H{inv_bull_fvg / inv_bear_fvg?}
    H -->|Sell| I[**3. iFVG Sell**<br>Limit at inverted FVG mid]
    H -->|Buy| J[**4. iFVG Buy**<br>Limit at inverted FVG mid]
    I --> K{use_liquidity_poi?}
    J --> K
    G --> K
    D --> K
    K -->|Yes| L[**5. Liquidity POI**<br>Unmitigated 1H POI below EQL/above EQH]
```

---

## MSS Entry Flow (Detail)

```mermaid
flowchart TB
    subgraph trigger["MSS Trigger"]
        A[ob_limit_trigger_mss_buy/sell] --> B[mss_poi_ok]
        B --> C[revisited_4h_poi OR<br>mss_allow_from_1h_poi + revisited_1h_poi]
        C --> D[mss_1h_bull/bear]
        D --> E[close_1h beyond last swing]
        E --> F[mss_bull/bear_liq_ok]
        F --> G[EQL/EQH sweep within window]
        G --> H[prev_1h bearish/bullish]
    end

    subgraph zone["Zone Selection"]
        H --> I{Leg has OB+FVG?}
        I -->|Yes| J[Yellow zone = FVG top/bot]
        I -->|No| K[Yellow zone = leg range<br>prev_1h ↔ close_1h]
        J --> L[Entry = mid of zone]
        K --> L
    end

    subgraph confirm["Confirmation"]
        L --> M[mss_prem_ok: premium/discount]
        M --> N[mss_buy_ok / mss_sell_ok]
        N --> O[entry_type 2 or 3]
        O --> P[Draw yellow zone, limit at mid]
    end
```

---

## iFVG Entry Flow

```mermaid
flowchart TB
    A[HTF POI tap] --> B[Store 1H FVGs in hist arrays]
    B --> C[Price reverses at POI]
    C --> D[1H candle closes through stored gap]
    D --> E[FVG inverts → iFVG]
    E --> F{poi_ok_for_ifvg?}
    F --> G[revisited_4h_poi OR<br>continuation_window + revisited_1h_poi]
    G --> H{Bull or Bear bias?}
    H -->|Bear| I[inv_bull_fvg: close < gap bot]
    H -->|Bull| J[inv_bear_fvg: close > gap top]
    I --> K[Entry = mid of inverted FVG]
    J --> K
    K --> L[Premium/Discount filter]
```

---

## POI Arrays & Sources

```mermaid
flowchart LR
    subgraph sources
        A[4H POI src=4.0] --> B[demand/supply arrays]
        C[1H ChoCH OB src=1.0] --> B
        D[Continuation OB+FVG src=1.0] --> B
        E[4H FVG src=4.0] --> B
        F[Breaker: is_breaker=1.0] --> B
    end

    subgraph usage
        B --> G[POI revisit check]
        G --> H[Entry models]
        B --> I[Unmitigated highlight]
    end
```

---

## Key Variables Summary

| Variable | Purpose |
|----------|---------|
| `bias` | 1=bull, -1=bear (from 4H ChoCH+BoS) |
| `entry_type` | 0=none, 1=iFVG, 2=MSS(OB+FVG), 3=MSS(Fib) |
| `ifvg_zone_hi/lo` | Yellow zone bounds (MSS) or iFVG bounds |
| `ob_limit_level` | ChoCH: prev_1h OB. MSS: mid of yellow zone |
| `revisited_4h_poi` | Price traded into 4H-tagged POI |
| `revisited_1h_poi` | Price traded into 1H-tagged POI |
