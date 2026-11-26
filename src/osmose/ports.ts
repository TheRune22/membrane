const models = ['Osmose', 'Osmose 49', 'Osmose 61']

export function isSoundEngineOutput(name: string): boolean {
  return models.some((model) =>  name === `MIDIOUT2 (${model})` || name === `${model} sound engine`)
}

export function isHakenOutput(name: string): boolean {
  return models.some((model) =>  name === `MIDIOUT5 (${model})` || name === `${model} haken`)
}

export function isHakenInput(name: string): boolean {
  return models.some((model) => name === `MIDIIN5 (${model})` || name === `${model} haken`)
}
