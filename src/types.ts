export type Nullable<T> = undefined | null | T;

export type JsonCard = {
  title: string;
  type: 'attack' | 'defense' | 'versatile' | 'scheme';
  characterName: string;
  slug: string;
  boost: number;
  value: Nullable<number>;
  notes: Nullable<string>;
  cardNotes: Nullable<string>;
  quantity: number;
  immediateText: Nullable<string>;
  afterText: Nullable<string>;
  basicText: Nullable<string>;
  duringText: Nullable<string>;
};

export type JsonDeck = {
  name: string;
  notes: Nullable<string>;
  setSlug: string;
  slug: string;
  cards: JsonCard[];
  heroes: JsonFighter[];
  sidekicks: JsonFighter[];
};

export type JsonFighter = {
  name: string;
  attackType: 'melee' | 'ranged';
  hp: number;
  quantity: number;
  slug: string;
  nameOnCard: string;
  quote: Nullable<string>;
  movement: number;
  special: string;
};
