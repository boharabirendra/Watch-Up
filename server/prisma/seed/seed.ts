
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      fullName: 'ram bist',
      email: 'rambist123@gmail.com',
      password: '$2a$10$E8IDzseNJ2aQjvmOaBdMauoHjAv27xqtCtwngI8OzofZX0BzNOymm', 
      profileUrl: 'https://res.cloudinary.com/dck6vnpet/image/upload/v1722601338/tuesp4qyqumt9xyl0ff0.jpg',
      role: 'CREATOR',
    },
  });

  const video = await prisma.video.create({
    data: {
      title: 'Nature video',
      description: 'Nature is real not fake.',
      playbackUrl: 'https://res.cloudinary.com/dck6vnpet/video/upload/sp_auto/v1722668039/wyqipljb02lkxfevx30q.m3u8',
      videoPublicId: 'intro-to-web-dev-123',
      duration: 6.5065,
      thumbnailUrl: 'https://res.cloudinary.com/dck6vnpet/image/upload/v1722667629/msjdtahjygdrgz3zqhyp.jpg',
      isPublished: true,
      userId: user.id, 
      likes: 4,
      views: 120,
    },
  });

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });