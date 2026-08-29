import { Graphics, type PixiRef } from "@pixi/react";
import { useGameStore } from "libs/Store";
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
    (panelGraphics: PixiRef<typeof Graphics>) => {
      panelGraphics.clear();

      panelGraphics.lineStyle({
        alignment: BORDER_STYLE.ALIGNMENT,
        color:
          gameTheme === "light"
            ? BASE_STYLE.LIGHT.PRIMARY
            : BASE_STYLE.DARK.PRIMARY,
        width: BORDER_STYLE.WIDTH,
      });

      panelGraphics.drawRect(
        HOLD_PANEL.X,
        HOLD_PANEL.Y,
        HOLD_PANEL.WIDTH,
        HOLD_PANEL.HEIGHT
      );

      panelGraphics.drawRect(
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
        panelGraphics.drawRect(
          QUEUE_PANEL.X,
          queuePanelYCoord,
          QUEUE_PANEL.WIDTH,
          QUEUE_PANEL.HEIGHT
        );
      }
    },
    [gameTheme]
  );

  return <Graphics draw={draw} />;
}
