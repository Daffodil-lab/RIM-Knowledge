# Log collection and performance diagnostics

Use immediate logs and measurements taken while the problem is occurring. A log from a later clean launch, an Analyzer capture made without reproducing the issue, or a cropped image that hides the active tab and details panel is not sufficient evidence.

## Standard log publisher

Use [Log Publisher from HugsLib](https://steamcommunity.com/sharedfiles/filedetails/?id=2873415404), the standalone publisher extracted from HugsLib.

1. Reproduce the error.
2. Immediately press `Ctrl+F12` or use the green `Share` button in the log window.
3. Record the resulting link with the save, reproduction steps, visible symptom and approximate time.
4. If upload fails, press `Ctrl+Alt+F12`, paste the copied log into a UTF-8 text file, and attach it directly.
5. If RimWorld crashes, also attach `%USERPROFILE%\AppData\LocalLow\Ludeon Studios\RimWorld by Ludeon Studios\Player.log`.

Repeated errors can saturate RimWorld's log and hide later messages. Stop after reproducing an error flood, preserve the current log, then restart and reproduce in the shortest practical sequence after addressing the first repeating error.

## Performance Analyzer procedure

Record the RimWorld build, active DLC and mods, save, game speed, pawn count, map count and open UI before comparing results.

1. Open one relevant Analyzer tab. Opening or changing a tab resets that measurement.
2. Reproduce the slowdown while profiling that tab.
3. Let the rolling values settle before treating the average as stable.
4. Pause the profiler before pausing the game. Frame and rendering work continue while the game is paused.
5. Capture the complete Analyzer window, including the tab, column headers, FPS/TPS, selected entry and details panel.

Read the main columns as follows:

| Column | Use |
| --- | --- |
| `Average Per Frame/Tick` | Sustained cost in each frame or tick |
| `Max For Frame/Tick` | A single freeze, hitch or lag spike |
| `Calls` | Total calls during the measurement |
| `Av Per Call` | Cost of one invocation |
| `Percent` | Share of the measured frame or tick |
| `Av Calls Per Frame/Tick` | Repeated-call pressure |

For a high call count, select the method, enable `Stacktrace`, collect a representative sample, disable collection, then use `Change` to inspect the dominant call chains and their percentages. For a high cost per call, use `Profile internal`.

If `HarmonyMod.Environment_GetStackTrace` appears, inspect and resolve the warning or error log first. The cost represents log stack-trace generation, so unrelated optimization will not remove the primary problem.

## Shion profiling routes

- Race rendering: `Pawn Renderer`, `Draw Dynamic Things`, portrait and UI paths
- Race behavior: `Pawn Tick`, `Needs`, `Thing Comps`
- Shion or dependency patches: `Harmony Patches`, `Harmony Transpilers`, `Harmony Transpiled Methods`
- Sustained production: relevant Component, Job, Tick and Update tabs
- Freezes: follow `Max For Frame/Tick` and reproduce the same freeze after each drill-down

Analyzer has a hardware- and OS-dependent practical resolution near `0.03μs`, and its measurement patches add external overhead near `0.07μs`. Nested profiling can count the same work at several levels. Use controlled before/after comparisons and call paths instead of adding every displayed row.

## Required evidence

A performance or error report should include:

- complete active mod list and versions
- immediate shared log or copied text log
- `Player.log` for crashes
- reproduction steps and save
- Analyzer tab, measurement duration and complete screenshot
- Average, Max, Calls and Av Per Call for the relevant entries
- dominant stacktrace or internal profile where applicable

The release gates that consume this evidence are listed in [TEST-MATRIX.md](TEST-MATRIX.md).
