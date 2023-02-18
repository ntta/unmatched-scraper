import deckData from './json/decks.json';
import gameSetData from './json/sets.json';
import { PrismaClient } from '@prisma/client';

const { decks } = deckData;
const { sets: gameSets } = gameSetData;

const prisma = new PrismaClient();

const main = async () => {
  // await prisma.deck.deleteMany({});
  // await prisma.gameSet.deleteMany({});

  for (const json of decks) {
    try {
      const { name, slug, quote, notes, movement, set, setSlug } = json;

      if (!movement) continue;

      const gameSet = await upsertGameSet(setSlug, set);

      //#region Create deck
      const deck = await prisma.deck.create({
        data: {
          name,
          slug,
          quote,
          notes,
          gameSetId: gameSet.id,
          move: movement,
        },
      });
      //#endregion

      //#region Create fighters
      const { heroes, sidekicks } = json;
      for (const json of heroes) {
        // Create hero
        const { name, slug, hp, quantity, attack_type: attackType } = json;
        await prisma.fighter.create({
          data: {
            name,
            slug,
            attackType,
            hp,
            quantity,
            isHero: true,
            deckId: deck.id,
          },
        });
      }

      for (const json of sidekicks) {
        // Create sidekick
        const { name, slug, hp, quantity, attack_type: attackType } = json;
        await prisma.fighter.create({
          data: {
            name,
            slug,
            attackType,
            hp,
            quantity,
            isHero: false,
            deckId: deck.id,
          },
        });
      }
      //#endregion

      //#region Create cards
      for (const cardData of json.cards) {
        const {
          title,
          slug,
          characterName,
          type,
          value,
          quantity,
          boost,
          afterText,
          basicText,
          immediateText,
          duringText,
        } = cardData;

        const fighter = await getFighterByName(characterName);

        // TODO: check if slug exists first

        await prisma.card.create({
          data: {
            name: title,
            slug,
            type,
            value,
            boostValue: boost,
            effectGeneral: basicText,
            effectImmediately: immediateText,
            effectDuringCombat: duringText,
            effectAfterCombat: afterText,
            isBonusAttack: false,
            deckCard: {
              create: {
                deckId: deck.id,
                quantity,
              },
            },
            cardFighter: !!fighter
              ? {
                  create: {
                    fighterId: fighter.id,
                  },
                }
              : undefined,
          },
        });
      }
      //#endregion
    } catch (err) {
      console.log(`Error when extracting deck '${json.name}'`);
      console.log(err);
    }
  }
};

const upsertGameSet = async (slug: string, name: string) => {
  const gameSet = await prisma.gameSet.findUnique({ where: { slug } });

  if (!gameSet) {
    // Create game set
    const json = gameSets.find((s) => s.slug === slug);
    return prisma.gameSet.create({
      data: {
        name,
        slug,
        releaseDate: new Date(json.releaseDate).toISOString(),
      },
    });
  }

  return gameSet;
};

const getFighterByName = async (name: string) => {
  if (name.toLowerCase() === 'any') return null;
  let fighters = await prisma.fighter.findMany({
    where: {
      name: {
        contains: name,
      },
    },
  });
  fighters = fighters.filter((f) => f.name.length == name.length);
  return fighters.length > 0 ? fighters[0] : null;
};

main().then(() => console.log('DONE!'));
