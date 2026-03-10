import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const templates: { body: string; category: string }[] = [
  { body: "Proud of you for showing up today. One step at a time still counts.", category: "encouragement" },
  { body: "You do not need to solve everything today. Just focus on the next good step.", category: "encouragement" },
  { body: "A hard day does not erase progress.", category: "encouragement" },
  { body: "You are supported, and today is a fresh chance.", category: "encouragement" },
  { body: "Small steps still move you forward.", category: "encouragement" },
  { body: "You are allowed to rest. Rest is part of the work.", category: "affirmation" },
  { body: "Your feelings are valid. You don't have to fix them right now.", category: "affirmation" },
  { body: "You are enough exactly as you are today.", category: "affirmation" },
  { body: "It's okay to not be okay. Be gentle with yourself.", category: "affirmation" },
  { body: "You matter. Your presence in this world makes a difference.", category: "affirmation" },
  { body: "Just checking in. No need to reply—thinking of you.", category: "check-in" },
  { body: "Hope today is kind to you. Here if you need.", category: "check-in" },
  { body: "Sending a little warmth your way today.", category: "check-in" },
  { body: "You're on my mind. Take care of yourself.", category: "check-in" },
  { body: "One thing at a time. You've got this.", category: "reminder" },
  { body: "Remember: progress is not linear. You're still moving.", category: "reminder" },
  { body: "Drink some water when you can. Small care counts.", category: "reminder" },
  { body: "Pause and breathe. Even one deep breath helps.", category: "reminder" },
  { body: "Today you can choose one small act of kindness for yourself.", category: "reminder" },
  { body: "Grateful you're in my life. Thank you for being you.", category: "gratitude" },
  { body: "You bring something good to the world. Thank you.", category: "gratitude" },
  { body: "Appreciating you today.", category: "gratitude" },
  { body: "Thanks for being part of my life. It means a lot.", category: "gratitude" },
  { body: "I'm here. You're not alone in this.", category: "personal note" },
  { body: "No matter what today holds, I'm in your corner.", category: "personal note" },
  { body: "You don't have to carry it all. I've got your back.", category: "personal note" },
  { body: "Sending love. Take it one moment at a time.", category: "personal note" },
  { body: "Recovery is not a straight line. Today is still a good day to be kind to yourself.", category: "recovery support" },
  { body: "Every day you show up is a win. Proud of you.", category: "recovery support" },
  { body: "You're doing the best you can with what you have. That's enough.", category: "recovery support" },
];

async function main() {
  console.log("Seeding message templates...");
  const existing = await prisma.messageTemplate.count();
  if (existing >= templates.length) {
    console.log("Templates already present, skipping seed.");
    return;
  }
  for (const t of templates) {
    await prisma.messageTemplate.create({
      data: {
        body: t.body,
        category: t.category,
        isActive: true,
        isPersonal: false,
      },
    });
  }
  console.log(`Seeded ${templates.length} message templates.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
