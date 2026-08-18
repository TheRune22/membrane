export interface OsmoseParameter {
  readonly name: string
  readonly controlChange: number
}

export const osmoseParameters: readonly OsmoseParameter[] = [
  { name: 'Macro 1', controlChange: 12 }, { name: 'Macro 2', controlChange: 13 },
  { name: 'Macro 3', controlChange: 14 }, { name: 'Macro 4', controlChange: 15 },
  { name: 'Macro 5', controlChange: 16 }, { name: 'Macro 6', controlChange: 17 },
  { name: 'Postgain', controlChange: 18 }, { name: 'Global FX parameter 1', controlChange: 20 },
  { name: 'Global FX parameter 2', controlChange: 21 }, { name: 'Global FX parameter 3', controlChange: 22 },
  { name: 'Global FX parameter 4', controlChange: 23 }, { name: 'Global FX mix', controlChange: 24 },
  { name: 'Pregain', controlChange: 26 }, { name: 'Sustain', controlChange: 64 },
  { name: 'Sostenuto 1', controlChange: 66 }, { name: 'Sostenuto 2', controlChange: 69 },
  { name: 'EQ tilt value', controlChange: 83 }, { name: 'EQ frequency', controlChange: 84 },
  { name: 'EQ mix', controlChange: 85 }, { name: 'Compressor mix', controlChange: 93 },
]
