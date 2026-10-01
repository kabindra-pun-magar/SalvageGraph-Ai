export const MATERIAL_TYPES = [
    "TILE",
    "BRICK",
    "PIPE",
    "REBAR",
    "TIMBER",
    "CONCRETE",
    "SAND",
    "WOOD",
    "GLASS",
    "OTHER",
] as const;

export type MaterialType = (typeof MATERIAL_TYPES)[number];