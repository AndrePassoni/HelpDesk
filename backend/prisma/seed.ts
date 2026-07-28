import { PrismaClient, Role } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const password = await bcrypt.hash('123456', 8)

  // Criar 1 Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@helpdesk.com' },
    update: {},
    create: {
      email: 'admin@helpdesk.com',
      name: 'Administrador',
      password,
      role: Role.ADMIN,
    },
  })
  console.log('Admin criado:', admin.email)

  // Criar 3 Técnicos
  const tech1 = await prisma.user.upsert({
    where: { email: 'tech1@helpdesk.com' },
    update: {},
    create: {
      email: 'tech1@helpdesk.com',
      name: 'Técnico 1',
      password,
      role: Role.TECHNICIAN,
      availableHours: ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
    },
  })
  
  const tech2 = await prisma.user.upsert({
    where: { email: 'tech2@helpdesk.com' },
    update: {},
    create: {
      email: 'tech2@helpdesk.com',
      name: 'Técnico 2',
      password,
      role: Role.TECHNICIAN,
      availableHours: ['10:00', '11:00', '12:00', '13:00', '16:00', '17:00', '18:00', '19:00'],
    },
  })
  
  const tech3 = await prisma.user.upsert({
    where: { email: 'tech3@helpdesk.com' },
    update: {},
    create: {
      email: 'tech3@helpdesk.com',
      name: 'Técnico 3',
      password,
      role: Role.TECHNICIAN,
      availableHours: ['12:00', '13:00', '14:00', '15:00', '18:00', '19:00', '20:00', '21:00'],
    },
  })
  console.log('Técnicos criados')

  // Criar 5 Serviços
  const services = [
    { name: 'Instalação e atualização de softwares', description: 'Serviço padrão de instalação', price: 80.0 },
    { name: 'Instalação e atualização de hardwares', description: 'Troca e upgrade de peças', price: 150.0 },
    { name: 'Diagnóstico e remoção de vírus', description: 'Limpeza do sistema', price: 100.0 },
    { name: 'Suporte a impressoras', description: 'Configuração e rede', price: 75.0 },
    { name: 'Backup e recuperação de dados', description: 'Restauração segura', price: 200.0 },
  ]

  for (const s of services) {
    await prisma.service.create({
      data: s
    })
  }
  console.log('Serviços criados')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
