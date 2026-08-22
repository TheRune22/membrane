# Project guidelines

## Project context

- This is a small SolidJS + TypeScript application built with Vite.
- Keep browser Web MIDI integration confined to `src/midi`; device-specific Osmose data and behavior belong in `src/osmose`.

## Code quality

- Prioritize readability and maintainability over cleverness or premature flexibility.
- Keep the app small: introduce an abstraction only when it gives a clear boundary or removes a real source of complexity.
- Prefer descriptive names and straightforward control flow to explanatory comments.
- Add docstrings only for public boundaries or behavior that is not obvious from the code itself.
- Keep browser-specific MIDI APIs inside `src/midi`; UI code should use the app-level MIDI interfaces.
- Build the UI from focused components; keep `App` responsible for composition and app-level state rather than presentation details.
- Avoid adding dependencies unless they materially improve the current product.
- Keep commits focused and free of unrelated work. Do not include pre-existing or unrelated working-tree changes.

## Scope

- The shipped application must not expose arbitrary MIDI-byte entry. It should offer intentional controls that produce well-defined MIDI messages.
- Raw MIDI-byte input may be used only as a temporary development diagnostic, not as a user-facing feature.
- Do not add SysEx, message interpretation, MPE features, device editing, or monitoring without an explicit request.

## Verification and commits

- Before finishing a code change, run `npm run build`.
- Report the verification result and any checks that could not be run.
- Ask the user to verify user-facing changes before committing them. Once they confirm, commit the completed cohesive change with a concise message.
- If the production build cannot run, state why and do not claim full verification.
