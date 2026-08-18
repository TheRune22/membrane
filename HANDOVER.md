# MIDI Web App — Implementation Handover

## Goal

Build a frontend-only web application for sending MIDI messages to connected MIDI devices.

The initial target is an **Expressive E Osmose** connected to the PC via USB MIDI.

The application should provide a clean foundation for eventually becoming a more sophisticated MIDI controller/editor.

## Technology

Use:

* **SolidJS**
* **TypeScript**
* **Vite**
* A modern CSS/UI solution of your choice, preferably Tailwind CSS
* The browser's **Web MIDI API** for MIDI communication

The application should initially be entirely client-side and deployable as a static website.

Target Chromium-based browsers initially.

## Architecture

Keep MIDI communication separate from the UI.

Create a small MIDI abstraction so that the rest of the application does not depend directly on browser-specific MIDI APIs.

For example:

```ts
interface MidiOutput {
    send(data: Uint8Array): void;
}
```

The initial implementation should use the browser's Web MIDI API.

The abstraction should be designed so that other means of MIDI communication could be introduced in future versions without requiring major changes to the UI.

## Initial scope

Keep the first implementation deliberately minimal.

The application should:

1. Detect available MIDI outputs.
2. Allow the user to select a MIDI output.
3. Provide a simple way to enter/send arbitrary MIDI bytes.
4. Send those bytes to the selected output.
5. Display basic status/errors.

For example, the user should be able to enter:

```text
90 3C 64
```

and send it to the selected MIDI device.

No MIDI message parsing or higher-level MIDI abstractions are required initially.

## Initial UI

Create a simple but polished UI containing:

### MIDI output selector

* List available MIDI outputs.
* Allow one output to be selected.
* Clearly indicate when no MIDI outputs are available.

### MIDI message sender

* Input for hexadecimal MIDI bytes.
* Send button.
* Basic validation of the input.
* Clear indication of success/errors.

The UI should be responsive and usable on both desktop and mobile screens.

Do not build a piano keyboard, MIDI monitor, knobs, or other advanced controls yet.

## MIDI permissions and errors

Handle basic failure cases gracefully, including:

* MIDI unavailable
* Permission denied
* No MIDI devices connected
* Invalid MIDI byte input
* MIDI device becoming unavailable

The user should receive a clear, human-readable error message where appropriate.

## Hosting

The application must remain fully static.

`npm run build` should produce a deployable static application suitable for hosting on services such as GitHub Pages, Cloudflare Pages, or Netlify.

No backend or database should be required.

## Future development

Do not implement these yet, but avoid architectural decisions that would make them difficult later:

* Higher-level MIDI message abstractions
* Piano keyboard and other MIDI controls
* MIDI monitoring
* MPE-specific functionality
* Presets/configuration
* More sophisticated MIDI routing
* Alternative MIDI communication mechanisms
* Potential use from mobile devices to control MIDI hardware connected elsewhere

The exact implementation of future MIDI communication should remain open.

## Development principles

* Keep the initial implementation small.
* Use idiomatic SolidJS.
* Use TypeScript throughout.
* Avoid unnecessary dependencies.
* Keep browser-specific MIDI functionality isolated.
* Do not over-engineer the MIDI abstraction.
* Prioritize a clean foundation that can be extended later.

## First milestone

The first version is complete when:

1. The application starts with Vite.
2. A Chromium browser can access MIDI.
3. Connected MIDI outputs are displayed.
4. The user can select an output.
5. The user can enter hexadecimal MIDI bytes.
6. The bytes can be sent to the selected MIDI output.
7. Basic errors are displayed clearly.
8. The application builds successfully as a static website.
