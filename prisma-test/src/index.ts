import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const newUser = {
    email: "someone@email.com",
    name: "Someone",
    password: "password",
    profile: {
      create: { bio: "I am someone" },
    },
    posts: {
      create: { title: "Hello World", content: "New Post" },
    },
  };

  await prisma.user.create({ data: newUser });

  const users = await prisma.user.findMany({
    include: {
      posts: true,
      profile: true,
    },
  });

  for (const user of users) {
    console.table(user.posts);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e.message);
    await prisma.$disconnect();
    process.exit(1);
  });
