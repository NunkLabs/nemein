import { useGameStore } from "libs/Store";
import type { Graphics } from "pixi.js";
import { useCallback } from "react";
import {
  BASE_STYLE,
  BORDER_STYLE,
  GAME_PANEL,
  HOLD_PANEL,
  QUEUE_PANEL,
  STAGE_SIZE,
  STAGE_SPACER,
} from "./Misc";

export default function BorderGraphics() {
  const gameTheme = useGameStore((state) => state.gameTheme);
  const draw = useCallback(
    (panelGraphics: Graphics) => {
      panelGraphics.clear();

      panelGraphics.setStrokeStyle({
        alignment: BORDER_STYLE.ALIGNMENT,
        color:
          gameTheme === "light"
            ? BASE_STYLE.LIGHT.PRIMARY
            : BASE_STYLE.DARK.PRIMARY,
        width: BORDER_STYLE.WIDTH,
      });

      panelGraphics.rect(
        HOLD_PANEL.X,
        HOLD_PANEL.Y,
        HOLD_PANEL.WIDTH,
        HOLD_PANEL.HEIGHT
      );

      panelGraphics.rect(
        GAME_PANEL.X,
        GAME_PANEL.Y,
        GAME_PANEL.WIDTH,
        GAME_PANEL.HEIGHT
      );

      for (
        let queuePanelYCoord = QUEUE_PANEL.Y;
        queuePanelYCoord + QUEUE_PANEL.HEIGHT + STAGE_SPACER < STAGE_SIZE;
        queuePanelYCoord += QUEUE_PANEL.HEIGHT + STAGE_SPACER
      ) {
        panelGraphics.rect(
          QUEUE_PANEL.X,
          queuePanelYCoord,
          QUEUE_PANEL.WIDTH,
          QUEUE_PANEL.HEIGHT
        );
      }

      panelGraphics.stroke();
    },
    [gameTheme]
  );

  return <pixiGraphics draw={draw} />;
}
