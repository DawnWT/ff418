import { z } from 'zod'

import { VARIABLES } from '../ressources/variables.js'

export const rawLbSchema = z
  .object({
    [VARIABLES.BattleUnitId]: z.string(),
    [VARIABLES.Description]: z.string(),
    [VARIABLES.KeyName]: z.string(),
    [VARIABLES.EffectTargetRange]: z.string(),
    [VARIABLES.ProcessType]: z.string(),
    [VARIABLES.AttackType]: z.string(),
    [VARIABLES.EquipmentElementInflict]: z.string(),
    [VARIABLES.MoveType]: z.string(),
  })
  .transform((data) => ({
    id: Number(data[VARIABLES.BattleUnitId]),
    orginalName: data[VARIABLES.Description],
    attackType: Number(data[VARIABLES.AttackType]),
    elementInflict: data[VARIABLES.EquipmentElementInflict].split(',').map((el) => el === '1'),
    effectsTargetTypes: data[VARIABLES.KeyName].split('@').map(Number),
    effectsRanges: data[VARIABLES.EffectTargetRange].split(',').map(Number),
    effectsIds: data[VARIABLES.ProcessType].split('@').map(Number),
    moveType: Number(data[VARIABLES.MoveType]),
  }))
