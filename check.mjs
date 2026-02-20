import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const vehicle = await prisma.vehicle.create({
  data: {
    trainerId: 1,
    type: 'CAR',
    vehicleNumber: 'DL01AB1234',
    dualControl: true,
    insured: true,
  }
})

console.log('Vehicle created:', vehicle)
await prisma.$disconnect()