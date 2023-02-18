-- CreateTable
CREATE TABLE "Card" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "boostValue" INTEGER NOT NULL,
    "effectGeneral" TEXT,
    "effectImmediately" TEXT,
    "effectDuringCombat" TEXT,
    "effectAfterCombat" TEXT,
    "quote" TEXT,
    "notes" TEXT,
    "basketSymbol" TEXT,
    "isBonusAttack" BOOLEAN NOT NULL DEFAULT false,
    "bonusAttackOfCardId" INTEGER,
    CONSTRAINT "Card_bonusAttackOfCardId_fkey" FOREIGN KEY ("bonusAttackOfCardId") REFERENCES "Card" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Fighter" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "attackType" TEXT NOT NULL,
    "hp" INTEGER NOT NULL,
    "isHero" BOOLEAN NOT NULL,
    "quantity" INTEGER NOT NULL,
    "deckId" INTEGER NOT NULL,
    CONSTRAINT "Fighter_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CardFighter" (
    "cardId" INTEGER NOT NULL,
    "fighterId" INTEGER NOT NULL,

    PRIMARY KEY ("cardId", "fighterId"),
    CONSTRAINT "CardFighter_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CardFighter_fighterId_fkey" FOREIGN KEY ("fighterId") REFERENCES "Fighter" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SpecialAbility" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "deckId" INTEGER NOT NULL,
    CONSTRAINT "SpecialAbility_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Deck" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "quote" TEXT,
    "notes" TEXT,
    "move" INTEGER NOT NULL,
    "gameSetId" INTEGER NOT NULL,
    CONSTRAINT "Deck_gameSetId_fkey" FOREIGN KEY ("gameSetId") REFERENCES "GameSet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DeckCard" (
    "deckId" INTEGER NOT NULL,
    "cardId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    PRIMARY KEY ("deckId", "cardId"),
    CONSTRAINT "DeckCard_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DeckCard_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GameSet" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "releaseDate" DATETIME NOT NULL,
    "notes" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Card_name_key" ON "Card"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Card_slug_key" ON "Card"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Card_bonusAttackOfCardId_key" ON "Card"("bonusAttackOfCardId");

-- CreateIndex
CREATE UNIQUE INDEX "Fighter_name_key" ON "Fighter"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Fighter_slug_key" ON "Fighter"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "SpecialAbility_name_key" ON "SpecialAbility"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SpecialAbility_slug_key" ON "SpecialAbility"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Deck_name_key" ON "Deck"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Deck_slug_key" ON "Deck"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "GameSet_name_key" ON "GameSet"("name");

-- CreateIndex
CREATE UNIQUE INDEX "GameSet_slug_key" ON "GameSet"("slug");
