export const RACES = {
  1: 'Beast',
  2: 'Bird',
  3: 'Aquatic',
  4: 'Demon',
  5: 'Human',
  6: 'Machine',
  7: 'Dragon',
  8: 'Fairy',
  9: 'Insect',
  10: 'Stone',
  11: 'Plant',
  12: 'Reaper',
} as const satisfies Record<number, string>

export const SEXES = {
  0: 'other',
  1: 'male',
  2: 'female',
} as const satisfies Record<number, string>

export const ROLES = {
  1: 'physical attacker',
  2: 'magic attacker',
  3: 'physical tank',
  4: 'magic tank',
  5: 'healer',
  6: 'support',
  7: 'breaker',
  8: 'versatile',
  9: 'EXP',
  10: 'Gil',
  11: 'TMR',
  12: 'stat pot',
  13: 'door pot',
} as const satisfies Record<number, string>

export const ACTIVE_STATS = {
  1: 'atk',
  2: 'def',
  3: 'mag',
  4: 'spr',
  5: 'stop',
  6: 'charm',
  7: 'berserk',
  8: 'imperils',
} as const satisfies Record<number, string>

export const PASSIVE_STATS = {
  1: 'atk',
  2: 'def',
  3: 'mag',
  4: 'spr',
  5: 'hp',
  6: 'mp',
  7: 'crit chance',
} as const satisfies Record<number, string>

export const NEW_PASSIVE_STATS = {
  1: 'hp',
  2: 'mp',
  3: 'atk',
  4: 'mag',
  5: 'def',
  6: 'spr',
} as const satisfies Record<number, string>

export const ELEMENTS = {
  1: 'fire',
  2: 'ice',
  3: 'lightning',
  4: 'water',
  5: 'wind',
  6: 'earth',
  7: 'light',
  8: 'dark',
} as const satisfies Record<number, string>

export const STATUS = {
  1: 'poison',
  2: 'blind',
  3: 'sleep',
  4: 'silence',
  5: 'paralysis',
  6: 'confuse',
  7: 'dicease',
  8: 'stone',
} as const satisfies Record<number, string>

export const DAMAGE_TYPE = {
  1: 'physical',
  2: 'magic',
  3: 'hybrid',
  4: 'fixed',
} as const satisfies Record<number, string>

export const EQUIPMENTS = {
  1: 'dagger',
  2: 'sword',
  3: 'great sword',
  4: 'katana',
  5: 'staff',
  6: 'rod',
  7: 'bow',
  8: 'axe',
  9: 'hammer',
  10: 'spear',
  11: 'instrument',
  12: 'whip',
  13: 'throwing',
  14: 'gun',
  15: 'mace',
  16: 'fist',
  30: 'light shield',
  31: 'heavy shield',
  40: 'hat',
  41: 'helm',
  50: 'clothes',
  51: 'light armor',
  52: 'heavy armor',
  53: 'robe',
} as const satisfies Record<number, string>

export const MAGIC_TYPE = {
  0: 'any',
  1: 'black',
  2: 'white',
  3: 'green',
  4: 'blue',
} as const satisfies Record<number, string>

export const ESPERS = {
  1: 'siren',
  2: 'ifrit',
  3: 'shiva',
  4: 'carbuncle',
  5: 'diabolos',
  6: 'golem',
  7: 'ramuh',
  8: 'titan',
  9: 'tetra sylphid',
  10: 'odin',
  11: 'lakshmi',
  12: 'leviathan',
  13: 'alexander',
  14: 'phoenix',
  15: 'bahamut',
  16: 'fenrir',
  17: 'anima',
  18: 'asura',
  19: 'kokuryu',
} as const satisfies Record<number, string>

export const ACTIVE_EFFECTS = {
  1: 'physical damage',
  2: 'heal hp',
  8: 'heal hp hot',
  10: 'attack with mp drain',
  13: 'physical damage after delay',
  15: 'magic damage',
  21: 'physical damage with ignore def',
  22: 'physical damage to race',
  23: 'magic damage to race',
  25: 'attack with hp drain',
  40: 'hybrid damage',
  41: 'fixed damage',
  42: 'multiple attacks',
  43: 'critic attack',
  52: 'jump (not timed)',
  56: 'heal hp hot while singing',
  57: 'heal mp hot while singing',
  70: 'magic damage with ignore spr',
  72: 'magic damage with stacks',
  81: 'sacrifice hp to deal damage',
  102: 'physical damage with def scaling',
  103: 'magic damage with spr scaling',
  112: 'cast death or deal magic damage (ignore or not)',
  113: 'cast death or deal physical damage (ignore or not)',
  124: 'evoke damage',
  126: 'physical damage with stacks',
  131: 'magic damage while singing',
  134: 'timed jump',
  139: 'physical damage dot',
  159: 'physical damage with break bonus damage',
  169: 'consume all mp to deal magic damage',
  1012: 'fixed damage per negative effects',
  1016: 'morale based damage',
  1024: 'evoke morale based damage',
} as const satisfies Record<number, string>
