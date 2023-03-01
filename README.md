# Unmatched Scraper

This app facilitates the conversion of Unmatched board game data from external sources into an SQLite database constructed through Prisma

# Table of Contents

1. [Installation](#installation)
2. [Data Source](#data-source)
3. [Game Sets](#game-sets)
4. [Styled Strings](#styled-strings)

## <a name="installation"></a> 1. Installation

This app was built using Node v16.9.0 and necessitates the utilisation of Node version 16 or higher to operate effectively. To launch the app, follow the instructions below:

- Clone the repository onto your local machine
- Execute `npm install`
- Execute `npm start` to generate the SQLite database, which will be located in `prisma/unmatched.db`
- _Optional:_ Execute `npm run clear-db` to remove the generated database, as well as any associated database files including migration files. Migration files are not required at this stage, as the data source is already integrated into the project and we continuously import the data source into the latest prisma schema.
- _Optional:_ Execute `npm run fresh-start` is a combined command of `npm start` and `npm run clear-db`

## <a name="data-source"></a> 2. Data Source

In this version, the app utilises JSON data files sourced from [Unmatched Maker](https://unmatched.cards) as the primary data source. These files are imported into the database after having been modified, potentially including the application of [Styled Strings](#styled-strings). The JSON files are stored in `src/json` and include the following:

- _boards.json_
- _cards.json_
- _decks.json_
- _sets.json_

## <a name="game-sets"></a> 3. Game Sets

The Unmatched game system consists of numerous sets, each comprising one to four distinct decks. These decks contain individual fighters, each of which possesses a unique gameplay mechanism. The creation of a conventional relational database to store this information can present significant challenges and may necessitate schema modifications in the future. To address this complexity, the following section catalogues all existing Unmatched sets and highlights the distinctive gameplay mechanisms of each deck.

- Battle of Legends, Volume One
- Bruce Lee
- Robin Hood vs. Bigfoot
- Jurassic Park - InGen vs. Raptors
- Cobble & Fog
- Buffy the Vampire Slayer
- Little Red Riding Hood vs. Beowulf
- Marvel - Deadpool
- Battle of Legends, Volume Two
- Marvel - Hell's Kitchen
- Marvel - Redemption Row
- Jurassic Park - Dr. Sattler vs. T. Rex
- Houdini vs. The Genie
- Marvel - For King and Country _(no data yet)_
- Marvel - Teen Spirit _(no data yet)_

## <a name="styled-strings"></a> 4. Styled Strings

### Example

Certain fields in the JSON files may contain styled strings that offer guidance to app developers regarding text formatting for display on an app. For instance, the special ability of Alice features styled strings, as illustrated below:

> When you place Alice, choose whether she starts the game {{bold}}(BIG) or {{bold}}(SMALL).{{newline}}When Alice is {{bold}}(BIG), add 2 to the value of her attack cards.{{newline}}When Alice is {{bold}}(SMALL), add 1 to the value of her defense cards.

When presented on an app, the styled strings should be rendered as follows:

> When you place Alice, choose whether she starts the game **BIG** or **SMALL**.
>
> When Alice is **BIG**, add 2 to the value of her attack cards.
>
> When Alice is **SMALL**, add 1 to the value of her defense cards.

### Mapping table

Please find below the mapping table for styled strings

| Raw String                                  | Styled String                                   |
| ------------------------------------------- | ----------------------------------------------- |
| {{bold}}(bold text)                         | **bold text**                                   |
| {{italic}}(italic text)                     | _italic text_                                   |
| {{newline}}                                 | equivalent to `\n`                              |
| {{li}}                                      | <li></li>                                       |
| {{cite}}(T. Rex)                            | the citation below a quote                      |
| {{icon}}(Pelt)                              | 🐺                                              |
| {{card}}(feint)                             | Link to the card Feint                          |
| {{deck}}(alice)                             | Link to the deck Alice                          |
| {{url}}(Click Me!)(https://github.com/ntta) | <a href="https://github.com/ntta">Click Me!</a> |

### Game sets with styled strings

- Battle of Legends, Volume One
- Bruce Lee
- Robin Hood vs. Bigfoot
- Buffy the Vampire Slayer
- Little Red Riding Hood vs. Beowulf
- Marvel - Deadpool
- Marvel - Redemption Row
- Jurassic Park - Dr. Sattler vs. T. Rex
