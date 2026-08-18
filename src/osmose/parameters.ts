export interface OsmoseParameter {
  readonly name: string
  readonly controlChange: number
  readonly group: 'macro' | 'gain' | 'effects' | 'performance' | 'equalizer'
}

export const osmoseParameters: readonly OsmoseParameter[] = [
  { name: 'Macro 1', controlChange: 12, group: 'macro' }, { name: 'Macro 2', controlChange: 13, group: 'macro' },
  { name: 'Macro 3', controlChange: 14, group: 'macro' }, { name: 'Macro 4', controlChange: 15, group: 'macro' },
  { name: 'Macro 5', controlChange: 16, group: 'macro' }, { name: 'Macro 6', controlChange: 17, group: 'macro' },
  { name: 'Pregain', controlChange: 26, group: 'gain' }, { name: 'Postgain', controlChange: 18, group: 'gain' },
  { name: 'Compressor mix', controlChange: 93, group: 'gain' },
  { name: 'Global FX parameter 1', controlChange: 20, group: 'effects' },
  { name: 'Global FX parameter 2', controlChange: 21, group: 'effects' }, { name: 'Global FX parameter 3', controlChange: 22, group: 'effects' },
  { name: 'Global FX parameter 4', controlChange: 23, group: 'effects' }, { name: 'Global FX mix', controlChange: 24, group: 'effects' },
  { name: 'Sustain', controlChange: 64, group: 'performance' },
  { name: 'Sostenuto 1', controlChange: 66, group: 'performance' }, { name: 'Sostenuto 2', controlChange: 69, group: 'performance' },
  { name: 'EQ tilt value', controlChange: 83, group: 'equalizer' }, { name: 'EQ frequency', controlChange: 84, group: 'equalizer' },
  { name: 'EQ mix', controlChange: 85, group: 'equalizer' },
]
