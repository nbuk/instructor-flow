-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_lesson_slots" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "instructor_id" TEXT NOT NULL,
    "start_at" DATETIME NOT NULL,
    "end_at" DATETIME NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'Europe/Samara',
    "status" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_lesson_slots" ("created_at", "end_at", "id", "instructor_id", "start_at", "status", "updated_at") SELECT "created_at", "end_at", "id", "instructor_id", "start_at", "status", "updated_at" FROM "lesson_slots";
DROP TABLE "lesson_slots";
ALTER TABLE "new_lesson_slots" RENAME TO "lesson_slots";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
