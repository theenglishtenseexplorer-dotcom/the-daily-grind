# The Daily Grind

A 2.5D Filipino life-simulation game set in Barangay San Isidro. Chapter 1 follows a fresh graduate preparing for a job interview while navigating everyday neighborhood life.

## Prototype 0.1

This starter build establishes:
- A responsive neighborhood map
- Four selectable destinations
- A waypoint graph for road-based movement
- A simple walking animation
- Location scenes that open after arrival
- Return-to-map positioning
- Local save data foundation

## Run locally

Because the JavaScript uses ES modules, run the project through a local web server. For example, in VS Code use the Live Server extension, or run:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Publish with GitHub Pages

1. Open repository **Settings → Pages**.
2. Under Build and deployment, choose **Deploy from a branch**.
3. Select `main` and `/ (root)`, then Save.
4. Wait for the deployment URL to appear.

## Important prototype notes

- The map art and protagonist are placeholders, not final production assets.
- Waypoints are normalized to the canvas, so the map scales with browser size.
- Movement uses a shared waypoint graph and destination lock.
- Progress is saved in browser LocalStorage. This is a prototype save format; later versions should add explicit migrations before changing its schema.
- Keyboard movement is listed as a future control; the current milestone focuses on click-to-destination waypoint travel.

## Project structure

```text
the-daily-grind/
├── index.html
├── README.md
├── css/
│   └── game.css
└── js/
    ├── main.js
    ├── movement.js
    └── world.js
```
