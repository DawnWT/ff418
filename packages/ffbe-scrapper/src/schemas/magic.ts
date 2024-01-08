import { z } from 'zod'

import { VARIABLES } from '../ressources/variables.js'

export const rawMagicSchema = z
  .object({
    [VARIABLES.MagicId]: z.string(),
    [VARIABLES.Description]: z.string(),
    [VARIABLES.RecipeType]: z.string(),
    [VARIABLES.EquipmentRarity]: z.string(),
    [VARIABLES.AbilityUnique]: z.string(),
    [VARIABLES.MPCost]: z.string(),
    [VARIABLES.MagicType]: z.string(),
    [VARIABLES.SpFunction]: z.string(),
    [VARIABLES.MoveType]: z.string(),
    [VARIABLES.AttackType]: z.string(),
    [VARIABLES.EquipmentElementInflict]: z.string(),
    [VARIABLES.AttackFrames]: z.string(),
    [VARIABLES.KeyName]: z.string(),
    [VARIABLES.EffectTargetRange]: z.string(),
    [VARIABLES.ProcessType]: z.string(),
    [VARIABLES.effectRaw]: z.string(),
  })
  .transform((data) => {
    const magicInfo = data[VARIABLES.SpFunction].split(',')

    return {
      id: Number(data[VARIABLES.MagicId]),
      originalName: data[VARIABLES.Description],
      rarity: Number(data[VARIABLES.EquipmentRarity]),
      costMp: Number(data[VARIABLES.MPCost]),
      magicType: Number(data[VARIABLES.MagicType]),
      skillType: (data[VARIABLES.RecipeType] === '1' ? 'PASSIVE' : 'ACTIVE') as 'ACTIVE' | 'PASSIVE',
      isSealable: magicInfo[0] === '1',
      isReflectable: magicInfo[1] === '1',
      moveType: Number(data[VARIABLES.MoveType]),
      attackType: Number(data[VARIABLES.AttackType]),
      elementInflict: data[VARIABLES.EquipmentElementInflict].split(',').map((el) => el === '1'),
    }
  })
