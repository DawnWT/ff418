import { z } from 'zod'

import { VARIABLES } from '../ressources/variables.js'

export const rawLbLvlSchema = z
  .object({
    [VARIABLES.BattleUnitId]: z.string(),
    [VARIABLES.LBCost]: z.string(),
    [VARIABLES.Level]: z.string(),
    [VARIABLES.effectRaw]: z.string(),
  })
  .transform((data) => ({
    lbId: Number(data[VARIABLES.BattleUnitId]),
    lbCost: Number(data[VARIABLES.LBCost]),
    lbLevel: Number(data[VARIABLES.Level]),
    lbEffectProps: data[VARIABLES.effectRaw].split('@').map((props) =>
      props
        .split(',')
        .map((p) =>
          !p.includes('&') && !p.includes(':') && !p.includes(';')
            ? Number(p)
            : p.split(/&|:|;/g).map((el) => Number(el))
        )
        .filter((w) => !Number.isNaN(w))
    ),
  }))
