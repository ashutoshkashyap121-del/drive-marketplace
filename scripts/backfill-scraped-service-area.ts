import { PrismaClient } from "@prisma/client";
import { buildServiceArea, getBasePincode } from "@/lib/scraped-service-area";

const prisma = new PrismaClient();

async function main() {
  const dryRun = process.argv.includes("--dry-run");

  const trainers = await prisma.trainer.findMany({
    where: {
      status: "APPROVED",
      adminNotes: { contains: "scraped_gmb" },
    },
    select: {
      id: true,
      name: true,
      city: true,
      pincode: true,
      serviceArea: true,
      adminNotes: true,
    },
  });

  console.log(`Found ${trainers.length} scraped approved trainers.`);

  let updated = 0;
  let skipped = 0;

  for (const trainer of trainers) {
    const basePincode = getBasePincode({
      pincode: trainer.pincode,
      adminNotes: trainer.adminNotes,
    });

    if (!basePincode) {
      skipped++;
      console.log(`SKIP ${trainer.id} ${trainer.name} - no pincode found in trainer/adminNotes`);
      continue;
    }

    const serviceArea = buildServiceArea({
      city: trainer.city,
      basePincode,
      existing: trainer.serviceArea,
    });

    const currentArea = [...trainer.serviceArea].sort();
    const nextArea = [...serviceArea].sort();
    const changed =
      trainer.pincode !== basePincode ||
      currentArea.length !== nextArea.length ||
      currentArea.some((code, index) => code !== nextArea[index]);

    if (!changed) {
      skipped++;
      console.log(`SKIP ${trainer.id} ${trainer.name} - already up to date`);
      continue;
    }

    console.log(`UPDATE ${trainer.id} ${trainer.name} - base ${basePincode} - ${nextArea.join(", ")}`);

    if (!dryRun) {
      await prisma.trainer.update({
        where: { id: trainer.id },
        data: {
          pincode: basePincode,
          serviceArea: nextArea,
        },
      });
    }

    updated++;
  }

  console.log(`Done. Updated: ${updated}. Skipped: ${skipped}. Dry run: ${dryRun}.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
