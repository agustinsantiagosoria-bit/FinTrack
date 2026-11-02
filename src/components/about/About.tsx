
import {
  Code2,
  Wallet,
  UserRound,
  Lightbulb,
  Database,
  Layers,
  Palette,
  ShieldCheck,
} from 'lucide-react'

const technologies = [
  {
    name: 'React',
    description: 'Construcción de la interfaz.',
    icon: Layers,
  },
  {
    name: 'TypeScript',
    description: 'Tipado y organización del código.',
    icon: Code2,
  },
  {
    name: 'Tailwind CSS',
    description: 'Diseño y estilos visuales.',
    icon: Palette,
  },
  {
    name: 'Supabase',
    description: 'Autenticación y almacenamiento de datos.',
    icon: Database,
  },
  {
    name: 'Recharts',
    description: 'Gráficos y visualización de estadísticas.',
    icon: Wallet,
  },
  {
    name: 'Lucide React',
    description: 'Iconografía de la aplicación.',
    icon: Lightbulb,
  },
]

export default function About() {
  return (
    <div className="space-y-8">

      {/* ENCABEZADO */}
      <div>
        <div className="mb-3 flex items-center gap-2 text-violet-400">
          <Code2 size={20} />
          <span className="text-sm font-medium">
            Información del proyecto
          </span>
        </div>

        <h1 className="text-3xl font-bold">
          Acerca del desarrollador
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-gray-400">
          Conocé la historia detrás de FinTrack, su propósito y las
          tecnologías utilizadas durante su desarrollo.
        </p>
      </div>

      {/* PRESENTACIÓN DEL PROYECTO */}
      <section className="rounded-2xl border border-white/10 bg-[#11111B] p-6 md:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
            <Wallet size={25} />
          </div>

          <div>
            <h2 className="text-xl font-bold">FinTrack</h2>
            <p className="text-xs text-gray-500">
              Personal Finance
            </p>
          </div>
        </div>

        <p className="mt-6 text-sm leading-7 text-gray-400">
          FinTrack es una aplicación de finanzas personales diseñada
          para facilitar el registro y seguimiento de los ingresos,
          gastos y ahorros. Su objetivo es ofrecer una herramienta
          práctica que permita organizar la información financiera
          y comprender mejor el manejo del dinero.
        </p>

        <p className="mt-4 text-sm leading-7 text-gray-400">
          El proyecto busca combinar una interfaz sencilla e intuitiva
          con herramientas que ayuden a tomar decisiones financieras
          de manera más organizada.
        </p>
      </section>

      {/* DESARROLLADOR */}
      <section className="rounded-2xl border border-white/10 bg-[#11111B] p-6 md:p-8">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <UserRound size={22} />
          </div>

          <div>
            <h2 className="text-lg font-bold">
              El desarrollador
            </h2>
            <p className="text-xs text-gray-500">
              Creador de FinTrack
            </p>
          </div>
        </div>

        <p className="text-sm leading-7 text-gray-400">
          FinTrack fue concebido y desarrollado como un proyecto
          personal por Santiago Soria, desde la planificación de sus funcionalidades
          hasta la implementación de su interfaz y su lógica.
        </p>

        <p className="mt-4 text-sm leading-7 text-gray-400">
          Durante el proceso se utilizó ChatGPT como asistente
          técnico para investigar, resolver problemas, revisar
          código y acompañar las distintas etapas de desarrollo.
          Las decisiones y la dirección del proyecto corresponden
          a su creador.
        </p>
      </section>

      {/* FILOSOFÍA */}
      <section className="rounded-2xl border border-white/10 bg-[#11111B] p-6 md:p-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
            <Lightbulb size={22} />
          </div>

          <h2 className="text-lg font-bold">
            El proceso de desarrollo
          </h2>
        </div>

        <p className="text-sm leading-7 text-gray-400">
          El desarrollo de FinTrack se realizó de manera progresiva,
          incorporando funcionalidades y realizando pruebas para
          comprobar su funcionamiento.
        </p>

        <p className="mt-4 text-sm leading-7 text-gray-400">
          Se priorizaron la organización del código, la persistencia
          de los datos, la seguridad de las cuentas y una experiencia
          de uso clara.
        </p>
      </section>

      {/* TECNOLOGÍAS */}
      <section className="rounded-2xl border border-white/10 bg-[#11111B] p-6 md:p-8">
        <div className="mb-6">
          <h2 className="text-lg font-bold">
            Tecnologías utilizadas
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Herramientas y tecnologías que forman parte del proyecto.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {technologies.map((technology) => {
            const Icon = technology.icon

            return (
              <div
                key={technology.name}
                className="rounded-xl border border-white/5 bg-white/[0.03] p-4"
              >
                <Icon size={22} className="mb-3 text-violet-400" />

                <h3 className="text-sm font-semibold text-white">
                  {technology.name}
                </h3>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  {technology.description}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* SEGURIDAD */}
      <section className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
        <div className="flex items-start gap-3">
          <ShieldCheck
            size={23}
            className="mt-0.5 shrink-0 text-emerald-400"
          />

          <div>
            <h3 className="font-semibold text-white">
              Seguridad y privacidad
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-400">
              FinTrack utiliza Supabase Auth y políticas de seguridad
              a nivel de base de datos para proteger la información
              y separar los registros de cada usuario.
            </p>
          </div>
        </div>
      </section>

      {/* PIE */}
      <div className="py-4 text-center">
        <div className="mb-2 flex justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white">
            <Wallet size={21} />
          </div>
        </div>

        <p className="text-sm font-semibold">
          Fin<span className="text-violet-400">Track</span>
        </p>

        <p className="mt-1 text-xs text-gray-500">
          Un proyecto construido con dedicación.
        </p>
      </div>

    </div>
  )
}
