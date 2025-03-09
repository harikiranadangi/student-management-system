-- CreateTable
CREATE TABLE "clerk_users" (
    "id" VARCHAR NOT NULL,
    "username" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "surname" VARCHAR NOT NULL,

    CONSTRAINT "clerk_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clerk_users_username_key" ON "clerk_users"("username");
