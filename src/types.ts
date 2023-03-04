export type Nullable<T> = undefined | null | T;

export type JsonGameSet = {
  slug: string;
  name: string;
  releaseDate: string;
};

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
  notes: Nullable<string>; // gameNotes
  cardNotes: Nullable<string>; // sideNotes
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
  specialName: Nullable<string>;
  movement: number;
  quote: Nullable<string>;
};

export type JsonFighter = {
  name: string;
  attackType: 'melee' | 'ranged';
  hp: number;
  quantity: number;
  slug: string;
  nameOnCard: string;
  quote: Nullable<string>;
  special: Nullable<string>;
  specialName: Nullable<string>;
};
