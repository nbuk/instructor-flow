-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_action_tokens" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "expired_at" DATETIME,
    "consumed_at" DATETIME,
    "is_reusable" BOOLEAN NOT NULL DEFAULT false,
    "used_count" INTEGER NOT NULL DEFAULT 0,
    "max_uses" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_action_tokens" ("consumed_at", "created_at", "expired_at", "id", "payload", "token", "updated_at") SELECT "consumed_at", "created_at", "expired_at", "id", "payload", "token", "updated_at" FROM "action_tokens";
DROP TABLE "action_tokens";
ALTER TABLE "new_action_tokens" RENAME TO "action_tokens";
CREATE UNIQUE INDEX "action_tokens_token_key" ON "action_tokens"("token");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
