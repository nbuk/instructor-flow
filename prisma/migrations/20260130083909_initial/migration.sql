-- CreateTable
CREATE TABLE "user_sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expired_at" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "user_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "role" TEXT NOT NULL,
    "tg_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "instructors" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "first_name" TEXT,
    "middle_name" TEXT,
    "last_name" TEXT,
    "phone" TEXT,
    CONSTRAINT "instructors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "instructor_cars" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "instructorId" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "licensePlate" TEXT NOT NULL,
    CONSTRAINT "instructor_cars_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "instructors" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "students" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "instructor_id" TEXT NOT NULL,
    "first_name" TEXT,
    "middle_name" TEXT,
    "last_name" TEXT,
    "first_name_norm" TEXT,
    "middle_name_norm" TEXT,
    "last_name_norm" TEXT,
    "phone" TEXT,
    CONSTRAINT "students_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "students_instructor_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "instructors" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "schedule_templates" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "instructor_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "timezone" TEXT NOT NULL,
    "default_rules" JSONB NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "schedule_templates_instructor_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "instructors" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "schedule_template_day_rules" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "templateId" TEXT NOT NULL,
    "weekday" INTEGER NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "breaks" JSONB NOT NULL,
    "slot_duration_minutes" INTEGER NOT NULL,
    "slot_gap_minutes" INTEGER NOT NULL,
    CONSTRAINT "schedule_template_day_rules_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "schedule_templates" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "lesson_slots" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "instructor_id" TEXT NOT NULL,
    "start_at" DATETIME NOT NULL,
    "end_at" DATETIME NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'Europe/Samara',
    "status" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "lesson_requests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lesson_slot_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "lesson_requests_lesson_slot_id_fkey" FOREIGN KEY ("lesson_slot_id") REFERENCES "lesson_slots" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "lesson_requests_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "action_tokens" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "expired_at" DATETIME,
    "consumed_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_code_key" ON "user_sessions"("code");

-- CreateIndex
CREATE UNIQUE INDEX "users_tg_id_key" ON "users"("tg_id");

-- CreateIndex
CREATE UNIQUE INDEX "instructors_user_id_key" ON "instructors"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "instructor_cars_instructorId_key" ON "instructor_cars"("instructorId");

-- CreateIndex
CREATE UNIQUE INDEX "students_user_id_key" ON "students"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "action_tokens_token_key" ON "action_tokens"("token");
