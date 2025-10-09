-- CreateTable
CREATE TABLE "public"."MessageRead" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessageRead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MessageRead_userId_idx" ON "public"."MessageRead"("userId");

-- CreateIndex
CREATE INDEX "MessageRead_messageId_idx" ON "public"."MessageRead"("messageId");

-- CreateIndex
CREATE INDEX "MessageRead_readAt_idx" ON "public"."MessageRead"("readAt");

-- CreateIndex
CREATE UNIQUE INDEX "MessageRead_messageId_userId_key" ON "public"."MessageRead"("messageId", "userId");

-- AddForeignKey
ALTER TABLE "public"."MessageRead" ADD CONSTRAINT "MessageRead_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "public"."Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
