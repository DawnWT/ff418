import { z } from 'zod'

import { VARIABLES } from '../ressources/variables.js'

export const rawUnitSchema = z
  .object({
    [VARIABLES.UnitId]: z.string(),
    [VARIABLES.BaseUnitId]: z.string(),
    [VARIABLES.BattleUnitId]: z.string(),
    [VARIABLES.NVShiftId]: z.string(),
    [VARIABLES.NormalNVForm]: z.string(),
    [VARIABLES.Rarity]: z.string(),
    [VARIABLES.UnitMaxLevel]: z.string(),
    [VARIABLES.UnitRoles]: z.string(),
    [VARIABLES.GenderId]: z.string(),
    [VARIABLES.TribeId2]: z.string(),
    [VARIABLES.JobId]: z.string(),
    [VARIABLES.GameId]: z.string(),
    [VARIABLES.IsCombatUnit]: z.string(),
    [VARIABLES.IsPotUnit]: z.string(),
    [VARIABLES.IsSummonable]: z.string(),
    [VARIABLES.IsMoogle]: z.string(),
    [VARIABLES.EquipIds]: z.string(),
    [VARIABLES.MateriaSlots]: z.string(),
    [VARIABLES.Description]: z.string(),
    [VARIABLES.UnitHp]: z.string(),
    [VARIABLES.UnitMp]: z.string(),
    [VARIABLES.UnitAtk]: z.string(),
    [VARIABLES.UnitDef]: z.string(),
    [VARIABLES.UnitMag]: z.string(),
    [VARIABLES.UnitSpr]: z.string(),
    [VARIABLES.AttackFrames]: z.string(),
    [VARIABLES.EffectFrames]: z.string(),
    [VARIABLES.PhysicalResist]: z.string(),
    [VARIABLES.MagicalResist]: z.string(),
    [VARIABLES.MagicAffinity]: z.string(),
    [VARIABLES.ElementResists]: z.string(),
    [VARIABLES.StatusResists]: z.string(),
    [VARIABLES.UnitTmrId]: z.string(),
    [VARIABLES.UnitStmrId]: z.string(),
    [VARIABLES.VisionCardID]: z.string(),
  })
  .transform((data) => {
    const isNV = data[VARIABLES.NormalNVForm] !== '0'

    return {
      id: Number(data[VARIABLES.UnitId]),
      baseUnitId: Number(data[VARIABLES.BaseUnitId]),
      battleUnitId: Number(data[VARIABLES.BattleUnitId]),
      isSlbForm: data[VARIABLES.UnitId] !== data[VARIABLES.BattleUnitId],
      isCombatUnit: data[VARIABLES.IsCombatUnit] === '1',
      isPotUnit: data[VARIABLES.IsPotUnit] === '1',
      isMoogle: data[VARIABLES.IsMoogle] === '1',
      isSummonable: data[VARIABLES.IsSummonable] === '1',
      originalName: data[VARIABLES.Description],
      rarity: isNV ? 8 : Number(data[VARIABLES.Rarity]),
      nvShitfId: Number(data[VARIABLES.NVShiftId]),
      isBraveshift: isNV && data[VARIABLES.NormalNVForm] !== data[VARIABLES.UnitId],
      maxLevel: Number(data[VARIABLES.UnitMaxLevel]),
      roleIds: data[VARIABLES.UnitRoles].split(',').map(Number),
      genderId: Number(data[VARIABLES.GenderId]),
      raceId: Number(data[VARIABLES.TribeId2]),
      jobId: Number(data[VARIABLES.JobId]),
      gameId: Number(data[VARIABLES.GameId]),
      equipIds: data[VARIABLES.EquipIds].split(',').map(Number),
      materiaSlots: Number(data[VARIABLES.MateriaSlots]),
      hp: data[VARIABLES.UnitHp].split(',').map(Number),
      mp: data[VARIABLES.UnitMp].split(',').map(Number),
      atk: data[VARIABLES.UnitAtk].split(',').map(Number),
      def: data[VARIABLES.UnitDef].split(',').map(Number),
      mag: data[VARIABLES.UnitMag].split(',').map(Number),
      spr: data[VARIABLES.UnitSpr].split(',').map(Number),
      attackDamages: data[VARIABLES.AttackFrames]
        .split('@')
        .flatMap((attack) => attack.split('-').map((hit) => Number(hit.split(':')[1]))),
      attackDamageFrames: data[VARIABLES.AttackFrames]
        .split('@')
        .flatMap((attack) => attack.split('-').map((hit) => Number(hit.split(':')[0]))),
      effectFrames: data[VARIABLES.EffectFrames].split('&').map((stats) => Number(stats.split(':')[0])),
      physicalResist: Number(data[VARIABLES.PhysicalResist]),
      magicalResist: Number(data[VARIABLES.MagicalResist]),
      magicAffinity: data[VARIABLES.MagicAffinity].split(',').map(Number),
      elementResists: data[VARIABLES.ElementResists].split(',').map(Number),
      statusResists: data[VARIABLES.StatusResists].split(',').map(Number),
      tmrId: data[VARIABLES.UnitTmrId].split(':').map(Number),
      stmrId: data[VARIABLES.UnitStmrId].split(':').map(Number),
      visionCardId: Number(data[VARIABLES.VisionCardID]),
    }
  })
