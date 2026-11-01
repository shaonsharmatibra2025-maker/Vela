const NAMES = ["Kite", "Marrow", "Sable", "Juniper", "North", "Hana", "Reed", "Ivy", "Soren", "Pavel", "Noa", "Quill"];

const LINES = [
  "The first episode still has that quiet before everything tips.",
  "Queued the rest after the trailer. The color grade is unfair.",
  "Rewatching slowly this week. The pacing holds up.",
  "Came in for the fight scenes and stayed for the quiet ones.",
  "Soundtrack is doing more work than the dialogue, in a good way.",
  "Marked this one and left it. Dangerous habit.",
  "The city shots in the opening are the whole mood.",
  "Not what I expected from the poster, which is a compliment.",
  "Episode two is where it actually starts, for me.",
  "Taking notes in the margins like it's homework.",
  "The side characters are stealing this.",
  "Official trailer does not prepare you for the silence.",
];

const BASE = 1_720_000_000_000;

export type SeedNote = {
  id: string;
  mediaId: number;
  episode: number;
  name: string;
  text: string;
  rating: number;
  at: number;
  parentId?: string;
};

export function seededNotes(mediaId: number): SeedNote[] {
  const count = 4 + (mediaId % 4);
  const notes: SeedNote[] = [];
  for (let i = 0; i < count; i++) {
    notes.push({
      id: `seed-${mediaId}-${i}`,
      mediaId,
      episode: ((mediaId + i) % 6) + 1,
      name: NAMES[(mediaId + i * 3) % NAMES.length] ?? "Guest",
      text: LINES[(mediaId * 5 + i * 7) % LINES.length] ?? LINES[0]!,
      rating: 6 + ((mediaId + i) % 5),
      at: BASE - ((mediaId % 40) + i * 5) * 86_400_000,
    });
  }
  return notes;
}
