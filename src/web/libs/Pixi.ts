import "pixi.js/app";
import "pixi.js/graphics";
import "pixi.js/text";
import { extend } from "@pixi/react";
import {
  Assets,
  Container,
  Graphics,
  Sprite,
  Text,
  type Texture,
} from "pixi.js";

/* Registers the Pixi classes the game renders as pixi-prefixed intrinsics */
extend({
  Container,
  Graphics,
  Sprite,
  Text,
});

/* Textures the game sprites render with */
export interface GameTextures {
  blank: Texture;
}

const BLANK_TEXTURE_URL = "/textures/blank.svg";

/**
 * @brief: loadGameTextures: Loads every texture the game needs. Pixi 8 has no
 * synchronous URL loading, so sprites wait on this instead of Texture.from
 * @return: {Promise<GameTextures>}   The ready textures, cached by Assets
 */
export async function loadGameTextures(): Promise<GameTextures> {
  return { blank: await Assets.load<Texture>(BLANK_TEXTURE_URL) };
}
