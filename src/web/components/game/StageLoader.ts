import type * as StageModule from "./Stage";

let stageModule: Promise<typeof StageModule> | null = null;

/* Deferred until PLAY intent, so the initial route never pulls Pixi in */
export function loadStage(): Promise<typeof StageModule> {
  stageModule ??= import("./Stage").catch((error: unknown) => {
    stageModule = null;

    throw error;
  });

  return stageModule;
}

/* Warms the Stage and renderer payload without mounting anything */
export function preloadStage(): void {
  loadStage().catch(() => {
    /* A warm-up miss is harmless */
  });
}
