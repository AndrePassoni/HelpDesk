import { PrismaClient, Role, TicketStatus } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

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
  // Buscar técnicos, clientes e serviços existentes
  const technicians = await prisma.user.findMany({
    where: { role: Role.TECHNICIAN },
  })

  const clients = await prisma.user.findMany({
    where: { role: Role.CLIENT },
  })

  const services = await prisma.service.findMany({
    where: { isActive: true },
  })

  if (technicians.length === 0) {
    console.log('Nenhum técnico encontrado. Execute o seed principal primeiro.')
    return
  }

  if (clients.length === 0) {
    console.log('Nenhum cliente encontrado. Criando clientes de teste...')
    // Criar alguns clientes se não existirem
    for (let i = 1; i <= 5; i++) {
      await prisma.user.upsert({
        where: { email: `cliente${i}@test.com` },
        update: {},
        create: {
          email: `cliente${i}@test.com`,
          name: `Cliente ${i}`,
          password: '123456',
          role: Role.CLIENT,
        },
      })
    }
    // Recarregar
    const newClients = await prisma.user.findMany({ where: { role: Role.CLIENT } })
    clients.push(...newClients)
  }

  console.log(`Encontrados: ${technicians.length} técnicos, ${clients.length} clientes, ${services.length} serviços`)

  // Criar tickets aleatórios
  const statuses: TicketStatus[] = ['OPEN', 'IN_PROGRESS', 'CLOSED']
  const ticketsCreated = []

  for (let i = 0; i < 30; i++) {
    const technician = technicians[Math.floor(Math.random() * technicians.length)]
    const client = clients[Math.floor(Math.random() * clients.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const titleIndex = Math.floor(Math.random() * ticketTitles.length)
    const descIndex = Math.floor(Math.random() * descriptions.length)
    
    // Selecionar 1-3 serviços aleatórios
    const numServices = Math.floor(Math.random() * 3) + 1
    const shuffledServices = [...services].sort(() => 0.5 - Math.random())
    const selectedServices = shuffledServices.slice(0, numServices)

    const ticket = await prisma.ticket.create({
      data: {
        title: ticketTitles[titleIndex],
        description: descriptions[descIndex],
        status,
        clientId: client.id,
        technicianId: technician.id,
        services: {
          connect: selectedServices.map(s => ({ id: s.id })),
        },
        attachments: [],
      },
    })

    ticketsCreated.push(ticket)
    console.log(`Ticket criado: #${String(ticket.id).padStart(5, '0')} - ${ticket.title} (${status}) - Tech: ${technician.name}`)
  }

  console.log(`\nTotal de ${ticketsCreated.length} tickets criados com sucesso!`)
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