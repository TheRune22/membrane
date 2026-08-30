# Osmose Controller

SolidJS + TypeScript + Vite static web app for controlling an Expressive E Osmose through the browser Web MIDI API (Chromium, HTTPS).
It currently discovers/selects MIDI outputs (auto-selecting Osmose when available), sends channel-1 controls through an Osmose control bank, and browses/selects the bundled preset library via bank-select and program-change messages.

## Scope

- Keep Web MIDI/browser APIs in `src/midi`; keep Osmose protocol, preset data, and device behavior in `src/osmose`; UI uses those app-level interfaces.
- The shipped UI exposes intentional, well-defined controls only—never arbitrary MIDI-byte entry. Do not add unrelated SysEx, MIDI interpretation/monitoring, MPE, or device editing without an explicit request.
- This app configures the Osmose; controlling other devices, an on-screen keyboard, and note-playing or performance features are out of scope unless explicitly requested.
- Planned work: load presets to the Osmose; add parameter controls including 14-bit macros; support two-way communication for current settings, change detection, parameter names, and downloading presets from the Osmose.

## Principles

- Favor readability, maintainability, and focused modular components over cleverness or premature abstraction.
- Preserve separation of concerns; keep `App` for composition and app state, and components for presentation.
- Prefer clear names and direct control flow. Add dependencies, comments, and abstractions only when they solve a concrete problem.
- Keep changes focused; preserve unrelated working-tree changes.

## Every task

- Verify the change works as expected (run `npm run build` for code changes and report results).
- Reconsider whether code can be refactored, consolidated, simplified, or deleted after the change.
- Prompt the user to commit the completed cohesive change after user-facing verification.
