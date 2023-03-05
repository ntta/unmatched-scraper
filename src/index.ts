import { SpecialAbility } from '@prisma/client';
import * as fs from 'fs';
import { FILENAMES, JSON_GAME_SETS, PRISMA } from './constants';
import getImages from './get-images';
import { JsonDeck } from './types';
import {
  upsertCard,
  upsertDeck,
  upsertFighter,
  upsertGameSet,
  upsertSpecialAbility,
} from './utils';

const main = async () => {
  for (const filename of FILENAMES) {
    // Game Set
    const jsonGameSet = JSON_GAME_SETS.find(
      (s) => s.slug === filename.replace('.json', '')
    );
    const gameSet = await upsertGameSet(jsonGameSet);

    // Decks
    const jsonDecks: JsonDeck[] = JSON.parse(
      fs.readFileSync(`./json/game-sets/${filename}`).toString()
    );
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

      // Cards
      for (const jsonCard of jsonDeck.cards) {
        const card = await upsertCard(jsonCard, deck.id);
        if (jsonCard.characterName.toUpperCase() !== 'ANY') {
          const fighters = await PRISMA.fighter.findMany({
            where: { nameOnCard: jsonCard.characterName.toUpperCase() },
          });

          for (const fighter of fighters) {
            const cardFighter = await PRISMA.cardFighter.findFirst({
              where: {
                cardId: card.id,
                fighterId: fighter.id,
              },
            });

            if (!cardFighter) {
              await PRISMA.cardFighter.create({
                data: {
                  cardId: card.id,
                  fighterId: fighter.id,
                },
              });
            }
          }
        }
      }
    }
  }
};

main().then(() => console.log('DONE!'));
// getImages();
