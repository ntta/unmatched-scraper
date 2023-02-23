import deckData from './json/decks.json';
import gameSetData from './json/sets.json';
import { PrismaClient } from '@prisma/client';

const { decks: jsonDecks } = deckData;
const { sets: jsonGameSets } = gameSetData;

const prisma = new PrismaClient();

const TO_DO_GAME_SETS = ['battle-of-legends-volume-one'];

const main = async () => {
  for (const jsonGameSet of jsonGameSets) {
    if (!TO_DO_GAME_SETS.includes(jsonGameSet.slug)) continue;

    const gameSet = await upsertGameSet(jsonGameSet);
    //#region Create deck
    const shortenJsonDecks = jsonDecks.filter((j) => j.setSlug === jsonGameSet.slug);
    for (const jsonDeck of shortenJsonDecks) {
      const deck = await upsertDeck(jsonDeck, gameSet.id);

      //#region Create fighter
      const jsonFighters = [...jsonDeck.heroes, ...jsonDeck.sidekicks];
      // Create special ability first if it's a string
      // TODO: may need to change the special field to cater for heroes who have many specials (e.g. Moon Knight)
      // TODO: and also for special that has name, new set Teen Spirit
      const specialAbility = await upsertSpecialAbility(jsonDeck.special, jsonDeck.heroes[0].slug);

      const heroes = await Promise.all(
        jsonDeck.heroes.map((json) => upsertFighter(json, jsonDeck.movement, specialAbility.id, deck.id, true))
      );
      const sidekicks = await Promise.all(
        jsonDeck.heroes.map((json) => upsertFighter(json, jsonDeck.movement, specialAbility.id, deck.id, false))
      );
      //#endregion
    }
    //#endregion
  }
};

const upsertGameSet = async (json: any) => {
  const slug: string = json.slug;
  const gameSet = await prisma.gameSet.findUnique({ where: { slug } });

  if (!gameSet) {
    return prisma.gameSet.create({
      data: {
        slug,
        name: json.name,
        releaseDate: new Date(json.releaseDate).toISOString(),
      },
    });
  }

  return gameSet;
};

const upsertDeck = async (json: any, gameSetId: number) => {
  const slug: string = json.slug;
  const deck = await prisma.deck.findUnique({ where: { slug } });

  if (!deck) {
    return prisma.deck.create({
      data: {
        slug,
        gameSetId,
        name: json.name,
        quote: json.quote,
        notes: json.notes,
      },
    });
  }

  return deck;
};

const upsertSpecialAbility = async (special: string, heroSlug: string) => {
  const slug = `${heroSlug}-special-ability`;
  const specialAbility = await prisma.specialAbility.findUnique({ where: { slug } });

  if (!specialAbility) {
    return prisma.specialAbility.create({
      data: {
        slug,
        description: special,
      },
    });
  }

  return specialAbility;
};

const upsertFighter = async (json: any, move: number, specialAbilityId: number, deckId: number, isHero: boolean) => {
  const slug: string = json.slug;
  const fighter = await prisma.fighter.findUnique({ where: { slug } });

  if (!fighter) {
    return prisma.fighter.create({
      data: {
        slug,
        move,
        deckId,
        specialAbilityId,
        isHero,
        name: json.name,
        attackType: json.attack_type,
        startHealth: json.hp,
        quantity: json.quantity,
      },
    });
  }

  return fighter;
};

main().then(() => console.log('DONE!'));
