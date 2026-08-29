/* Base game sizes in pixels */
export const STAGE_SIZE = 720;
export const STAGE_SPACER = 24;

export const HOLD_PANEL = {
  CHILD: 24,
  HEIGHT: 120,
  WIDTH: 120,
  X: 66,
  Y: STAGE_SPACER * 2,
};

export const GAME_PANEL = {
  CHILD: 30,
  HEIGHT: 600,
  WIDTH: 300,
  X: HOLD_PANEL.X + HOLD_PANEL.WIDTH + STAGE_SPACER,
  Y: STAGE_SPACER * 2,
};

export const QUEUE_PANEL = {
  CHILD: 16,
  HEIGHT: 80,
  WIDTH: 80,
  X: GAME_PANEL.X + GAME_PANEL.WIDTH + STAGE_SPACER,
  Y: STAGE_SPACER * 2,
};

export const BASE_STYLE = {
  DARK: {
    ALTERNATE: 0xf3_f4_f6 /* Tailwind Gray 100 */,
    PRIMARY: 0xf9_fa_fb /* Tailwind Gray 50 */,
    SECONDARY: 0x03_07_12 /* Tailwind Gray 950 */,
  },
  LIGHT: {
    ALTERNATE: 0x11_18_27 /* Tailwind Gray 900 */,
    PRIMARY: 0x03_07_12 /* Tailwind Gray 950 */,
    SECONDARY: 0xf9_fa_fb /* Tailwind Gray 50 */,
  },
};

export const BORDER_STYLE = {
  ALIGNMENT: 1,
  WIDTH: 4,
};

export const TETROMINO_STYLES: {
  [theme: string]: {
    [style: string]: number;
  };
} = {
  DARK: {
    Blank: BASE_STYLE.DARK.SECONDARY,
    Ghost: BASE_STYLE.DARK.ALTERNATE,
    Grey: BASE_STYLE.DARK.ALTERNATE,
    I: 0x93_c5_fd,
    J: 0xa5_b4_fc,
    L: 0xfd_ba_74,
    S: 0x86_ef_ac,
    Square: 0xfe_f0_8a,
    T: 0xd8_b4_fe,
    Z: 0xfc_a5_a5,
  },
  LIGHT: {
    Blank: BASE_STYLE.LIGHT.SECONDARY,
    Ghost: BASE_STYLE.LIGHT.ALTERNATE,
    Grey: BASE_STYLE.LIGHT.ALTERNATE,
    I: 0x93_c5_fd,
    J: 0xa5_b4_fc,
    L: 0xfd_ba_74,
    S: 0x86_ef_ac,
    Square: 0xfe_f0_8a,
    T: 0xd8_b4_fe,
    Z: 0xfc_a5_a5,
  },
};

export const DAMAGE_TYPE_STYLES: {
  [theme: string]: {
    [style: string]: number;
  };
} = {
  DARK: {
    Cold: 0x93_c5_fd,
    Fire: 0xfc_a5_a5,
    Lightning: 0xfe_f0_8a,
    Physical: BASE_STYLE.DARK.PRIMARY,
  },
  LIGHT: {
    Cold: 0x93_c5_fd,
    Fire: 0xfc_a5_a5,
    Lightning: 0xfe_f0_8a,
    Physical: BASE_STYLE.LIGHT.PRIMARY,
  },
};

/* Tetrominos coords consts */
export const TETROMINOS_ARR = [
  [
    /* Blank */
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ],
  [
    /* 2x2 square tetromino */
    [0, 0, 0, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ],
  [
    /* I tetromino */
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 2, 2, 2, 2],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ],
  [
    /* T tetromino */
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 3, 0, 0],
    [0, 3, 3, 3, 0],
    [0, 0, 0, 0, 0],
  ],
  [
    /* J tetromino */
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 4, 0],
    [0, 4, 4, 4, 0],
    [0, 0, 0, 0, 0],
  ],
  [
    /* L tetromino */
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 5, 0, 0, 0],
    [0, 5, 5, 5, 0],
    [0, 0, 0, 0, 0],
  ],
  [
    /* Z tetromino */
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 6, 6, 0],
    [0, 6, 6, 0, 0],
    [0, 0, 0, 0, 0],
  ],
  [
    /* S tetromino */
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 7, 7, 0, 0],
    [0, 0, 7, 7, 0],
    [0, 0, 0, 0, 0],
  ],
];
