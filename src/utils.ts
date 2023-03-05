import { Card, SpecialAbility } from '@prisma/client';
import { PRISMA } from './constants';
import { JsonCard, JsonDeck, JsonFighter, JsonGameSet } from './types';

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

export const upsertSpecialAbility = async (
  jsonDeck: JsonDeck,
  slug: string,
  jsonFighter?: JsonFighter
) => {
  const abilitySlug = `${slug}-special-ability`;
  const specialAbility = await PRISMA.specialAbility.findUnique({
    where: { slug: abilitySlug },
  });

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
  const fighter = await PRISMA.fighter.findUnique({
    where: { slug: jsonFighter.slug },
  });

  if (!fighter) {
    let specialAbility: SpecialAbility = null;
    if (isHero && !specialAbilityId) {
      specialAbility = await upsertSpecialAbility(
        jsonDeck,
        jsonFighter.slug,
        jsonFighter
      );
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

export const upsertCard = async (jsonCard: JsonCard, deckId: number) => {
  let card = await PRISMA.card.findUnique({ where: { slug: jsonCard.slug } });

  if (!card) {
    const hasBonusAttack = !!jsonCard.bonusAttack;
    let bonusAttack: Card;
    if (hasBonusAttack) {
      bonusAttack = await PRISMA.card.findUnique({
        where: { slug: jsonCard.bonusAttack.slug },
      });
      if (!bonusAttack) {
        bonusAttack = await PRISMA.card.create({
          data: {
            slug: jsonCard.bonusAttack.slug,
            name: jsonCard.bonusAttack.title.toUpperCase(),
            value: jsonCard.bonusAttack.value,
            effectGeneral: jsonCard.bonusAttack.basicText,
            effectImmediately: jsonCard.bonusAttack.immediateText,
            effectDuringCombat: jsonCard.bonusAttack.duringText,
            effectAfterCombat: jsonCard.bonusAttack.afterText,
            boostValue: jsonCard.boost,
            type: jsonCard.bonusAttack.type,
            isBonusAttack: true,
          },
        });
      }
    }

    card = await PRISMA.card.create({
      data: {
        slug: jsonCard.slug,
        name: jsonCard.title.toUpperCase(),
        sideNotes: jsonCard.cardNotes,
        gameNotes: jsonCard.notes,
        type: jsonCard.type,
        value: jsonCard.type !== 'scheme' ? jsonCard.value : null,
        boostValue: jsonCard.boost,
        effectGeneral: jsonCard.basicText,
        effectImmediately: jsonCard.immediateText,
        effectDuringCombat: jsonCard.duringText,
        effectAfterCombat: jsonCard.afterText,
        effectBoost: jsonCard.boostEffect,
        symbol: jsonCard.basketSymbol,
        bonusAttackId: hasBonusAttack ? bonusAttack.id : null,
      },
    });

    if (hasBonusAttack) {
      card = await PRISMA.card.update({
        where: {
          id: bonusAttack.id,
        },
        data: {
          bonusAttackOfCardId: card.id,
        },
      });
    }
  } else {
    if (!!jsonCard.notes) {
      card = await PRISMA.card.update({
        where: {
          id: card.id,
        },
        data: {
          gameNotes: !!card.gameNotes
            ? `${card.gameNotes}{{li}} ${jsonCard.notes}`
            : jsonCard.notes,
        },
      });
    }

    if (!!jsonCard.cardNotes) {
      card = await PRISMA.card.update({
        where: {
          id: card.id,
        },
        data: {
          sideNotes: !!card.sideNotes
            ? `${card.sideNotes}{{li}} ${jsonCard.cardNotes}`
            : jsonCard.cardNotes,
        },
      });
    }
  }

  const cardDeck = await PRISMA.cardDeck.findFirst({
    where: {
      cardId: card.id,
      deckId: deckId,
    },
  });
  if (!cardDeck) {
    await PRISMA.cardDeck.create({
      data: {
        cardId: card.id,
        deckId: deckId,
        quantity: jsonCard.quantity,
      },
    });
  }
  return card;
};
