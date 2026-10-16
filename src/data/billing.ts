export type Bill = 'lead' | 'mid' | 'rest';

// How the 5 October 2026 announcement placed the name on the bill.
// lead: Pitchfork's headliners and "atop the bill", the same names Pollstar says "lead" the lineup,
// plus the Sunday Bits headliners.
// mid: names Pitchfork put in the second billing, or "further down the listings".
// rest: rising names and every other billed act. Not an official ranking and not a measure of the music.
// https://pitchfork.com/story/phoebe-bridgers-massive-attack-caroline-polachek-to-headline-primavera-2027/
// https://news.pollstar.com/2026/10/06/doechii-phoebe-bridgers-hayley-williams-lead-primavera-sound-25th-anniversary-lineup/
const LEAD = new Set([
  'adela',
  'phoebe-bridgers',
  'massive-attack',
  'caroline-polachek',
  'robyn',
  'turnstile',
  'skrillex-b2b-ninajirachi',
  'the-chemical-brothers',
  'doechii',
  'fontaines-dc',
  'fka-twigs',
  'hayley-williams',
  'bad-gyal',
  'lola-young',
  'prospa',
  'richie-hawtin',
  'four-tet',
  'dixon',
]);

const MID = new Set([
  'pavement',
  'tinashe',
  'king-gizzard-and-the-lizard-wizard',
  'anohni',
  'underworld',
  'dinosaur-jr',
  'vashti-bunyan',
  'bonnie-prince-billy',
  'converge',
  'juana-molina',
  'mabe-fratti',
  'atlas-sound',
  'arca',
  'snow-strippers',
  'shygirl',
  'kim-petras',
  's-a-s-s',
  'weyes-blood',
  'julien-baker',
  'bleachers',
  'greg-freeman',
  'gilla-band',
  'friko',
  'lip-critic',
]);

export function billOf(id: string): Bill {
  if (LEAD.has(id)) return 'lead';
  if (MID.has(id)) return 'mid';
  return 'rest';
}
