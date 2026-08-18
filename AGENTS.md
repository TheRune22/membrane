# Project guidelines

## Code quality

- Prioritize readability and maintainability over cleverness or premature flexibility.
- Keep the app small: introduce an abstraction only when it gives a clear boundary or removes a real source of complexity.
- Prefer descriptive names and straightforward control flow to explanatory comments.
- Add docstrings only for public boundaries or behavior that is not obvious from the code itself.
- Keep browser-specific MIDI APIs inside the MIDI module; UI code should use the app-level MIDI interfaces.
- Build the UI from focused components; keep `App` responsible for composition and app-level state rather than presentation details.
- Avoid adding dependencies unless they materially improve the current product.
- Commit completed, cohesive changes regularly, keeping each commit focused and free of unrelated work.

## Scope

- The shipped application must not expose arbitrary MIDI-byte entry. It should offer intentional controls that produce well-defined MIDI messages.
- Raw MIDI-byte input may be used only as a temporary development diagnostic, not as a user-facing feature.
- Do not add SysEx, message interpretation, MPE features, device editing, or monitoring without an explicit request.
