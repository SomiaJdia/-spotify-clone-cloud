-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "song" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "audioKey" TEXT NOT NULL,
    "coverKey" TEXT,
    "artistName" TEXT NOT NULL,

    CONSTRAINT "song_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "playlist" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "playlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "favorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "like" (
    "userId" TEXT NOT NULL,
    "songId" TEXT NOT NULL,

    CONSTRAINT "like_pkey" PRIMARY KEY ("userId","songId")
);

-- CreateTable
CREATE TABLE "_PlaylistToSong" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_FavoriteToSong" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "playlist_userId_key" ON "playlist"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "favorite_userId_key" ON "favorite"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_PlaylistToSong_AB_unique" ON "_PlaylistToSong"("A", "B");

-- CreateIndex
CREATE INDEX "_PlaylistToSong_B_index" ON "_PlaylistToSong"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FavoriteToSong_AB_unique" ON "_FavoriteToSong"("A", "B");

-- CreateIndex
CREATE INDEX "_FavoriteToSong_B_index" ON "_FavoriteToSong"("B");

-- AddForeignKey
ALTER TABLE "playlist" ADD CONSTRAINT "playlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite" ADD CONSTRAINT "favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "like" ADD CONSTRAINT "like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "like" ADD CONSTRAINT "like_songId_fkey" FOREIGN KEY ("songId") REFERENCES "song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlaylistToSong" ADD CONSTRAINT "_PlaylistToSong_A_fkey" FOREIGN KEY ("A") REFERENCES "playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlaylistToSong" ADD CONSTRAINT "_PlaylistToSong_B_fkey" FOREIGN KEY ("B") REFERENCES "song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FavoriteToSong" ADD CONSTRAINT "_FavoriteToSong_A_fkey" FOREIGN KEY ("A") REFERENCES "favorite"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FavoriteToSong" ADD CONSTRAINT "_FavoriteToSong_B_fkey" FOREIGN KEY ("B") REFERENCES "song"("id") ON DELETE CASCADE ON UPDATE CASCADE;
