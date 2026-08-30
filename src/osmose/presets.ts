import presetsCsv from '../../presets.csv?raw'

export interface OsmosePreset {
  readonly name: string
  readonly bank: number
  readonly program: number
  readonly type: string
  readonly tags: readonly string[]
}

function parsePreset(row: string, rowNumber: number): OsmosePreset {
  const [name, bank, program, type, characters] = row.split(',')
  const parsedBank = Number(bank)
  const parsedProgram = Number(program)

  if (!name.trim() || !bank.trim() || !program.trim() || !Number.isInteger(parsedBank) || !Number.isInteger(parsedProgram)) {
    throw new Error(`Invalid preset data on row ${rowNumber}.`)
  }

  return {
    name,
    bank: parsedBank,
    program: parsedProgram,
    type: type || 'Uncategorized',
    tags: characters ? characters.split(' + ') : [],
  }
}

export function parseOsmosePresets(csv: string): readonly OsmosePreset[] {
  return csv
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .map((row, index) => parsePreset(row, index + 2))
}

export function findOsmosePresetByName(presets: readonly OsmosePreset[], name: string): OsmosePreset | undefined {
  return presets.find((preset) => preset.name === name)
}

export const osmosePresets = parseOsmosePresets(presetsCsv)
