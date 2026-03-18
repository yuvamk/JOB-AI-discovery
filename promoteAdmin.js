const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Searching for the most recently logged-in user...');
  
  const user = await prisma.user.findFirst({
    orderBy: { createdAt: 'desc' }
  });

  if (user) {
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { role: 'SUPER_ADMIN' }
    });
    console.log(`✅ Success! The account with email [${updatedUser.email}] has been promoted to SUPER_ADMIN.`);
    console.log('You can now refresh the app and access the Admin Dashboard.');
  } else {
    console.log('❌ No users found in the database. Please log in to the website first, then try again!');
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
