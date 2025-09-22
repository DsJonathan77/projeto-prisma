import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Criar cursos e módulos
  const module1 = await prisma.module.create({ data: { title: 'Module 1' } })
  const module2 = await prisma.module.create({ data: { title: 'Module 2' } })

  const course = await prisma.course.create({
    data: {
      name: 'Course A',
      modules: {
        connect: [{ id: module1.id }, { id: module2.id }] // associa módulos existentes
      }
    },
    include: { modules: true }
  })

  console.log('Curso criado com módulos:', course)

  // Consultar todos os cursos com módulos
  const coursesWithModules = await prisma.course.findMany({
    include: { modules: true }
  })
  console.log('Todos os cursos com módulos:', coursesWithModules)

  // Remover um módulo do curso (da tabela intermediária)
  await prisma.course.update({
    where: { id: course.id },
    data: {
      modules: { disconnect: { id: module1.id } } // remove a associação, sem deletar o módulo
    }
  })

  const updatedCourse = await prisma.course.findUnique({
    where: { id: course.id },
    include: { modules: true }
  })
  console.log('Curso após remover um módulo:', updatedCourse)
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())
