export interface OsmoseParameter {
  readonly name: string
  readonly channel: number
  readonly controlChange: number
  readonly group: 'macro' | 'gain' | 'compressor' | 'effects' | 'performance' | 'equalizer'
}

export const osmoseParameters: readonly OsmoseParameter[] = [
  {name: 'Macro 1', channel: 1, controlChange: 12, group: 'macro'},
  {name: 'Macro 2', channel: 1, controlChange: 13, group: 'macro'},
  {name: 'Macro 3', channel: 1, controlChange: 14, group: 'macro'},
  {name: 'Macro 4', channel: 1, controlChange: 15, group: 'macro'},
  {name: 'Macro 5', channel: 1, controlChange: 16, group: 'macro'},
  {name: 'Macro 6', channel: 1, controlChange: 17, group: 'macro'},
  {name: 'Compressor Threshold', channel: 1, controlChange: 90, group: 'compressor'},
  {name: 'Compressor Attack', channel: 1, controlChange: 91, group: 'compressor'},
  {name: 'Compressor Ratio', channel: 1, controlChange: 92, group: 'compressor'},
  {name: 'Compressor mix', channel: 1, controlChange: 93, group: 'compressor'},
  {name: 'Pregain', channel: 1, controlChange: 26, group: 'gain'},
  {name: 'Postgain', channel: 1, controlChange: 18, group: 'gain'},
  {name: 'Global FX parameter 1', channel: 1, controlChange: 20, group: 'effects'},
  {name: 'Global FX parameter 2', channel: 1, controlChange: 21, group: 'effects'},
  {name: 'Global FX parameter 3', channel: 1, controlChange: 22, group: 'effects'},
  {name: 'Global FX parameter 4', channel: 1, controlChange: 23, group: 'effects'},
  {name: 'Global FX parameter 5', channel: 1, controlChange: 95, group: 'effects'},
  {name: 'Global FX parameter 6', channel: 1, controlChange: 96, group: 'effects'},
  {name: 'Global FX mix', channel: 1, controlChange: 24, group: 'effects'},
  {name: 'EQ tilt value', channel: 1, controlChange: 83, group: 'equalizer'},
  {name: 'EQ frequency', channel: 1, controlChange: 84, group: 'equalizer'},
  {name: 'EQ mix', channel: 1, controlChange: 85, group: 'equalizer'},
  {name: 'Sostenuto 1', channel: 1, controlChange: 66, group: 'performance'},
  {name: 'Sostenuto 2', channel: 1, controlChange: 69, group: 'performance'},
  {name: 'Sustain', channel: 1, controlChange: 64, group: 'performance'},
]
