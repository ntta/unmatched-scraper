export type Nullable<T> = undefined | null | T;

export type JsonBonusAttack = {
  slug: string;
  title: string;
  value: number;
  basicText: Nullable<string>;
  immediateText: Nullable<string>;
  duringText: Nullable<string>;
  afterText: Nullable<string>;
};

export type JsonCard = {
  slug: string;
  title: string;
  type: 'attack' | 'defense' | 'versatile' | 'scheme';
  characterName: string;
  boost: number;
  value: Nullable<number>;
  notes: Nullable<string>;
  cardNotes: Nullable<string>;
  quantity: number;
  basicText: Nullable<string>;
  immediateText: Nullable<string>;
  duringText: Nullable<string>;
  afterText: Nullable<string>;
};

export type JsonDeck = {
  name: string;
  notes: Nullable<string>;
  setSlug: string;
  slug: string;
  cards: JsonCard[];
  heroes: JsonFighter[];
  sidekicks: JsonFighter[];
  special: Nullable<string>;
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
  special: Nullable<string>;
};
