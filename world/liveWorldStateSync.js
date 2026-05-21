
export async function syncLiveWorldState({ location = "Virginia", lastState = null } = {}) {
  try {
    const response = await fetch("/api/operating-core/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `sync world state near ${location}`,
        readiness: { ready: true, enabled: ["world_sync"] },
        location
      })
    });

    const data = await response.json();

    return {
      layer: "live_world_state_synchronization",
      ok: true,
      location,
      world: data.world,
      changed: JSON.stringify(data.world) !== JSON.stringify(lastState?.world),
      syncedAt: new Date().toISOString()
    };
  } catch (error) {
    return {
      layer: "live_world_state_synchronization",
      ok: false,
      location,
      error: error.message,
      world: lastState?.world || null,
      changed: false,
      syncedAt: new Date().toISOString()
    };
  }
}

export function createWorldSyncLoop({ location = "Virginia", intervalMs = 60000, onSync } = {}) {
  let stopped = false;
  let lastState = null;

  async function tick() {
    if (stopped) return;
    const state = await syncLiveWorldState({ location, lastState });
    lastState = state;
    onSync?.(state);
    if (!stopped) setTimeout(tick, intervalMs);
  }

  tick();

  return {
    stop() {
      stopped = true;
    }
  };
}
