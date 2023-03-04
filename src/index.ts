import { SpecialAbility } from '@prisma/client';
import * as fs from 'fs';
import { FILENAMES } from './constants';
import { JsonDeck, JsonGameSet } from './types';
import { upsertDeck, upsertFighter, upsertGameSet, upsertSpecialAbility } from './utils';

const jsonGameSets: JsonGameSet[] = JSON.parse(fs.readFileSync(`./json/sets.json`).toString())['sets'];

const main = async () => {
  for (const filename of FILENAMES) {
    // if (NOT_TO_DO_FILENAMES.includes(filename)) continue;

    // Game Set
    const jsonGameSet = jsonGameSets.find((s) => s.slug === filename.replace('.json', ''));
    const gameSet = await upsertGameSet(jsonGameSet);

    // Decks
    const jsonDecks: JsonDeck[] = JSON.parse(fs.readFileSync(`./json/game-sets/${filename}`).toString());
    for (const jsonDeck of jsonDecks) {
      const deck = await upsertDeck(jsonDeck, gameSet.id);

      // Fighters
      let specialAbility: SpecialAbility;
      if (!!jsonDeck.special) {
        specialAbility = await upsertSpecialAbility(jsonDeck, deck.slug);
      }

      await Promise.all(
        jsonDeck.heroes.map((jsonFighter) =>
          upsertFighter({
            jsonFighter,
            jsonDeck,
            deckId: deck.id,
            specialAbilityId: specialAbility?.id,
            isHero: true,
          })
        )
      );

      await Promise.all(
        jsonDeck.sidekicks.map((jsonFighter) =>
          upsertFighter({
            jsonFighter,
            jsonDeck,
            deckId: deck.id,
            specialAbilityId: specialAbility?.id,
            isHero: false,
          })
        )
      );
    }
  }
};

main().then(() => console.log('DONE!'));

// const { sets: jsonGameSets } = gameSetData;

// const prisma = new PrismaClient();

// const NOT_TO_DO_GAME_SETS = ['houdini-vs-the-genie'];
// const GAME_SETS = [
//   'battle-of-legends-volume-one',
//   'robin-hood-vs-bigfoot',
//   'bruce-lee',
//   'jurassic-park-ingen-vs-raptors',
//   'cobble-and-fog',
//   'buffy-the-vampire-slayer',
//   'jurassic-park-grant',
//   'marvel-teen-spirit',
//   'battle-of-legends-volume-two',
//   'little-red-riding-hood-vs-beowulf',
//   'marvel-for-king-and-country',
//   'design-contest-sets',
//   'marvel-deadpool',
//   'houdini-vs-the-genie',
//   'marvel-redemption-row',
//   'jurassic-park-dr-sattler-vs-t-rex',
//   'marvel-hells-kitchen',
// ];

// const main = async () => {
//   for (const jsonGameSet of jsonGameSets) {
//     if (NOT_TO_DO_GAME_SETS.includes(jsonGameSet.slug)) continue;

//     const gameSet = await upsertGameSet(jsonGameSet);
//     //#region Create deck
//     const shortenJsonDecks = jsonDecks.filter((j) => j.setSlug === jsonGameSet.slug);
//     for (const jsonDeck of shortenJsonDecks) {
//       try {
//         const deck = await upsertDeck(jsonDeck, gameSet.id);

//         //#region Create fighter
//         // Create special ability first if it's a string
//         // TODO: may need to change the special field to cater for heroes who have many specials (e.g. Moon Knight)
//         // TODO: and also for special that has name, new set Teen Spirit
//         const specialAbility = await upsertSpecialAbility(jsonDeck.special, jsonDeck.heroes[0].slug);

//         const heroes = await Promise.all(
//           jsonDeck.heroes.map((json) => upsertFighter(json, jsonDeck.movement, specialAbility.id, deck.id, true))
//         );
//         const sidekicks = await Promise.all(
//           jsonDeck.sidekicks.map((json) => upsertFighter(json, jsonDeck.movement, specialAbility.id, deck.id, false))
//         );
//         const fighters = [...heroes, ...sidekicks];

//         for (const jsonCard of jsonDeck.cards) {
//           const card = await upsertCard(jsonCard);
//           const fighter = await lookupFighterName(jsonCard.characterName, deck.id);
//           if (!!fighter) {
//             await prisma.cardFighter.create({
//               data: {
//                 cardId: card.id,
//                 fighterId: fighter.id,
//               },
//             });
//           }
//           await prisma.cardDeck.create({
//             data: {
//               cardId: card.id,
//               deckId: deck.id,
//               quantity: jsonCard.quantity,
//             },
//           });
//         }
//       } catch (err) {
//         console.log(jsonDeck.name);
//       }

//       //#endregion
//     }
//     //#endregion
//   }
// };

// const upsertGameSet = async (json: any) => {
//   const slug: string = json.slug;
//   const gameSet = await prisma.gameSet.findUnique({ where: { slug } });

//   if (!gameSet) {
//     return prisma.gameSet.create({
//       data: {
//         slug,
//         name: json.name,
//         releaseDate: new Date(json.releaseDate).toISOString(),
//       },
//     });
//   }

//   return gameSet;
// };

// const upsertDeck = async (json: any, gameSetId: number) => {
//   const slug: string = json.slug;
//   const deck = await prisma.deck.findUnique({ where: { slug } });

//   if (!deck) {
//     return prisma.deck.create({
//       data: {
//         slug,
//         gameSetId,
//         name: json.name,
//         quote: json.quote,
//         notes: json.notes,
//       },
//     });
//   }

//   return deck;
// };

// const upsertSpecialAbility = async (special: string, heroSlug: string) => {
//   const slug = `${heroSlug}-special-ability`;
//   const specialAbility = await prisma.specialAbility.findUnique({ where: { slug } });

//   if (!specialAbility) {
//     return prisma.specialAbility.create({
//       data: {
//         slug,
//         description: special,
//       },
//     });
//   }

//   return specialAbility;
// };

// const upsertFighter = async (json: any, move: number, specialAbilityId: number, deckId: number, isHero: boolean) => {
//   const slug: string = json.slug;
//   const fighter = await prisma.fighter.findUnique({ where: { slug } });

//   if (!fighter) {
//     return prisma.fighter.create({
//       data: {
//         slug,
//         move,
//         deckId,
//         specialAbilityId,
//         isHero,
//         name: json.name,
//         nameOnCard: json.nameOnCard,
//         attackType: json.attack_type,
//         startHealth: json.hp,
//         quantity: json.quantity,
//       },
//     });
//   }

//   return fighter;
// };

// const upsertCard = async (json: any) => {
//   const slug: string = json.slug;
//   const card = await prisma.card.findUnique({ where: { slug } });

//   if (!card) {
//     return prisma.card.create({
//       data: {
//         slug,
//         name: json.title,
//         notes: json.card_notes,
//         type: json.type,
//         value: json.value,
//         boostValue: json.boost,
//         effectGeneral: json.basicText,
//         effectImmediately: json.immediateText,
//         effectDuringCombat: json.duringText,
//         effectAfterCombat: json.afterText,
//       },
//     });
//   }

//   return card;
// };

// const lookupFighterName = async (nameOnCard: string, deckId: number) => {
//   if (nameOnCard.toLowerCase() === 'any') return null;

//   const fighter = await prisma.fighter.findFirst({
//     where: {
//       deckId,
//       nameOnCard,
//     },
//   });

//   return fighter ?? null;
// };

// // const slugs = jsonGameSets.map((set) => set.slug);
// // fs.writeFileSync('test.json', JSON.stringify(slugs));

// // main().then(() => console.log('DONE!'));

// const gameSetSlugs = jsonGameSets.map((json) => json.slug);

// for (const gameSetSlug of gameSetSlugs) {
//   if (gameSetSlug !== 'little-red-riding-hood-vs-beowulf') continue;
//   const gameSetDecks = [];
//   for (const jsonDeck of jsonDecks) {
//     if (jsonDeck.setSlug == gameSetSlug) {
//       gameSetDecks.push(jsonDeck);
//     }
//   }

//   fs.writeFileSync(`./game-sets/${gameSetSlug}.json`, JSON.stringify(gameSetDecks));
// }
