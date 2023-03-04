import { SpecialAbility } from '@prisma/client';
import { PRISMA } from './constants';
import { JsonDeck, JsonFighter, JsonGameSet } from './types';

export const upsertGameSet = async (json: JsonGameSet) => {
  const slug: string = json.slug;
  const gameSet = await PRISMA.gameSet.findUnique({ where: { slug } });

  if (!gameSet) {
    return PRISMA.gameSet.create({
      data: {
        slug,
        name: json.name,
        releaseDate: new Date(json.releaseDate).toISOString(),
      },
    });
  }

  return gameSet;
};

export const upsertDeck = async (json: JsonDeck, gameSetId: number) => {
  const slug: string = json.slug;
  const deck = await PRISMA.deck.findUnique({ where: { slug } });

  if (!deck) {
    return PRISMA.deck.create({
      data: {
        slug,
        gameSetId,
        name: json.name.toUpperCase(),
        gameNotes: json.notes,
        quote: json.quote,
      },
    });
  }

  return deck;
};

export const upsertSpecialAbility = async (jsonDeck: JsonDeck, slug: string, jsonFighter?: JsonFighter) => {
  const abilitySlug = `${slug}-special-ability`;
  const specialAbility = await PRISMA.specialAbility.findUnique({ where: { slug: abilitySlug } });

  if (!specialAbility) {
    return PRISMA.specialAbility.create({
      data: {
        slug: abilitySlug,
        description: jsonDeck.special ?? jsonFighter.special,
        name: jsonDeck.specialName ?? jsonFighter?.specialName,
      },
    });
  }

  return specialAbility;
};

export const upsertFighter = async ({
  jsonFighter,
  jsonDeck,
  specialAbilityId,
  deckId,
  isHero,
}: {
  jsonFighter: JsonFighter;
  jsonDeck: JsonDeck;
  specialAbilityId?: number;
  deckId: number;
  isHero: boolean;
}) => {
  const fighter = await PRISMA.fighter.findUnique({ where: { slug: jsonFighter.slug } });

  if (!fighter) {
    let specialAbility: SpecialAbility = null;
    if (isHero && !specialAbilityId) {
      specialAbility = await upsertSpecialAbility(jsonDeck, jsonFighter.slug, jsonFighter);
    }
    return PRISMA.fighter.create({
      data: {
        slug: jsonFighter.slug,
        move: jsonDeck.movement,
        deckId,
        specialAbilityId: isHero ? specialAbilityId ?? specialAbility.id : null,
        isHero,
        name: jsonFighter.name,
        nameOnCard: jsonFighter.nameOnCard,
        attackType: jsonFighter.attackType,
        startHealth: jsonFighter.hp,
        quantity: jsonFighter.quantity,
        quote: jsonFighter.quote,
      },
    });
  }

  return fighter;
};
