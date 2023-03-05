import https from 'https';
import * as fs from 'fs';
import { FILENAMES } from './constants';
import { JsonDeck } from './types';

const getImages = () => {
  for (const filename of FILENAMES) {
    const jsonDecks: JsonDeck[] = JSON.parse(
      fs.readFileSync(`./json/game-sets/${filename}`).toString()
    );

    for (const jsonDeck of jsonDecks) {
      const path = `./images/decks/${jsonDeck.slug}`;
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
        for (const jsonCard of jsonDeck.cards) {
          if (!!jsonCard.image) {
            const file = fs.createWriteStream(`${path}/${jsonCard.slug}.png`);
            https.get(jsonCard.image, (response) => {
              response.pipe(file);
            });
          }
        }
      }
    }
  }
};

export default getImages;
