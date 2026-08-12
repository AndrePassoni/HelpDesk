import { PrismaClient, Role, TicketStatus } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const ticketTitles = [
  'Rede lenta no escritório',
  'Computador não liga',
  'Impressora não imprime',
  'Erro ao acessar sistema',
  'Lentidão no servidor',
  'Backup não realizado',
  'Vírus detectado',
  'Atualização de Windows falhou',
  'Configuração de VPN',
  'Problema com e-mail corporativo',
  'Tela azul (BSOD)',
  'Desempenho degradado',
  'Periféricos não reconhecidos',
  'Falha no acesso remoto',
  'Sistema operacional corrompido',
]

const descriptions = [
  'Usuário relata lentidão extrema na navegação e acesso a arquivos compartilhados.',
  'Equipamento não inicia, apenas tela preta ao pressionar botão de ligar.',
  'Impressora de rede não responde a comandos de impressão, luz piscando.',
  'Erro 500 ao tentar acessar o portal interno da empresa.',
  'Servidor de arquivos apresenta tempo de resposta alto.',
  'Rotina de backup noturno falhou nas últimas 3 noites.',
  'Antivírus detectou ameaça em arquivo suspeito baixado da internet.',
  'Windows Update travado em 45% há mais de 2 horas.',
  'Usuário não consegue conectar na VPN corporativa do home office.',
  'Não recebe e-mails externos, apenas internos funcionam.',
  'Máquina apresentou tela azul com código CRITICAL_PROCESS_DIED.',
  'Aplicações demoram para abrir, CPU constantemente em 100%.',
  'Mouse e teclado USB não funcionam após reinicialização.',
  'Erro de certificado ao tentar acessar área restrita via RDP.',
  'Windows não inicia, loop de reparo automático infinito.',
]

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

  // Criar 5 Clientes
  const clients = []
  for (let i = 1; i <= 5; i++) {
    const client = await prisma.user.upsert({
      where: { email: `cliente${i}@test.com` },
      update: {},
      create: {
        email: `cliente${i}@test.com`,
        name: `Cliente ${i}`,
        password,
        role: Role.CLIENT,
      },
    })
    clients.push(client)
  }
  console.log('Clientes criados')

  // Criar 5 Serviços
  const services = [
    { name: 'Instalação e atualização de softwares', description: 'Serviço padrão de instalação', price: 80.0 },
    { name: 'Instalação e atualização de hardwares', description: 'Troca e upgrade de peças', price: 150.0 },
    { name: 'Diagnóstico e remoção de vírus', description: 'Limpeza do sistema', price: 100.0 },
    { name: 'Suporte a impressoras', description: 'Configuração e rede', price: 75.0 },
    { name: 'Backup e recuperação de dados', description: 'Restauração segura', price: 200.0 },
  ]

  const createdServices = []
  for (const s of services) {
    const service = await prisma.service.create({
      data: s
    })
    createdServices.push(service)
  }
  console.log('Serviços criados')

  // Criar tickets aleatórios (30 total, distribuídos entre status e técnicos)
  const technicians = [tech1, tech2, tech3]
  const statuses: TicketStatus[] = ['OPEN', 'IN_PROGRESS', 'CLOSED']
  
  for (let i = 0; i < 30; i++) {
    const technician = technicians[Math.floor(Math.random() * technicians.length)]
    const client = clients[Math.floor(Math.random() * clients.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const titleIndex = Math.floor(Math.random() * ticketTitles.length)
    const descIndex = Math.floor(Math.random() * descriptions.length)
    
    // Selecionar 1-3 serviços aleatórios
    const numServices = Math.floor(Math.random() * 3) + 1
    const shuffledServices = [...createdServices].sort(() => 0.5 - Math.random())
    const selectedServices = shuffledServices.slice(0, numServices)

    const ticket = await prisma.ticket.create({
      data: {
        title: ticketTitles[titleIndex],
        description: descriptions[descIndex],
        status,
        clientId: client.id,
        technicianId: technician.id,
        baseServiceId: selectedServices[0].id,
        services: {
          connect: selectedServices.map(s => ({ id: s.id })),
        },
        attachments: [],
      },
    })

    console.log(`Ticket criado: #${String(ticket.id).padStart(5, '0')} - ${ticket.title} (${status}) - Tech: ${technician.name}`)
  }

  console.log('\nSeed concluído com sucesso!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    await pool.end()
    process.exit(1)
  })