-- CreateTable
CREATE TABLE "fixed_extensions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_blocked" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fixed_extensions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "custom_extensions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "custom_extensions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "fixed_extensions_user_id_idx" ON "fixed_extensions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "fixed_extensions_user_id_name_key" ON "fixed_extensions"("user_id", "name");

-- CreateIndex
CREATE INDEX "custom_extensions_user_id_idx" ON "custom_extensions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "custom_extensions_user_id_name_key" ON "custom_extensions"("user_id", "name");
