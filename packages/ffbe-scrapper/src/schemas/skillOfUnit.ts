import { z } from 'zod'

import { VARIABLES } from '../ressources/variables.js'

export const rawSkillOfUnitSchema = z
  .object({
    [VARIABLES.BaseUnitId]: z.string(),
    [VARIABLES.AbilityInfo]: z.string(),
    [VARIABLES.MagicInfo]: z.string(),
    [VARIABLES.Level]: z.string(),
    [VARIABLES.NVEXLevel]: z.string(),
  })
  .transform((data) => ({
    unitId: Number(data[VARIABLES.BaseUnitId]),
    abilityInfo: data[VARIABLES.AbilityInfo] !== '' ? null : data[VARIABLES.AbilityInfo].split(',').map(Number),
    magicInfo: data[VARIABLES.MagicInfo] !== '' ? null : data[VARIABLES.MagicInfo].split(',').map(Number),
    level: Number(data[VARIABLES.Level]),
    nvExLevel: data[VARIABLES.NVEXLevel] === '0' ? null : Number(data[VARIABLES.NVEXLevel]),
  }))
