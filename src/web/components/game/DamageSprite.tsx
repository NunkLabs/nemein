import { useTick } from "@pixi/react";
import { TextStyle } from "pixi.js";
import { useMemo, useRef, useState } from "react";

interface TextProperties {
  alpha: number;
  scale: number;
}

/* Timer multiplier to control the speed of the animation */
const ANIMATION_TIMER_MULTIPLIER = 3;

/* Max animation duration in seconds */
const ANIMATION_DURATION_S = 3;

/* Anchor value to set the origin point of the sprite */
const SPRITE_ANCHOR = 0.5;

/* Offsets values for the damage number position */
const DAMAGE_NUMBER_X_OFFSET = -50;
const DAMAGE_NUMBER_Y_OFFSET = 0;

/* Float values for max scale */
const DAMAGE_NUMBER_MAX_SCALE = 0.1;
const DAMAGE_NUMBER_CRIT_SCALE = 0.15;

/* Sprite render delay in milliseconds */
const BASE_RENDER_DELAY_MS = 100;

export default function DamageSprite({
  dmgDealt,
  dmgIndex,
  wasCrit,
  color,
  x,
  y,
}: {
  dmgDealt: string;
  dmgIndex: number;
  wasCrit: boolean;
  color: number;
  x: number;
  y: number;
}) {
  const time = useRef<number>(0);
  const progress = useRef<number>(0);

  /* Memoizes the base properties */
  const baseProperties = useMemo(
    () => ({
      renderDelay: BASE_RENDER_DELAY_MS * dmgIndex,
      scale: DAMAGE_NUMBER_MAX_SCALE + (wasCrit ? DAMAGE_NUMBER_CRIT_SCALE : 0),
      x: DAMAGE_NUMBER_X_OFFSET + x,
      y: DAMAGE_NUMBER_Y_OFFSET + y,
    }),
    [dmgIndex, wasCrit, x, y]
  );

  const [textProperties, setTextProperties] = useState<TextProperties>({
    alpha: 1,
    scale: 1,
  });

  const textStyle = useMemo(
    () =>
      new TextStyle({
        align: "center",
        fill: color,
        fontSize: 35,
        fontWeight: "bold",
      }),
    [color]
  );

  /**
   * The animation progressing logic is the same as ClearedBlock
   * {@see ClearedBlock}
   */
  useTick((ticker) => {
    const renderTimeout = setTimeout(() => {
      if (time.current > ANIMATION_DURATION_S) {
        setTextProperties({
          alpha: 0,
          scale: 1,
        });

        clearTimeout(renderTimeout);

        return;
      }

      progress.current = time.current / ANIMATION_DURATION_S;

      setTextProperties({
        alpha: 1 - progress.current,
        scale: 1 + progress.current * baseProperties.scale,
      });

      time.current += ticker.deltaMS * 0.001 * ANIMATION_TIMER_MULTIPLIER;
    }, baseProperties.renderDelay);
  });

  return (
    <pixiText
      alpha={textProperties.alpha}
      anchor={SPRITE_ANCHOR}
      scale={textProperties.scale}
      style={textStyle}
      text={dmgDealt}
      x={baseProperties.x}
      y={baseProperties.y}
    />
  );
}
