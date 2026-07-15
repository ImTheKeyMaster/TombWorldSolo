(() => {
  "use strict";

  const STORAGE_KEY = "tomb-world-solo-command-v1";

  const NPO_TEMPLATES = {
    "Necron Warrior": {
      behavior: "marksman",
      maxWounds: 9,
      weapon: "Gauss flayer or gauss reaper",
      move: 5,
      save: "4+",
      attackDice: 4,
      hit: 4,
      normalDamage: 3,
      critDamage: 4
    },
    "Canoptek Scarab Swarm": {
      behavior: "brawler",
      maxWounds: 10,
      weapon: "Feeder mandibles",
      move: 6,
      save: "5+",
      attackDice: 5,
      hit: 4,
      normalDamage: 3,
      critDamage: 4
    },
    "Canoptek Macrocyte": {
      behavior: "sentinel",
      maxWounds: 7,
      weapon: "Gauss scalpel or tesla caster",
      move: 7,
      save: "4+",
      attackDice: 4,
      hit: 4,
      normalDamage: 3,
      critDamage: 4
    },
    "Canoptek Tomb Crawler": {
      behavior: "sentinel",
      maxWounds: 21,
      weapon: "Twin gauss reapers or transdimensional isolator",
      move: 5,
      save: "3+",
      attackDice: 5,
      hit: 3,
      normalDamage: 4,
      critDamage: 5
    },
    "Custom NPO": {
      behavior: "guardian",
      maxWounds: 8,
      weapon: "Custom weapon",
      move: 6,
      save: "4+",
      attackDice: 4,
      hit: 4,
      normalDamage: 3,
      critDamage: 4
    }
  };

  const MISSIONS = [
    {
      id: "shifting-labyrinth",
      number: "01",
      name: "Shifting Labyrinth",
      summary: "Escape through a tomb complex whose exit point can migrate along the far edge as the battle develops.",
      goal: "Win by getting at least half of the enemy operatives out through the escape point.",
      trackerLabel: "Operatives escaped",
      trackerMax: 12,
      setup: "Begin with a randomized Necron force distributed in the far territory. Use the official map and setup instructions."
    },
    {
      id: "demolition-protocol",
      number: "02",
      name: "Demolition Protocol",
      summary: "Force a route through the tomb by breaching and permanently opening enough access points.",
      goal: "Win after seven access points have been opened and successfully breached.",
      trackerLabel: "Breached access points",
      trackerMax: 7,
      setup: "Begin with a randomized Necron force in the far territory. Track each hatchway or breach point separately."
    },
    {
      id: "recover-transponder",
      number: "03",
      name: "Recover Transponder",
      summary: "Search several possible locations for a hidden device, then carry the real marker back to safety.",
      goal: "Find the true transponder and escape with it through the player edge.",
      trackerLabel: "Search sites resolved",
      trackerMax: 3,
      setup: "Place three objective markers using the official mission map. Necrons guard the rooms containing them."
    },
    {
      id: "destroy-sarcophagus",
      number: "04",
      name: "Destroy Sarcophagus",
      summary: "Overload or demolish a damaged stasis crypt while tomb systems attempt to repair it.",
      goal: "Accumulate 20 destruction points before the kill team is eliminated.",
      trackerLabel: "Destruction points",
      trackerMax: 20,
      setup: "Concentrate part of the starting Necron force around the sarcophagus. Use the official repair roll each Strategy phase."
    },
    {
      id: "scout-sub-crypt",
      number: "05",
      name: "Scout Sub-Crypt",
      summary: "Open unexplored rooms, clear the guardians that awaken inside, and complete a scan before moving on.",
      goal: "Scout three eligible rooms after clearing each room of active NPOs.",
      trackerLabel: "Rooms scouted",
      trackerMax: 3,
      setup: "Start with no NPOs. New NPOs appear when an unexplored room is first opened or entered."
    },
    {
      id: "regroup",
      number: "06",
      name: "Regroup",
      summary: "Navigate unstable phasing routes and reunite the scattered team inside the far drop zone.",
      goal: "End a turning point with every surviving operative grouped in the far drop zone and clear of NPO control range.",
      trackerLabel: "Operatives regrouped",
      trackerMax: 12,
      setup: "Use the official phasing point rules when enemy operatives cross hatchway access points."
    }
  ];


  const MISSION_MAPS = {
    "shifting-labyrinth": {
      orientation: "left",
      note: "Enemy operatives begin at the left edge. NPOs deploy throughout NPO territory. The escape point starts at the centre of the far edge and may move during the battle.",
      walls: [[180,30,180,155],[270,155,270,300],[430,30,430,160],[610,150,610,300],[680,300,680,460],[180,155,610,155],[270,300,680,300],[430,390,610,390]],
      hatches: [[270,215,"v"],[430,95,"v"],[430,350,"v"],[520,155,"h"],[560,300,"h"],[610,225,"v"]],
      npos: [[485,95],[545,225],[485,350]],
      markers: [{kind:"exit",x:770,y:245,label:"ESCAPE"}]
    },
    "demolition-protocol": {
      orientation: "left",
      note: "Enemy operatives begin at the left edge. NPOs deploy throughout NPO territory. Green access points are the suggested hatchways and breach points to track for Sabotage.",
      walls: [[350,30,350,175],[500,30,500,185],[140,175,650,175],[250,175,250,325],[450,175,450,460],[650,175,650,325],[150,325,650,325]],
      hatches: [[350,100,"v"],[500,110,"v"],[250,245,"v"],[450,245,"v"],[650,245,"v"],[300,175,"h"],[550,175,"h"],[340,325,"h"],[555,325,"h"]],
      npos: [[545,105],[555,245],[520,385]],
      markers: [{kind:"breach",x:300,y:175,label:"BREACH"},{kind:"breach",x:555,y:325,label:"BREACH"}]
    },
    "recover-transponder": {
      orientation: "bottom",
      note: "Enemy operatives begin along the lower edge. Place the three objective markers in separate rooms and distribute the starting NPOs among those rooms.",
      walls: [[30,110,770,110],[250,110,250,265],[520,110,520,365],[30,265,520,265],[250,365,770,365]],
      hatches: [[250,185,"v"],[520,190,"v"],[520,320,"v"],[150,265,"h"],[385,265,"h"],[650,365,"h"]],
      npos: [[205,205],[455,185],[625,320]],
      markers: [{kind:"objective",x:165,y:205,label:"1"},{kind:"objective",x:440,y:185,label:"2"},{kind:"objective",x:625,y:320,label:"3"}]
    },
    "destroy-sarcophagus": {
      orientation: "bottom",
      note: "Enemy operatives begin along the lower edge. Half of the starting NPOs deploy in the room containing the sarcophagus; the remainder spread across the other rooms.",
      walls: [[350,30,350,305],[530,120,530,365],[350,120,770,120],[30,305,530,305],[150,305,150,460],[150,395,530,395]],
      hatches: [[350,185,"v"],[530,185,"v"],[530,340,"v"],[245,305,"h"],[440,305,"h"],[330,395,"h"]],
      npos: [[425,180],[475,220],[620,175],[250,245]],
      markers: [{kind:"sarcophagus",x:435,y:215,label:"SARCOPHAGUS"}]
    },
    "scout-sub-crypt": {
      orientation: "bottom",
      note: "Enemy operatives begin along the lower edge. No NPOs are placed at setup. Each numbered room can awaken a new group when first opened or entered.",
      walls: [[160,30,160,235],[360,30,360,335],[590,100,590,335],[30,165,360,165],[360,255,770,255],[150,345,590,345]],
      hatches: [[160,105,"v"],[360,100,"v"],[360,285,"v"],[590,180,"v"],[250,165,"h"],[480,255,"h"],[300,345,"h"]],
      npos: [],
      markers: [{kind:"room",x:95,y:95,label:"1"},{kind:"room",x:260,y:95,label:"2"},{kind:"room",x:475,y:175,label:"3"},{kind:"room",x:680,y:165,label:"4"},{kind:"room",x:480,y:390,label:"5"}]
    },
    "regroup": {
      orientation: "left-regroup",
      note: "Enemy operatives begin at the left edge. The outlined far zone is NPO drop zone. Green hatchways are phasing points that can relocate operatives.",
      walls: [[200,30,200,250],[390,30,390,460],[520,30,520,205],[200,135,650,135],[30,285,520,285],[200,395,770,395]],
      hatches: [[200,100,"v"],[390,90,"v"],[390,225,"v"],[520,115,"v"],[285,285,"h"],[455,285,"h"],[300,395,"h"],[620,395,"h"]],
      npos: [[480,85],[610,245],[500,345]],
      markers: [{kind:"regroup",x:690,y:235,label:"REGROUP"}]
    }
  };

  const EVENTS = [
    {
      name: "Dark of the Tomb",
      tag: "VISIBILITY FAILURE",
      effect: "Long-range player shooting becomes less reliable until the end of the turning point. Do not reroll attack dice for shots beyond 8 inches.",
      log: "The tomb darkens. Long-range player shooting loses rerolls this turning point."
    },
    {
      name: "The Maze Reforms",
      tag: "ARCHITECTURAL SHIFT",
      effect: "Randomly close one open breach point and up to D3 open hatchways. Redraw if nothing can close.",
      log: "The maze reforms and seals open routes."
    },
    {
      name: "Awakened Warrior",
      tag: "REINFORCEMENT",
      effect: "Set up one ready Necron Warrior with a Conceal order beside a suitable Necron-marked terrain feature. If that is impossible, draw again.",
      log: "A dormant Necron Warrior awakens.",
      spawn: "Necron Warrior"
    },
    {
      name: "A Chittering Drone",
      tag: "CANOPTEK SURGE",
      effect: "If no Scarab Swarm is active, deploy one from a suitable access point. Otherwise, fully restore one wounded Scarab Swarm.",
      log: "Canoptek scarabs pour into the killzone.",
      spawnOrHeal: "Canoptek Scarab Swarm"
    },
    {
      name: "Living Metal Flux",
      tag: "REPAIR WAVE",
      effect: "Each wounded NPO regains D3+2 wounds, rolled separately and capped at its maximum.",
      log: "Living metal repairs the tomb guardians.",
      healAll: true
    },
    {
      name: "My Will Be Done",
      tag: "NOBLE COMMAND",
      effect: "NPOs near the sarcophagus gain improved accuracy until the end of the turning point. Apply Accurate 1 to their weapons.",
      log: "A sleeping noble asserts command over nearby constructs."
    },
    {
      name: "Reanimation Protocols",
      tag: "SYSTEM OVERRIDE",
      effect: "The first time each NPO would be incapacitated this turning point, roll a D6. On 4+, leave it on 1 wound, expend it if ready, and reduce its next activation efficiency.",
      log: "Reanimation protocols are active this turning point."
    },
    {
      name: "Subjugation Glyphs",
      tag: "MORALE DISRUPTION",
      effect: "Randomly test enemy operatives until one suffers an APL reduction or all have been tested, following the official event card procedure.",
      log: "Subjugation glyphs erode the invaders' coordination."
    },
    {
      name: "Transdimensional Relocation",
      tag: "POSITIONAL ANOMALY",
      effect: "Randomly swap pairs of enemy operative positions up to three times, where legal.",
      log: "Reality shifts and enemy operatives exchange positions."
    },
    {
      name: "Stirrings of Horror",
      tag: "THREAT ESCALATION",
      effect: "Increase the threat level by 1. At maximum threat, add one extra reinforcement instead.",
      log: "The master program takes a lethal interest in the battle.",
      threat: 1
    },
    {
      name: "Countertemporal Shifting",
      tag: "CHRONOMANTIC DEFENCE",
      effect: "When an attack die would inflict 3 or more damage on an NPO, roll a D6. On 5+, reduce that instance of damage by 1.",
      log: "NPOs flicker across adjacent timelines."
    }
  ];

  const BEHAVIOR_LABELS = {
    brawler: "Brawler",
    marksman: "Marksman",
    sentinel: "Sentinel",
    guardian: "Objective Guardian"
  };

  const DEFAULT_ROSTER = [
    makeNpo("Necron Warrior 1", "Necron Warrior"),
    makeNpo("Necron Warrior 2", "Necron Warrior"),
    makeNpo("Necron Warrior 3", "Necron Warrior"),
    makeNpo("Necron Warrior 4", "Necron Warrior"),
    makeNpo("Scarab Swarm 1", "Canoptek Scarab Swarm"),
    makeNpo("Scarab Swarm 2", "Canoptek Scarab Swarm"),
    makeNpo("Macrocyte 1", "Canoptek Macrocyte")
  ];

  const defaultState = () => ({
    version: 1,
    turn: 1,
    threat: 0,
    missionId: MISSIONS[0].id,
    missionProgress: Object.fromEntries(MISSIONS.map(m => [m.id, 0])),
    npos: DEFAULT_ROSTER.map(cloneNpo),
    event: null,
    log: [],
    lastActivation: null,
    nextNpoId: null,
    snapshot: {
      engaged: false,
      validShot: true,
      canCharge: true,
      canReachLos: true,
      doorBlocked: false,
      targetsClustered: false,
      missionCritical: false,
      targetWounded: false,
      distance: "medium",
      cover: "cover"
    }
  });

  let state = loadState();
  let pendingEnemyAttack = null;

  const els = {
    turnNumber: byId("turnNumber"),
    threatValue: byId("threatValue"),
    threatGrade: byId("threatGrade"),
    threatSlider: byId("threatSlider"),
    threatMeterFill: byId("threatMeterFill"),
    threatStatus: byId("threatStatus"),
    missionSelect: byId("missionSelect"),
    missionCard: byId("missionCard"),
    eventCard: byId("eventCard"),
    activityLog: byId("activityLog"),
    rosterGrid: byId("rosterGrid"),
    rosterSummary: byId("rosterSummary"),
    activationOutput: byId("activationOutput"),
    nextEnemyCard: byId("nextEnemyCard"),
    npoDialog: byId("npoDialog"),
    npoForm: byId("npoForm"),
    dialogTitle: byId("dialogTitle"),
    editNpoId: byId("editNpoId"),
    npoName: byId("npoName"),
    npoType: byId("npoType"),
    npoBehavior: byId("npoBehavior"),
    npoMaxWounds: byId("npoMaxWounds"),
    npoWounds: byId("npoWounds"),
    npoWeapon: byId("npoWeapon"),
    npoAttackDice: byId("npoAttackDice"),
    npoHit: byId("npoHit"),
    npoNormalDamage: byId("npoNormalDamage"),
    npoCritDamage: byId("npoCritDamage"),
    attackDialog: byId("attackDialog"),
    attackForm: byId("attackForm"),
    attackDialogTitle: byId("attackDialogTitle"),
    attackTargetId: byId("attackTargetId"),
    attackTargetStatus: byId("attackTargetStatus"),
    combatResultPreview: byId("combatResultPreview"),
    resolveAttackBtn: byId("resolveAttackBtn"),
    mapDialog: byId("mapDialog"),
    mapDialogTitle: byId("mapDialogTitle"),
    mapDialogContent: byId("mapDialogContent"),
    importInput: byId("importInput")
  };

  init();

  function init() {
    populateMissionSelect();
    syncSnapshotControls();
    bindEvents();
    applyThreatReadiness(state.threat, state.threat);
    ensureNextNpo();
    saveState();
    renderAll();
  }

  function bindEvents() {
    byId("activateBtn").addEventListener("click", activateNextEnemy);
    byId("strategyBtn").addEventListener("click", resolveStrategyPhase);
    byId("newTurnBtn").addEventListener("click", startNextTurn);
    byId("eventBtn").addEventListener("click", drawRandomEvent);
    byId("enemyHatchBtn").addEventListener("click", recordOperateHatch);
    byId("enemyBreachBtn").addEventListener("click", recordBreach);
    byId("randomMissionBtn").addEventListener("click", randomMission);
    byId("clearLogBtn").addEventListener("click", () => {
      state.log = [];
      saveAndRender();
    });
    byId("threatDown").addEventListener("click", () => setThreat(state.threat - 1));
    byId("threatUp").addEventListener("click", () => setThreat(state.threat + 1));
    els.threatSlider.addEventListener("input", e => setThreat(Number(e.target.value), false));
    els.threatSlider.addEventListener("change", saveAndRender);
    els.missionSelect.addEventListener("change", e => {
      state.missionId = e.target.value;
      addLog(`Mission selected: ${currentMission().name}.`);
      saveAndRender();
    });
    byId("clearSnapshotBtn").addEventListener("click", clearSnapshot);
    byId("addNpoBtn").addEventListener("click", () => openNpoDialog());
    byId("generateRosterBtn").addEventListener("click", generateNecronRoster);
    byId("resetCampaignBtn").addEventListener("click", resetSession);
    byId("exportBtn").addEventListener("click", exportSave);
    els.importInput.addEventListener("change", importSave);
    els.npoType.addEventListener("change", applyTemplateToDialog);
    els.npoForm.addEventListener("submit", saveNpoFromDialog);
    els.attackForm.addEventListener("submit", resolvePlayerAttack);
    els.attackDialog.addEventListener("click", handleNumberStepper);
    els.attackDialog.addEventListener("change", clampNumberInput);
    els.attackDialog.addEventListener("cancel", event => {
      event.preventDefault();
      pendingEnemyAttack = null;
      els.attackDialog.close();
    });
    els.attackDialog.addEventListener("close", () => {
      pendingEnemyAttack = null;
    });
    byId("closeMapBtn").addEventListener("click", () => els.mapDialog.close());
    els.mapDialog.addEventListener("click", event => {
      if (event.target === els.mapDialog) els.mapDialog.close();
    });
    const workspaceTabs = document.querySelector(".workspace-tabs");
    if (workspaceTabs) {
      workspaceTabs.addEventListener("click", event => {
        const button = event.target.closest("[data-workspace-tab]");
        if (!button || !workspaceTabs.contains(button)) return;
        event.preventDefault();
        activateWorkspaceTab(button.dataset.workspaceTab, { focus: false });
      });
      workspaceTabs.addEventListener("keydown", event => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        const buttons = [...workspaceTabs.querySelectorAll("[data-workspace-tab]")];
        const current = buttons.indexOf(document.activeElement);
        if (current < 0) return;
        event.preventDefault();
        let next = current;
        if (event.key === "ArrowLeft") next = (current - 1 + buttons.length) % buttons.length;
        if (event.key === "ArrowRight") next = (current + 1) % buttons.length;
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = buttons.length - 1;
        activateWorkspaceTab(buttons[next].dataset.workspaceTab, { focus: true });
      });
    }

    const snapshotMap = {
      ctxEngaged: "engaged",
      ctxValidShot: "validShot",
      ctxCanCharge: "canCharge",
      ctxCanReachLos: "canReachLos",
      ctxDoorBlocked: "doorBlocked",
      ctxTargetsClustered: "targetsClustered",
      ctxMissionCritical: "missionCritical",
      ctxTargetWounded: "targetWounded",
      ctxDistance: "distance",
      ctxCover: "cover"
    };

    Object.entries(snapshotMap).forEach(([id, key]) => {
      const el = byId(id);
      el.addEventListener("change", () => {
        state.snapshot[key] = el.type === "checkbox" ? el.checked : el.value;
        saveState();
      });
    });
  }

  function activateWorkspaceTab(panelId, options = {}) {
    const { focus = false } = options;
    const targetPanel = document.getElementById(panelId);
    const targetButton = document.querySelector(`[data-workspace-tab="${panelId}"]`);
    if (!targetPanel || !targetButton) return;

    document.querySelectorAll("[data-workspace-tab]").forEach(button => {
      const active = button === targetButton;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
      button.tabIndex = active ? 0 : -1;
    });
    document.querySelectorAll(".workspace-panel").forEach(panel => {
      const active = panel === targetPanel;
      panel.classList.toggle("active", active);
      panel.hidden = !active;
      panel.setAttribute("aria-hidden", String(!active));
    });

    targetButton.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    if (focus) targetButton.focus({ preventScroll: true });
  }

  function populateMissionSelect() {
    els.missionSelect.innerHTML = MISSIONS.map(m => `<option value="${m.id}">${m.number} · ${escapeHtml(m.name)}</option>`).join("");
  }

  function renderAll() {
    els.turnNumber.textContent = String(state.turn);
    els.threatValue.textContent = String(state.threat);
    const currentGrade = threatGrade(state.threat);
    els.threatGrade.textContent = `Grade ${currentGrade}`;
    els.threatSlider.value = String(state.threat);
    els.threatMeterFill.style.width = `${(state.threat / 15) * 100}%`;
    els.threatStatus.textContent = threatStatusText(state.threat);
    els.missionSelect.value = state.missionId;
    renderMission();
    renderEvent();
    renderNextEnemy();
    renderRoster();
    renderLog();
    renderActivation();
  }

  function missionMapSvg(mission, expanded = false) {
    const map = MISSION_MAPS[mission.id];
    if (!map) return "";

    const zoneMarkup = map.orientation === "bottom"
      ? `
        <rect class="map-zone map-zone-enemy" x="30" y="30" width="740" height="235" rx="7"></rect>
        <rect class="map-zone map-zone-player" x="30" y="265" width="740" height="100"></rect>
        <rect class="map-zone map-zone-drop" x="30" y="365" width="740" height="95" rx="0 0 7 7"></rect>
        <line class="map-boundary" x1="30" y1="265" x2="770" y2="265"></line>
        <text class="map-zone-label" x="52" y="430">ENEMY DROP ZONE</text>
        <text class="map-zone-label enemy-label" x="52" y="58">NPO TERRITORY</text>`
      : `
        <rect class="map-zone map-zone-drop" x="30" y="30" width="130" height="430" rx="7 0 0 7"></rect>
        <rect class="map-zone map-zone-player" x="160" y="30" width="240" height="430"></rect>
        <rect class="map-zone map-zone-enemy" x="400" y="30" width="370" height="430" rx="0 7 7 0"></rect>
        <line class="map-boundary" x1="400" y1="30" x2="400" y2="460"></line>
        <text class="map-zone-label vertical-label" x="76" y="245" transform="rotate(-90 76 245)">ENEMY DROP ZONE</text>
        <text class="map-zone-label enemy-label" x="565" y="58">NPO TERRITORY</text>
        ${map.orientation === "left-regroup" ? `<rect class="map-regroup-zone" x="635" y="42" width="122" height="406" rx="9"></rect><text class="map-zone-label regroup-zone-label" x="696" y="438" text-anchor="middle">PLAYER B DROP ZONE</text>` : ""}`;

    const walls = map.walls.map(([x1,y1,x2,y2]) =>
      `<line class="map-wall" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"></line>`
    ).join("");

    const hatches = map.hatches.map(([x,y,orientation], index) => {
      const vertical = orientation === "v";
      const x1 = vertical ? x : x - 17;
      const y1 = vertical ? y - 17 : y;
      const x2 = vertical ? x : x + 17;
      const y2 = vertical ? y + 17 : y;
      return `<g class="map-hatch" aria-label="Access point ${index + 1}"><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"></line><circle cx="${x}" cy="${y}" r="4"></circle></g>`;
    }).join("");

    const npos = map.npos.map(([x,y], index) =>
      `<g class="map-npo" transform="translate(${x} ${y})" aria-label="Suggested NPO deployment ${index + 1}"><circle r="13"></circle><path d="M-6 -2 0 -8 6 -2 4 7 0 10 -4 7Z"></path><circle cx="-3" cy="0" r="1.7"></circle><circle cx="3" cy="0" r="1.7"></circle></g>`
    ).join("");

    const markers = map.markers.map(marker => renderMapMarker(marker)).join("");
    const subtitle = expanded ? "Expanded schematic" : "Mission setup schematic";

    return `
      <div class="mission-map-frame ${expanded ? "expanded" : ""}">
        <svg class="mission-map-svg" viewBox="0 0 800 500" role="img" aria-labelledby="map-title-${mission.id} map-desc-${mission.id}">
          <title id="map-title-${mission.id}">${escapeHtml(mission.name)} board layout</title>
          <desc id="map-desc-${mission.id}">${escapeHtml(map.note)}</desc>
          <defs>
            <pattern id="grid-${mission.id}" width="53" height="53" patternUnits="userSpaceOnUse">
              <path d="M 53 0 L 0 0 0 53" class="map-grid-line"></path>
            </pattern>
            <filter id="glow-${mission.id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.8" result="blur"></feGaussianBlur><feMerge><feMergeNode in="blur"></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter>
          </defs>
          <rect class="map-canvas" x="18" y="18" width="764" height="454" rx="12"></rect>
          ${zoneMarkup}
          <rect class="map-grid-fill" x="30" y="30" width="740" height="430" rx="7" fill="url(#grid-${mission.id})"></rect>
          ${walls}
          ${hatches}
          ${npos}
          ${markers}
          <text class="map-compass" x="746" y="488" text-anchor="end">${subtitle.toUpperCase()} · NOT TO SCALE</text>
        </svg>
      </div>`;
  }

  function renderMapMarker(marker) {
    const label = escapeHtml(marker.label || "");
    if (marker.kind === "objective") {
      return `<g class="map-marker map-objective" transform="translate(${marker.x} ${marker.y})"><path d="M0 -16 16 0 0 16 -16 0Z"></path><text y="4" text-anchor="middle">${label}</text></g>`;
    }
    if (marker.kind === "sarcophagus") {
      return `<g class="map-marker map-sarcophagus" transform="translate(${marker.x} ${marker.y})"><rect x="-54" y="-20" width="108" height="40" rx="12"></rect><path d="M-37 0 H37"></path><text y="5" text-anchor="middle">S</text><text class="map-marker-caption" y="38" text-anchor="middle">${label}</text></g>`;
    }
    if (marker.kind === "exit") {
      return `<g class="map-marker map-exit" transform="translate(${marker.x} ${marker.y})"><path d="M-42 -22 H-10 V-38 L22 0 -10 38 V22 H-42Z"></path><text class="map-marker-caption" x="-60" y="5" text-anchor="end">${label}</text></g>`;
    }
    if (marker.kind === "breach") {
      return `<g class="map-marker map-breach" transform="translate(${marker.x} ${marker.y})"><circle r="16"></circle><path d="M-8 8 8 -8 M-8 -8 8 8"></path><text class="map-marker-caption" y="35" text-anchor="middle">${label}</text></g>`;
    }
    if (marker.kind === "room") {
      return `<g class="map-marker map-room" transform="translate(${marker.x} ${marker.y})"><circle r="23"></circle><text y="7" text-anchor="middle">${label}</text></g>`;
    }
    if (marker.kind === "regroup") {
      return `<g class="map-marker map-regroup" transform="translate(${marker.x} ${marker.y})"><circle r="26"></circle><path d="M-12 0 H12 M0 -12 V12"></path><text class="map-marker-caption" y="45" text-anchor="middle">${label}</text></g>`;
    }
    return "";
  }

  function openMissionMap(mission) {
    const map = MISSION_MAPS[mission.id];
    if (!map) return;
    els.mapDialogTitle.textContent = `${mission.number} · ${mission.name}`;
    els.mapDialogContent.innerHTML = `
      ${missionMapSvg(mission, true)}
      <p class="map-dialog-note">${escapeHtml(map.note)}</p>
      <div class="map-legend" aria-label="Board layout legend">
        <span><i class="legend-swatch drop"></i> Enemy drop zone</span>
        <span><i class="legend-swatch player"></i> Enemy territory</span>
        <span><i class="legend-swatch enemy"></i> NPO territory</span>
        <span><i class="legend-symbol npo"></i> Suggested NPO area</span>
        <span><i class="legend-symbol hatch"></i> Hatch / access point</span>
        <span><i class="legend-symbol marker"></i> Mission marker</span>
      </div>`;
    els.mapDialog.showModal();
  }

  function renderMission() {
    const mission = currentMission();
    const progress = Number(state.missionProgress[mission.id] || 0);
    const percentage = Math.min(100, Math.round((progress / mission.trackerMax) * 100));
    els.missionCard.innerHTML = `
      <span class="mission-number">MISSION ${mission.number}</span>
      <h3>${escapeHtml(mission.name)}</h3>
      <p>${escapeHtml(mission.summary)}</p>
      <div class="mission-goal"><strong>Objective:</strong> ${escapeHtml(mission.goal)}</div>
      <p><strong>Setup note:</strong> ${escapeHtml(mission.setup)}</p>
      <section class="mission-layout-section" aria-label="Mission board layout">
        <div class="mission-layout-heading">
          <div><span class="mission-number">BOARD LAYOUT</span><h4>${escapeHtml(mission.name)} setup</h4></div>
          <button class="button secondary map-expand-button" type="button" data-expand-map>Open Large Map</button>
        </div>
        ${missionMapSvg(mission)}
        <p class="mission-map-note">${escapeHtml(MISSION_MAPS[mission.id].note)}</p>
        <div class="map-legend compact" aria-label="Board layout legend">
          <span><i class="legend-swatch drop"></i> A drop zone</span>
          <span><i class="legend-swatch enemy"></i> NPO territory</span>
          <span><i class="legend-symbol npo"></i> NPO</span>
          <span><i class="legend-symbol hatch"></i> Hatch</span>
          <span><i class="legend-symbol marker"></i> Mission marker</span>
        </div>
      </section>
      <div class="wound-label"><span>${escapeHtml(mission.trackerLabel)}</span><strong>${progress} / ${mission.trackerMax}</strong></div>
      <div class="meter"><span style="width:${percentage}%"></span></div>
      <div class="progress-row">
        <button class="icon-button" type="button" data-progress="-1" aria-label="Decrease mission progress">−</button>
        <input type="range" min="0" max="${mission.trackerMax}" value="${progress}" data-progress-range aria-label="Mission progress">
        <button class="icon-button" type="button" data-progress="1" aria-label="Increase mission progress">+</button>
      </div>`;

    els.missionCard.querySelector("[data-expand-map]").addEventListener("click", () => openMissionMap(mission));

    els.missionCard.querySelectorAll("[data-progress]").forEach(button => {
      button.addEventListener("click", () => updateMissionProgress(Number(button.dataset.progress)));
    });
    els.missionCard.querySelector("[data-progress-range]").addEventListener("input", e => {
      state.missionProgress[mission.id] = Number(e.target.value);
      saveAndRender();
    });
  }

  function renderEvent() {
    if (!state.event) {
      els.eventCard.innerHTML = `<p class="muted">No event has been resolved this turning point.</p>`;
      return;
    }
    els.eventCard.innerHTML = `
      <span class="event-tag">${escapeHtml(state.event.tag)}</span>
      <h3>${escapeHtml(state.event.name)}</h3>
      <p class="event-effect">${escapeHtml(state.event.effect)}</p>`;
  }

  function renderNextEnemy() {
    const next = ensureNextNpo();
    if (!next) {
      els.nextEnemyCard.classList.add("empty");
      els.nextEnemyCard.innerHTML = `
        <div>
          <p class="eyebrow">NEXT ENEMY</p>
          <h3>No ready NPO</h3>
          <p>Start the next turning point or manually ready an operative.</p>
        </div>`;
      return;
    }

    els.nextEnemyCard.classList.remove("empty");
    els.nextEnemyCard.innerHTML = `
      <div class="next-enemy-icon" aria-hidden="true">▶</div>
      <div class="next-enemy-copy">
        <p class="eyebrow">NEXT TO ACTIVATE</p>
        <h3>${escapeHtml(next.name)}</h3>
        <p>${escapeHtml(next.type)} · ${escapeHtml(BEHAVIOR_LABELS[next.behavior] || next.behavior)} · ${next.wounds}/${next.maxWounds} wounds</p>
        <small>Complete the NPO Perspective Snapshot for this operative, then select Activate Next NPO.</small>
      </div>
      <span class="next-enemy-lock">LOCKED</span>`;
  }

  function renderRoster() {
    const active = state.npos.filter(n => n.wounds > 0);
    const rosterTab = byId("rosterTab");
    if (rosterTab) {
      rosterTab.textContent = `Roster (${active.length})`;
      rosterTab.setAttribute("aria-label", `Roster, ${active.length} active NPO${active.length === 1 ? "" : "s"}`);
    }
    const ready = active.filter(n => n.ready);
    const totalWounds = active.reduce((sum, n) => sum + n.wounds, 0);
    els.rosterSummary.innerHTML = `
      <span class="summary-chip"><strong>${active.length}</strong> active</span>
      <span class="summary-chip"><strong>${ready.length}</strong> ready</span>
      <span class="summary-chip"><strong>${totalWounds}</strong> wounds remaining</span>
      <span class="summary-chip"><strong>${Math.max(0, 10 - active.length)}</strong> below suggested 10-NPO limit</span>`;

    if (!state.npos.length) {
      els.rosterGrid.innerHTML = `<div class="mission-card"><h3>No NPOs in roster</h3><p>Add an NPO or generate a Tomb World roster.</p></div>`;
      return;
    }

    els.rosterGrid.innerHTML = state.npos.map(npo => {
      const percent = Math.max(0, Math.min(100, Math.round((npo.wounds / npo.maxWounds) * 100)));
      const classes = ["npo-card"];
      if (!npo.ready) classes.push("expended");
      if (npo.wounds <= 0) classes.push("incapacitated");
      if (npo.id === state.nextNpoId && npo.ready && npo.wounds > 0) classes.push("next-to-activate");
      const stateLabel = npo.wounds <= 0 ? "Incapacitated" : npo.ready ? "Ready" : "Expended";
      return `
        <article class="${classes.join(" ")}" data-npo-id="${npo.id}">
          ${npo.wounds <= 0 ? '<span class="skull-watermark" aria-label="Incapacitated">☠</span>' : ""}
          <div class="npo-head">
            <div>
              <h3 class="npo-name">${escapeHtml(npo.name)}</h3>
              <div class="npo-type">${escapeHtml(npo.type)} · Move ${npo.move || "?"}&quot; · Save ${escapeHtml(npo.save || "?")}</div>
            </div>
            <span class="behavior-pill">${escapeHtml(BEHAVIOR_LABELS[npo.behavior] || npo.behavior)}</span>
          </div>
          <div class="wound-meter">
            <div class="wound-label"><span>Wounds</span><strong>${npo.wounds} / ${npo.maxWounds}</strong></div>
            <div class="meter"><span style="width:${percent}%"></span></div>
          </div>
          <div class="npo-weapon">${escapeHtml(npo.weapon || "No weapon note")}</div>
          <div class="npo-profile">Attack ${npo.attackDice || 4} · Hit ${npo.hit || 4}+ · Damage ${npo.normalDamage || 3}/${npo.critDamage || 4}</div>
          <button type="button" class="resolve-player-attack" data-action="resolve-attack" ${npo.wounds <= 0 ? "disabled" : ""}>Resolve Enemy Attack</button>
          <div class="npo-controls">
            <button type="button" data-action="damage" title="Apply one damage">−1 W</button>
            <button type="button" data-action="heal" title="Restore one wound">+1 W</button>
            <button type="button" data-action="toggle-ready">${npo.ready ? "Expend" : "Ready"}</button>
            <button type="button" data-action="edit">Edit</button>
            <button type="button" data-action="full-heal">Full heal</button>
            <button type="button" data-action="incapacitate">Remove</button>
            <button type="button" data-action="duplicate">Duplicate</button>
            <button type="button" data-action="delete">Delete</button>
          </div>
          <div class="ready-state"><span class="ready-lamp"></span>${stateLabel}</div>
        </article>`;
    }).join("");

    els.rosterGrid.querySelectorAll("[data-npo-id]").forEach(card => {
      card.querySelectorAll("[data-action]").forEach(button => {
        button.addEventListener("click", () => handleNpoAction(card.dataset.npoId, button.dataset.action));
      });
    });
  }

  function renderLog() {
    if (!state.log.length) {
      els.activityLog.innerHTML = `<li>No battle activity recorded yet.</li>`;
      return;
    }
    els.activityLog.innerHTML = state.log.slice(0, 40).map(item => `
      <li><time>${escapeHtml(item.time)}</time>${escapeHtml(item.text)}</li>`).join("");
  }

  function renderActivation() {
    const result = state.lastActivation;
    if (!result) {
      els.activationOutput.innerHTML = `
        <div class="activation-empty">
          <div class="pulse-ring"></div>
          <h3>Command core standing by</h3>
          <p>The operative shown in Next to Activate is locked and ready for its NPO Perspective Snapshot.</p>
        </div>`;
      return;
    }

    const attackMarkup = result.attackRoll ? `
      <section class="attack-roll-panel">
        <div class="attack-roll-heading">
          <div>
            <p class="eyebrow">${escapeHtml(result.attackRoll.action)} DICE</p>
            <h4>${escapeHtml(result.attackRoll.weapon)}</h4>
          </div>
          <span class="profile-chip">${result.attackRoll.dice.length} dice · ${result.attackRoll.hit}+ · ${result.attackRoll.normalDamage}/${result.attackRoll.critDamage} damage</span>
        </div>
        <div class="dice-tray" aria-label="Enemy attack dice results">${renderDice(result.attackRoll.dice)}</div>
        <div class="roll-summary">
          <strong class="crit-text">${result.attackRoll.crits} critical</strong>
          <strong class="hit-text">${result.attackRoll.hits} normal hit${result.attackRoll.hits === 1 ? "" : "s"}</strong>
          <span>${result.attackRoll.misses} miss${result.attackRoll.misses === 1 ? "" : "es"}</span>
        </div>
        <p class="dice-note">Attack dice are rolled automatically. Resolve the enemy operative's defence and special rules on the tabletop.</p>
      </section>` : "";

    els.activationOutput.innerHTML = `
      <div class="activation-result">
        <div class="activation-result-head">
          <div>
            <p class="eyebrow">NPO ACTIVATION RESOLVED</p>
            <h3 class="activation-name">${escapeHtml(result.name)}</h3>
            <p class="npo-type">${escapeHtml(result.type)} · ${escapeHtml(result.behavior)}</p>
          </div>
          <span class="order-badge ${result.order.toLowerCase()}">${escapeHtml(result.order)} ORDER</span>
        </div>
        <ol class="action-list">
          ${result.actions.map((action, index) => `
            <li>
              <span class="action-step">${index + 1}</span>
              <span><strong>${escapeHtml(action.title)}</strong>${escapeHtml(action.detail)}</span>
            </li>`).join("")}
        </ol>
        ${attackMarkup}
        <p class="rationale"><strong>Threat principle:</strong> ${escapeHtml(result.rationale)}</p>
      </div>`;
  }

  function renderDice(dice) {
    return dice.map(die => `
      <span class="die ${die.kind}" title="${escapeHtml(die.label)}: ${escapeHtml(String(die.value))}" aria-label="${escapeHtml(die.label)}. Die result ${escapeHtml(String(die.value))}.">
        ${renderDieFace(die.value, die.kind)}
        <small>${escapeHtml(die.label)}</small>
      </span>`).join("");
  }

  function renderDieFace(value, kind) {
    const numericValue = Number(value);
    if (!Number.isInteger(numericValue) || numericValue < 1 || numericValue > 6) {
      return `<span class="die-face die-face-symbol" aria-hidden="true">${kind === "cover" ? "◆" : escapeHtml(String(value))}</span>`;
    }

    const pipPositions = {
      1: [5],
      2: [1, 9],
      3: [1, 5, 9],
      4: [1, 3, 7, 9],
      5: [1, 3, 5, 7, 9],
      6: [1, 3, 4, 6, 7, 9]
    };
    const occupied = new Set(pipPositions[numericValue]);
    const pips = Array.from({ length: 9 }, (_, index) => {
      const position = index + 1;
      return `<i class="pip${occupied.has(position) ? " visible" : ""}" aria-hidden="true"></i>`;
    }).join("");

    return `<span class="die-face die-pips face-${numericValue}" aria-hidden="true">${pips}</span>`;
  }

  function activateNextEnemy() {
    captureSnapshot();
    const ready = state.npos.filter(n => n.ready && n.wounds > 0);
    if (!ready.length) {
      state.lastActivation = {
        name: "No ready NPO",
        type: "Command status",
        behavior: "All active enemies are expended",
        order: "Conceal",
        actions: [{ title: "Pass", detail: "Start the next turning point or manually ready an NPO." }],
        rationale: "There is no legal NPO activation available."
      };
      addLog("Activation attempted, but no ready NPO was available.");
      saveAndRender();
      return;
    }

    const selected = ensureNextNpo();
    if (!selected) return;
    const result = resolveBehavior(selected, state.snapshot);
    result.attackRoll = rollNpoAttack(selected, result);
    const automaticThreatActions = result.actions.filter(action => action.title === "Shoot" || action.title === "Fight");
    automaticThreatActions.forEach(action => increaseThreat(1, `${selected.name} performed ${action.title}`));
    selected.ready = false;
    selected.activations = (selected.activations || 0) + 1;
    state.nextNpoId = null;
    state.lastActivation = result;
    addLog(`${selected.name} activated: ${result.actions.map(a => a.title).join(" → ")}.`);
    saveAndRender();
  }

  function rollNpoAttack(npo, result) {
    const attackAction = result.actions.find(action => /shoot|fight/i.test(action.title));
    if (!attackAction) return null;
    const count = Math.max(1, Number(npo.attackDice || 4));
    const hit = Math.max(2, Math.min(6, Number(npo.hit || 4)));
    const dice = Array.from({ length: count }, () => {
      const value = randomInt(1, 6);
      if (value === 6) return { value, kind: "critical", label: "Critical hit" };
      if (value >= hit) return { value, kind: "hit", label: "Normal hit" };
      return { value, kind: "miss", label: "Miss" };
    });
    return {
      action: attackAction.title,
      weapon: npo.weapon || "NPO attack",
      hit,
      normalDamage: Number(npo.normalDamage || 3),
      critDamage: Number(npo.critDamage || 4),
      dice,
      crits: dice.filter(d => d.kind === "critical").length,
      hits: dice.filter(d => d.kind === "hit").length,
      misses: dice.filter(d => d.kind === "miss").length
    };
  }

  function ensureNextNpo() {
    const current = state.npos.find(npo => npo.id === state.nextNpoId && npo.ready && npo.wounds > 0);
    if (current) return current;

    const ready = state.npos.filter(npo => npo.ready && npo.wounds > 0);
    if (!ready.length) {
      state.nextNpoId = null;
      return null;
    }

    const selected = selectNpoByThreat(ready, state.snapshot);
    state.nextNpoId = selected.id;
    return selected;
  }

  function selectNpoByThreat(npos, ctx) {
    const scored = npos.map(npo => {
      let score = 0;
      if (ctx.engaged && ["brawler", "sentinel"].includes(npo.behavior)) score += 60;
      if (ctx.validShot && ["marksman", "sentinel", "guardian"].includes(npo.behavior)) score += 52;
      if (ctx.canCharge && npo.behavior === "brawler") score += 45;
      if (ctx.missionCritical && npo.behavior === "guardian") score += 58;
      if (ctx.targetWounded) score += npo.behavior === "marksman" ? 25 : 15;
      if (ctx.cover === "open") score += 12;
      if (ctx.distance === "close") score += npo.behavior === "brawler" ? 18 : 8;
      if (ctx.distance === "far") score += npo.behavior === "marksman" ? 14 : 0;
      if (npo.type === "Canoptek Tomb Crawler") score += 10;
      score += Math.min(10, npo.wounds / Math.max(1, npo.maxWounds) * 10);
      score -= (npo.activations || 0) * 0.01;
      return { npo, score, tie: Math.random() };
    });
    scored.sort((a, b) => b.score - a.score || b.tie - a.tie);
    return scored[0].npo;
  }

  function resolveBehavior(npo, ctx) {
    const actions = [];
    let order = "Conceal";
    const target = chooseTargetText(ctx);

    if (ctx.doorBlocked) {
      actions.push({
        title: "Operate Hatch",
        detail: "Open the hatchway that blocks the shortest route toward the selected target or mission position."
      });
    }

    if (npo.behavior === "brawler") {
      if (ctx.engaged) {
        order = "Engage";
        actions.push({ title: "Fight", detail: `Fight ${target}. Use the target most likely to be incapacitated.` });
        actions.push({ title: "Fight again or reposition", detail: "If a second Fight is legal for this operative, resolve it. Otherwise move to engage the next most mission-critical enemy operative." });
      } else if (ctx.canCharge) {
        order = "Engage";
        actions.push({ title: "Charge", detail: `Take the shortest legal route to ${target}, using cover on the approach when routes are equally short.` });
        actions.push({ title: "Fight", detail: "Fight the charged operative. Prioritize a wounded or mission-critical target." });
      } else {
        actions.push({ title: "Reposition", detail: `Move toward ${target}, ending in cover if possible.` });
        actions.push({ title: "Dash", detail: "Continue toward the closest enemy operative, remaining in cover where possible." });
      }
    } else if (npo.behavior === "marksman") {
      if (ctx.engaged) {
        order = "Engage";
        actions.push({ title: "Fall Back", detail: "Move to the nearest legal position that creates a clear shot. Prefer a route that also interferes with the player mission." });
        if (ctx.validShot || ctx.canReachLos) {
          actions.push({ title: "Shoot", detail: `Shoot ${target}. Use the ranged profile best suited to current distance and cover.` });
        } else {
          actions.push({ title: "Reposition", detail: "Move toward a firing lane or a position that blocks the player objective." });
        }
      } else if (ctx.validShot) {
        order = "Engage";
        actions.push({ title: "Shoot", detail: `Shoot ${target}. Select the target most likely to be incapacitated, then prefer unobscured, out-of-cover, closest, and ready operatives.` });
        actions.push({ title: "Reposition or Dash", detail: "If an action remains, improve the firing angle while retaining cover or move to contest the mission." });
      } else if (ctx.canReachLos) {
        actions.push({ title: "Reposition", detail: "Move to the closest position with a valid, unobscured target. Prefer cover if two positions are equivalent." });
        actions.push({ title: "Shoot", detail: `If the move creates a valid target, shoot ${target}. Otherwise Dash to improve next activation.` });
      } else {
        actions.push({ title: "Reposition", detail: "Move toward the best firing lane or mission-blocking position." });
        actions.push({ title: "Dash", detail: "Continue to a position that should create a shot next activation." });
      }
    } else if (npo.behavior === "sentinel") {
      if (ctx.engaged) {
        order = "Engage";
        actions.push({ title: "Fight", detail: `Fight ${target}. Use claws or the operative's melee profile.` });
        if (ctx.validShot) {
          actions.push({ title: "Shoot", detail: `If still legal, shoot ${target} or the next highest-priority enemy operative.` });
        } else {
          actions.push({ title: "Reposition", detail: "Move to control space, block a hatchway, or obtain a firing lane." });
        }
      } else if (ctx.validShot) {
        order = "Engage";
        const profile = ctx.targetsClustered
          ? "Use the sweeping, blast, torrent, or living-lightning profile when it can affect multiple players without harming NPOs."
          : "Use the focused profile against the highest-priority target.";
        actions.push({ title: "Shoot", detail: `${profile} Target ${target}.` });
        actions.push({ title: "Reposition or Dash", detail: "Improve line of sight, protect a mission location, or deny the player a safe route." });
      } else if (ctx.canReachLos) {
        actions.push({ title: "Reposition", detail: "Move to the nearest position with an unobscured target, while screening a route or objective if possible." });
        actions.push({ title: "Shoot", detail: `If a target becomes valid, shoot ${target}.` });
      } else {
        actions.push({ title: "Reposition", detail: "Advance toward the best firing lane and the area most important to the mission." });
        actions.push({ title: "Dash", detail: "Continue to close off player movement or reach a future firing position." });
      }
    } else {
      if (ctx.missionCritical) {
        if (ctx.validShot) {
          order = "Engage";
          actions.push({ title: "Shoot", detail: `Shoot the enemy operative interacting with the mission objective. ${targetPriorityText(ctx)}` });
          actions.push({ title: "Hold position", detail: "Remain within control range of the objective or access route. Use any remaining action to improve cover." });
        } else if (ctx.canCharge) {
          order = "Engage";
          actions.push({ title: "Charge", detail: "Charge the operative contesting or carrying the mission objective." });
          actions.push({ title: "Fight", detail: "Fight that operative to stop mission progress." });
        } else {
          actions.push({ title: "Reposition", detail: "Move to contest the objective or block the shortest route to it." });
          actions.push({ title: "Guard or Dash", detail: "Guard if available and useful. Otherwise Dash into a stronger denial position." });
        }
      } else if (ctx.validShot) {
        order = "Engage";
        actions.push({ title: "Shoot", detail: `Shoot ${target}.` });
        actions.push({ title: "Reposition", detail: "Move toward the nearest objective or chokepoint while retaining cover." });
      } else {
        actions.push({ title: "Reposition", detail: "Move to defend the closest mission location or block a player route." });
        actions.push({ title: "Guard or Dash", detail: "Guard if the rules and position permit. Otherwise Dash to improve control." });
      }
    }

    if (!actions.length) {
      actions.push({ title: "Pass", detail: "No legal behavior action is available. Expend the NPO." });
    }

    return {
      npoId: npo.id,
      name: npo.name,
      type: npo.type,
      behavior: BEHAVIOR_LABELS[npo.behavior] || npo.behavior,
      order,
      actions: actions.slice(0, 3),
      rationale: buildRationale(npo, ctx)
    };
  }

  function chooseTargetText(ctx) {
    if (ctx.missionCritical && ctx.targetWounded) return "the wounded enemy operative most important to the mission";
    if (ctx.missionCritical) return "the enemy operative most important to the mission";
    if (ctx.targetWounded) return "the wounded enemy operative most likely to be incapacitated";
    if (ctx.cover === "open") return "the closest exposed enemy operative";
    if (ctx.cover === "obscured") return "the closest valid enemy operative that is least obscured";
    return "the closest valid enemy operative, preferring one not in cover";
  }

  function targetPriorityText(ctx) {
    const parts = [];
    if (ctx.targetWounded) parts.push("prefer the wounded target");
    if (ctx.cover === "open") parts.push("prefer the exposed target");
    if (ctx.distance === "close") parts.push("prefer the closest target");
    return parts.length ? `When tied, ${parts.join(", then ")}.` : "Use the threat principle to break ties.";
  }

  function buildRationale(npo, ctx) {
    const reasons = [];
    if (ctx.engaged) reasons.push("an enemy operative is already within control range");
    if (ctx.validShot) reasons.push("a legal shot is available");
    if (ctx.missionCritical) reasons.push("an enemy operative is threatening the mission objective");
    if (ctx.targetWounded) reasons.push("a wounded target can be finished off");
    if (!reasons.length) reasons.push("the NPO must improve its position for a future attack");
    return `${npo.name} was selected because ${reasons.join(" and ")}. Resolve any true tie in the way that is worst for the player.`;
  }

  function resolveStrategyPhase() {
    captureSnapshot();
    const grade = threatGrade(state.threat);
    const afterFirst = state.turn > 1;
    const messages = [];

    if (afterFirst && grade === 3) {
      const drawCount = state.threat === 15 ? 2 : 1;
      for (let i = 0; i < drawCount; i += 1) {
        const event = applyEvent(randomItem(EVENTS), false);
        messages.push(event.name);
      }
    }

    if (afterFirst && grade > 0) {
      const availableSlots = Math.max(0, 10 - state.npos.filter(n => n.wounds > 0).length);
      const count = Math.min(grade, availableSlots);
      for (let i = 0; i < count; i += 1) spawnRandomNecron();
      if (count) messages.push(`${count} reinforcement${count === 1 ? "" : "s"}`);
    }

    if (!messages.length) {
      addLog(`Strategy phase resolved at threat grade ${grade}. No automatic event or reinforcement was required.`);
    } else {
      addLog(`Strategy phase resolved: ${messages.join(", ")}.`);
    }
    saveAndRender();
  }

  function startNextTurn() {
    state.turn += 1;
    state.npos.forEach(n => {
      if (n.wounds > 0) n.ready = state.threat > 0;
    });
    state.event = null;
    state.lastActivation = null;
    addLog(`Turning Point ${state.turn} started. All surviving NPOs are ready.`);
    saveAndRender();
  }

  function drawRandomEvent() {
    const event = applyEvent(randomItem(EVENTS), true);
    addLog(event.log);
    saveAndRender();
  }

  function applyEvent(event, showAsCurrent = true) {
    const applied = { ...event };
    if (event.threat) setThreat(state.threat + event.threat, false);

    if (event.spawn) {
      const activeCount = state.npos.filter(n => n.wounds > 0).length;
      if (activeCount < 10) addNpoFromType(event.spawn, true);
    }

    if (event.spawnOrHeal) {
      const wounded = state.npos.find(n => n.type === event.spawnOrHeal && n.wounds > 0 && n.wounds < n.maxWounds);
      if (wounded) {
        wounded.wounds = wounded.maxWounds;
      } else if (state.npos.filter(n => n.wounds > 0).length < 10) {
        addNpoFromType(event.spawnOrHeal, true);
      }
    }

    if (event.healAll) {
      state.npos.forEach(n => {
        if (n.wounds > 0 && n.wounds < n.maxWounds) {
          n.wounds = Math.min(n.maxWounds, n.wounds + randomInt(3, 5));
        }
      });
    }

    if (showAsCurrent) state.event = applied;
    else state.event = applied;
    return applied;
  }

  function randomMission() {
    let next = randomItem(MISSIONS);
    if (MISSIONS.length > 1 && next.id === state.missionId) {
      next = MISSIONS[(MISSIONS.findIndex(m => m.id === next.id) + 1) % MISSIONS.length];
    }
    state.missionId = next.id;
    addLog(`Random mission selected: ${next.name}.`);
    saveAndRender();
  }

  function generateNecronRoster() {
    const count = randomInt(5, 9);
    state.npos = [];
    for (let i = 0; i < count; i += 1) spawnRandomNecron(false);
    state.lastActivation = null;
    addLog(`Generated a ${count}-operative Tomb World roster using a 2D6-style distribution.`);
    saveAndRender();
  }

  function spawnRandomNecron(logIt = true) {
    const roll = randomInt(1, 6) + randomInt(1, 6);
    let type;
    if (roll <= 3) type = "Canoptek Scarab Swarm";
    else if (roll <= 6) type = "Canoptek Macrocyte";
    else if (roll <= 10) type = "Necron Warrior";
    else type = "Canoptek Tomb Crawler";
    const npo = addNpoFromType(type, false);
    if (logIt) addLog(`${npo.name} phased into the killzone as a reinforcement.`);
    return npo;
  }

  function addNpoFromType(type, ready = true) {
    const sameTypeCount = state.npos.filter(n => n.type === type).length + 1;
    const baseName = type.replace("Canoptek ", "");
    const npo = makeNpo(`${baseName} ${sameTypeCount}`, type);
    npo.ready = ready;
    state.npos.push(npo);
    return npo;
  }

  function handleNpoAction(id, action) {
    const npo = state.npos.find(n => n.id === id);
    if (!npo) return;

    switch (action) {
      case "damage":
        npo.wounds = Math.max(0, npo.wounds - 1);
        if (npo.wounds === 0) npo.ready = false;
        break;
      case "heal":
        npo.wounds = Math.min(npo.maxWounds, npo.wounds + 1);
        break;
      case "full-heal":
        npo.wounds = npo.maxWounds;
        break;
      case "toggle-ready":
        if (npo.wounds > 0) npo.ready = !npo.ready;
        break;
      case "incapacitate":
        npo.wounds = 0;
        npo.ready = false;
        addLog(`${npo.name} was incapacitated.`);
        break;
      case "resolve-attack":
        openAttackDialog(npo);
        return;
      case "edit":
        openNpoDialog(npo);
        return;
      case "duplicate": {
        const copy = cloneNpo(npo);
        copy.id = uid();
        copy.name = `${npo.name} copy`;
        copy.ready = true;
        state.npos.push(copy);
        break;
      }
      case "delete":
        state.npos = state.npos.filter(n => n.id !== id);
        addLog(`${npo.name} was deleted from the roster.`);
        break;
      default:
        return;
    }
    saveAndRender();
  }

  function openNpoDialog(npo = null) {
    if (npo) {
      els.dialogTitle.textContent = "Edit NPO";
      els.editNpoId.value = npo.id;
      els.npoName.value = npo.name;
      els.npoType.value = NPO_TEMPLATES[npo.type] ? npo.type : "Custom NPO";
      els.npoBehavior.value = npo.behavior;
      els.npoMaxWounds.value = npo.maxWounds;
      els.npoWounds.value = npo.wounds;
      els.npoWeapon.value = npo.weapon || "";
      els.npoAttackDice.value = npo.attackDice || 4;
      els.npoHit.value = npo.hit || 4;
      els.npoNormalDamage.value = npo.normalDamage || 3;
      els.npoCritDamage.value = npo.critDamage || 4;
    } else {
      els.dialogTitle.textContent = "Add NPO";
      els.editNpoId.value = "";
      els.npoName.value = `Necron Warrior ${state.npos.filter(n => n.type === "Necron Warrior").length + 1}`;
      els.npoType.value = "Necron Warrior";
      applyTemplateToDialog();
    }
    els.npoDialog.showModal();
  }

  function applyTemplateToDialog() {
    const template = NPO_TEMPLATES[els.npoType.value] || NPO_TEMPLATES["Custom NPO"];
    els.npoBehavior.value = template.behavior;
    els.npoMaxWounds.value = template.maxWounds;
    els.npoWounds.value = template.maxWounds;
    els.npoWeapon.value = template.weapon;
    els.npoAttackDice.value = template.attackDice || 4;
    els.npoHit.value = template.hit || 4;
    els.npoNormalDamage.value = template.normalDamage || 3;
    els.npoCritDamage.value = template.critDamage || 4;
  }

  function saveNpoFromDialog(event) {
    event.preventDefault();
    if (event.submitter?.value === "cancel") {
      els.npoDialog.close();
      return;
    }
    const maxWounds = Math.max(1, Number(els.npoMaxWounds.value));
    const wounds = Math.max(0, Math.min(maxWounds, Number(els.npoWounds.value)));
    const template = NPO_TEMPLATES[els.npoType.value] || NPO_TEMPLATES["Custom NPO"];
    const existing = state.npos.find(n => n.id === els.editNpoId.value);
    const data = {
      name: els.npoName.value.trim(),
      type: els.npoType.value,
      behavior: els.npoBehavior.value,
      maxWounds,
      wounds,
      weapon: els.npoWeapon.value.trim(),
      move: template.move,
      save: template.save,
      attackDice: Math.max(1, Number(els.npoAttackDice.value || 4)),
      hit: Math.max(2, Math.min(6, Number(els.npoHit.value || 4))),
      normalDamage: Math.max(1, Number(els.npoNormalDamage.value || 3)),
      critDamage: Math.max(1, Number(els.npoCritDamage.value || 4))
    };

    if (existing) Object.assign(existing, data);
    else state.npos.push({ id: uid(), ready: wounds > 0, activations: 0, ...data });

    els.npoDialog.close();
    addLog(`${data.name} ${existing ? "updated" : "added"}.`);
    saveAndRender();
  }

  function openAttackDialog(npo) {
    pendingEnemyAttack = null;
    els.attackTargetId.value = npo.id;
    els.attackDialogTitle.textContent = `Attack ${npo.name}`;
    els.attackTargetStatus.innerHTML = `<strong>${escapeHtml(npo.name)}</strong><span>${npo.wounds} / ${npo.maxWounds} wounds · Save ${escapeHtml(npo.save || "4+")}</span>`;
    byId("enemyAttackType").value = "shoot";
    byId("playerNormalHits").value = 0;
    byId("playerCritHits").value = 0;
    byId("playerNormalDamage").value = 3;
    byId("playerCritDamage").value = 4;
    byId("defenceDice").value = 3;
    byId("attackAp").value = 0;
    byId("retainCoverSave").checked = false;
    els.combatResultPreview.innerHTML = `<p class="muted">Enter the enemy attack result, then roll the NPO's saves.</p>`;
    els.resolveAttackBtn.disabled = false;
    els.resolveAttackBtn.textContent = "Roll Saves & Preview Damage";
    els.resolveAttackBtn.dataset.phase = "roll";
    els.attackDialog.showModal();
  }

  function handleNumberStepper(event) {
    const button = event.target.closest("[data-step-target]");
    if (!button) return;
    const input = byId(button.dataset.stepTarget);
    if (!input) return;

    const min = input.min === "" ? Number.NEGATIVE_INFINITY : Number(input.min);
    const max = input.max === "" ? Number.POSITIVE_INFINITY : Number(input.max);
    const step = Number(button.dataset.step || input.step || 1);
    const current = Number.isFinite(Number(input.value)) ? Number(input.value) : Math.max(0, min);
    input.value = String(Math.min(max, Math.max(min, current + step)));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function clampNumberInput(event) {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || input.type !== "number") return;
    const min = input.min === "" ? Number.NEGATIVE_INFINITY : Number(input.min);
    const max = input.max === "" ? Number.POSITIVE_INFINITY : Number(input.max);
    const fallback = Number.isFinite(min) ? min : 0;
    const value = Number.isFinite(Number(input.value)) ? Number(input.value) : fallback;
    input.value = String(Math.min(max, Math.max(min, value)));
  }

  function resolvePlayerAttack(event) {
    event.preventDefault();
    if (event.submitter?.value === "cancel") {
      pendingEnemyAttack = null;
      els.attackDialog.close();
      return;
    }

    if (els.resolveAttackBtn.dataset.phase === "confirm") {
      const pending = pendingEnemyAttack;
      const npo = pending ? state.npos.find(n => n.id === pending.npoId) : null;
      if (!pending || !npo) {
        pendingEnemyAttack = null;
        els.attackDialog.close();
        return;
      }

      npo.wounds = pending.afterWounds;
      if (npo.wounds === 0) npo.ready = false;
      if (pending.threatIncrease > 0) increaseThreat(pending.threatIncrease, pending.threatReason, false);
      addLog(`${npo.name} rolled ${pending.criticalSaves} critical and ${pending.normalSaves} normal saves, suffered ${pending.damage} damage, and fell from ${pending.beforeWounds} to ${npo.wounds} wounds.${pending.threatIncrease ? ` Threat +${pending.threatIncrease}.` : ""}`);
      pendingEnemyAttack = null;
      els.attackDialog.close();
      saveAndRender();
      return;
    }

    const npo = state.npos.find(n => n.id === els.attackTargetId.value);
    if (!npo || npo.wounds <= 0) return;

    const attackType = byId("enemyAttackType").value;
    const normalHits = Math.max(0, Number(byId("playerNormalHits").value || 0));
    const critHits = Math.max(0, Number(byId("playerCritHits").value || 0));
    const normalDamage = Math.max(1, Number(byId("playerNormalDamage").value || 1));
    const critDamage = Math.max(1, Number(byId("playerCritDamage").value || 1));
    const defenceDice = Math.max(0, Number(byId("defenceDice").value || 0));
    const ap = Math.max(0, Number(byId("attackAp").value || 0));
    const availableDefenceDice = Math.max(0, defenceDice - ap);
    const coverRetained = byId("retainCoverSave").checked && availableDefenceDice > 0 ? 1 : 0;
    const rolledDice = Math.max(0, availableDefenceDice - coverRetained);
    const saveTarget = parseSaveTarget(npo.save);
    const saves = Array.from({ length: rolledDice }, () => {
      const value = randomInt(1, 6);
      if (value === 6) return { value, kind: "critical", label: "Critical save" };
      if (value >= saveTarget) return { value, kind: "hit", label: "Normal save" };
      return { value, kind: "miss", label: "Failed save" };
    });
    const criticalSaves = saves.filter(d => d.kind === "critical").length;
    const normalSaves = saves.filter(d => d.kind === "hit").length + coverRetained;
    const outcome = calculateOptimalDamage({ normalHits, critHits, normalDamage, critDamage, normalSaves, criticalSaves });
    const before = npo.wounds;
    const after = Math.max(0, before - outcome.damage);

    pendingEnemyAttack = {
      npoId: npo.id,
      beforeWounds: before,
      afterWounds: after,
      damage: outcome.damage,
      criticalSaves,
      normalSaves,
      threatIncrease: attackThreatIncrease(attackType, outcome.damage),
      threatReason: attackThreatReason(attackType, npo.name)
    };

    const displayDice = [...saves];
    if (coverRetained) displayDice.push({ value: "C", kind: "cover", label: "Retained cover save" });
    els.combatResultPreview.innerHTML = `
      <div class="combat-result-head">
        <div><span class="event-tag">SAVE ROLL</span><h3>${escapeHtml(npo.name)}</h3></div>
        <strong class="damage-total">${outcome.damage} damage</strong>
      </div>
      <div class="save-roll-visual">
        <p class="eyebrow">NPO SAVE DICE</p>
        <div class="dice-tray save-dice" aria-label="NPO save dice results">
          ${displayDice.length ? renderDice(displayDice) : '<span class="no-dice-result">No save dice rolled</span>'}
        </div>
      </div>
      <div class="combat-breakdown">
        <span>${criticalSaves} critical save${criticalSaves === 1 ? "" : "s"}</span>
        <span>${normalSaves} normal save${normalSaves === 1 ? "" : "s"}${coverRetained ? " including cover" : ""}</span>
        <span>${outcome.remainingCrits} critical and ${outcome.remainingNormals} normal hit${outcome.remainingNormals === 1 ? "" : "s"} get through</span>
      </div>
      <div class="wound-change ${after === 0 ? "killed" : ""}">
        <strong>${before} → ${after} wounds</strong>
        <span>${after === 0 ? "NPO will be incapacitated" : `${after} wounds will remain`}</span>
      </div>
      <p class="form-note">Damage is only applied after you select Confirm Damage. Cancel leaves the NPO unchanged.${pendingEnemyAttack.threatIncrease ? ` Confirming will also increase Threat by ${pendingEnemyAttack.threatIncrease}.` : ""}</p>`;

    els.resolveAttackBtn.disabled = false;
    els.resolveAttackBtn.textContent = "Confirm Damage";
    els.resolveAttackBtn.dataset.phase = "confirm";
  }

  function calculateOptimalDamage({ normalHits, critHits, normalDamage, critDamage, normalSaves, criticalSaves }) {
    let best = null;
    for (let critSavesOnCrit = 0; critSavesOnCrit <= Math.min(criticalSaves, critHits); critSavesOnCrit += 1) {
      const critSavesLeft = criticalSaves - critSavesOnCrit;
      for (let critSavesOnNormal = 0; critSavesOnNormal <= Math.min(critSavesLeft, normalHits); critSavesOnNormal += 1) {
        const critsAfterCriticalSaves = critHits - critSavesOnCrit;
        const normalsAfterCriticalSaves = normalHits - critSavesOnNormal;
        for (let normalPairsOnCrit = 0; normalPairsOnCrit <= Math.min(Math.floor(normalSaves / 2), critsAfterCriticalSaves); normalPairsOnCrit += 1) {
          const normalSavesLeft = normalSaves - normalPairsOnCrit * 2;
          const remainingCrits = critsAfterCriticalSaves - normalPairsOnCrit;
          const remainingNormals = Math.max(0, normalsAfterCriticalSaves - normalSavesLeft);
          const damage = remainingCrits * critDamage + remainingNormals * normalDamage;
          const candidate = { damage, remainingCrits, remainingNormals };
          if (!best || candidate.damage < best.damage || (candidate.damage === best.damage && candidate.remainingCrits < best.remainingCrits)) best = candidate;
        }
      }
    }
    return best || { damage: critHits * critDamage + normalHits * normalDamage, remainingCrits: critHits, remainingNormals: normalHits };
  }

  function parseSaveTarget(save) {
    const value = Number.parseInt(String(save || "4+"), 10);
    return Number.isFinite(value) ? Math.max(2, Math.min(6, value)) : 4;
  }

  function updateMissionProgress(delta) {
    const mission = currentMission();
    const current = Number(state.missionProgress[mission.id] || 0);
    state.missionProgress[mission.id] = Math.max(0, Math.min(mission.trackerMax, current + delta));
    saveAndRender();
  }

  function clearSnapshot() {
    state.snapshot = {
      engaged: false,
      validShot: false,
      canCharge: false,
      canReachLos: false,
      doorBlocked: false,
      targetsClustered: false,
      missionCritical: false,
      targetWounded: false,
      distance: "medium",
      cover: "cover"
    };
    syncSnapshotControls();
    saveState();
  }

  function syncSnapshotControls() {
    const mapping = {
      ctxEngaged: "engaged",
      ctxValidShot: "validShot",
      ctxCanCharge: "canCharge",
      ctxCanReachLos: "canReachLos",
      ctxDoorBlocked: "doorBlocked",
      ctxTargetsClustered: "targetsClustered",
      ctxMissionCritical: "missionCritical",
      ctxTargetWounded: "targetWounded",
      ctxDistance: "distance",
      ctxCover: "cover"
    };
    Object.entries(mapping).forEach(([id, key]) => {
      const el = byId(id);
      if (el.type === "checkbox") el.checked = Boolean(state.snapshot[key]);
      else el.value = state.snapshot[key];
    });
  }

  function captureSnapshot() {
    state.snapshot = {
      engaged: byId("ctxEngaged").checked,
      validShot: byId("ctxValidShot").checked,
      canCharge: byId("ctxCanCharge").checked,
      canReachLos: byId("ctxCanReachLos").checked,
      doorBlocked: byId("ctxDoorBlocked").checked,
      targetsClustered: byId("ctxTargetsClustered").checked,
      missionCritical: byId("ctxMissionCritical").checked,
      targetWounded: byId("ctxTargetWounded").checked,
      distance: byId("ctxDistance").value,
      cover: byId("ctxCover").value
    };
  }

  function increaseThreat(amount, reason, render = true) {
    const before = state.threat;
    state.threat = Math.max(0, Math.min(15, before + Number(amount || 0)));
    applyThreatReadiness(before, state.threat);
    const actual = state.threat - before;
    if (actual > 0) addLog(`Threat ${before} → ${state.threat}: ${reason}.`);
    if (render) saveAndRender();
    return actual;
  }

  function recordOperateHatch() {
    const roll = randomInt(1, 6);
    const increased = roll >= 4 ? increaseThreat(1, `Enemy operative used Operate Hatch and rolled ${roll}`, false) : 0;
    if (!increased) addLog(`Enemy operative used Operate Hatch and rolled ${roll}. Threat did not increase.`);
    saveAndRender();
  }

  function recordBreach() {
    const roll = randomInt(1, 6);
    const amount = 1 + (roll >= 4 ? 1 : 0);
    const actual = increaseThreat(amount, `Enemy operative used Breach and rolled ${roll}`, false);
    if (actual < amount) addLog(`Threat is already at its maximum; only ${actual} of the ${amount} increase was applied.`);
    saveAndRender();
  }

  function attackThreatIncrease(type, damage) {
    if (type === "shoot") return 1;
    if (type === "fight") return 1;
    if (type === "other" && damage > 0) return 1;
    return 0;
  }

  function attackThreatReason(type, npoName) {
    if (type === "shoot") return `Enemy operative performed a non-Silent Shoot action against ${npoName}`;
    if (type === "fight") return `Enemy operative performed a Fight action against ${npoName}`;
    if (type === "other") return `Enemy operative used another action that damaged ${npoName}`;
    return `Enemy operative used a Silent weapon against ${npoName}`;
  }

  function threatStatusText(level) {
    const grade = threatGrade(level);
    const next = grade === 0 ? 1 : grade === 1 ? 6 : grade === 2 ? 11 : null;
    const reinforcement = grade === 0 ? "No reinforcements" : `${grade} reinforcement${grade === 1 ? "" : "s"} after the first turning point`;
    const events = grade === 3 ? "Tomb World events are active" : "No automatic event cards";
    if (level === 0) return "Dormant. NPOs cannot be readied until Threat rises above 0.";
    const nextText = next ? ` Next grade at ${next} (${next - level} Threat away).` : " Maximum response grade.";
    return `${reinforcement}. ${events}.${nextText}`;
  }

  function applyThreatReadiness(before, after) {
    if (after === 0) {
      state.npos.forEach(npo => { if (npo.wounds > 0) npo.ready = false; });
      state.nextNpoId = null;
    } else if (before === 0 && after > 0) {
      state.npos.forEach(npo => { if (npo.wounds > 0) npo.ready = true; });
    }
  }

  function setThreat(value, render = true) {
    const before = state.threat;
    state.threat = Math.max(0, Math.min(15, Number(value)));
    applyThreatReadiness(before, state.threat);
    if (render) saveAndRender();
  }

  function threatGrade(level) {
    if (level >= 11) return 3;
    if (level >= 6) return 2;
    if (level >= 1) return 1;
    return 0;
  }

  function currentMission() {
    return MISSIONS.find(m => m.id === state.missionId) || MISSIONS[0];
  }

  function resetSession() {
    const confirmed = window.confirm("Reset the full session, roster, mission progress, and activity log?");
    if (!confirmed) return;
    state = defaultState();
    syncSnapshotControls();
    saveAndRender();
  }

  function exportSave() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tomb-world-solo-turn-${state.turn}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function importSave(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      state = normalizeState(parsed);
      syncSnapshotControls();
      addLog("Saved session imported.");
      saveAndRender();
    } catch (error) {
      window.alert("That file could not be imported as a Tomb World Solo Command save.");
      console.error(error);
    } finally {
      event.target.value = "";
    }
  }

  function addLog(text) {
    state.log.unshift({
      time: `TP ${state.turn} · ${new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`,
      text
    });
    state.log = state.log.slice(0, 80);
  }

  function saveAndRender() {
    applyThreatReadiness(state.threat, state.threat);
    ensureNextNpo();
    saveState();
    renderAll();
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn("Could not save state", error);
    }
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      return normalizeState(JSON.parse(raw));
    } catch (error) {
      console.warn("Could not load saved state", error);
      return defaultState();
    }
  }

  function normalizeState(candidate) {
    const base = defaultState();
    if (!candidate || typeof candidate !== "object") return base;
    return {
      ...base,
      ...candidate,
      snapshot: { ...base.snapshot, ...(candidate.snapshot || {}) },
      missionProgress: { ...base.missionProgress, ...(candidate.missionProgress || {}) },
      npos: Array.isArray(candidate.npos) ? candidate.npos.map(n => ({
        id: n.id || uid(),
        name: n.name || "Unnamed NPO",
        type: n.type || "Custom NPO",
        behavior: n.behavior || "guardian",
        maxWounds: Math.max(1, Number(n.maxWounds || 1)),
        wounds: Math.max(0, Number(n.wounds ?? n.maxWounds ?? 1)),
        weapon: n.weapon || "",
        ready: Boolean(n.ready),
        move: n.move || NPO_TEMPLATES[n.type]?.move || 6,
        save: n.save || NPO_TEMPLATES[n.type]?.save || "4+",
        attackDice: Math.max(1, Number(n.attackDice || NPO_TEMPLATES[n.type]?.attackDice || 4)),
        hit: Math.max(2, Math.min(6, Number(n.hit || NPO_TEMPLATES[n.type]?.hit || 4))),
        normalDamage: Math.max(1, Number(n.normalDamage || NPO_TEMPLATES[n.type]?.normalDamage || 3)),
        critDamage: Math.max(1, Number(n.critDamage || NPO_TEMPLATES[n.type]?.critDamage || 4)),
        activations: Number(n.activations || 0)
      })) : base.npos,
      log: Array.isArray(candidate.log) ? candidate.log : [],
      nextNpoId: typeof candidate.nextNpoId === "string" ? candidate.nextNpoId : null,
      threat: Math.max(0, Math.min(15, Number(candidate.threat || 0))),
      turn: Math.max(1, Number(candidate.turn || 1)),
      missionId: MISSIONS.some(m => m.id === candidate.missionId) ? candidate.missionId : base.missionId
    };
  }

  function makeNpo(name, type) {
    const template = NPO_TEMPLATES[type] || NPO_TEMPLATES["Custom NPO"];
    return {
      id: uid(),
      name,
      type,
      behavior: template.behavior,
      maxWounds: template.maxWounds,
      wounds: template.maxWounds,
      weapon: template.weapon,
      move: template.move,
      save: template.save,
      attackDice: template.attackDice || 4,
      hit: template.hit || 4,
      normalDamage: template.normalDamage || 3,
      critDamage: template.critDamage || 4,
      ready: true,
      activations: 0
    };
  }

  function cloneNpo(npo) {
    return JSON.parse(JSON.stringify(npo));
  }

  function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function uid() {
    if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
    return `npo-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
})();
