# Tomb World Solo Command

A visual, static web app for running solo or cooperative Kill Team battles against Tomb World Necron non-player operatives.

## Features

- One-click **Activate Next Enemy** decision engine
- Editable NPO roster with type, behavior, wounds, weapon note, ready state, and damage tracking
- Default Necron Warrior, Scarab Swarm, Macrocyte, and Tomb Crawler profiles
- 2D6-style Necron roster and reinforcement generation
- Threat level and threat grade tracker
- Six Tomb World mission-assistant presets with progress trackers
- Random tomb events, including awakened Necrons, living metal repair, reanimation, shifting passages, and temporal effects
- Turning point and Strategy phase controls
- Local browser saving, plus JSON import and export
- Responsive layout for a Windows PC, tablet, or phone
- No build tools, frameworks, server, or external assets required

## Run locally

Open `index.html` directly in a browser, or use a small local server:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Publish on GitHub Pages

1. Create a new GitHub repository.
2. Upload all files from this folder to the repository root.
3. Open **Settings**, then **Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and the `/ (root)` folder.
6. Save. GitHub will provide the public URL after deployment.

No workflow file or build command is needed.

## How the activation engine works

The app follows the broad Joint Ops structure:

1. Select a ready NPO using attack opportunity, mission pressure, exposure, and proximity.
2. Follow the selected NPO's behavior priority.
3. Break ambiguous decisions using the threat principle, choosing the result most harmful to the player.
4. Display the order, action sequence, target priority, movement intent, and weapon-profile guidance.
5. The player rolls dice and resolves the official tabletop rules normally.

The **Battlefield Snapshot** supplies information the browser cannot see, such as whether the NPO is engaged, has a valid shot, can charge, or is blocked by a hatch. The settings remain in place, so repeated activations can still be performed with one click until the tabletop situation changes.

## Rules and intellectual property note

This project is an unofficial fan-made play aid. It does not reproduce the official mission maps, full mission text, full datacards, or full event cards. Mission and event content in the app is summarized for tracking and automation. Use it alongside the official Kill Team rules and Tomb World mission pack.

Kill Team, Necrons, Tomb World, and related names are trademarks or intellectual property of Games Workshop Limited. This project is not affiliated with or endorsed by Games Workshop.
