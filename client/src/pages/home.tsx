// client/src/pages/home.tsx
import { Skull, UserCircle, Users, FileText, Dice6 } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const tools = [
    {
      title: "Combat Tracker",
      description: "Gestiona encuentros de combate con iniciativa y seguimiento de personajes",
      icon: <Skull className="h-8 w-8 text-[#B91C1C]" />,
      href: "/combat-tracker"
    },
    {
      title: "Ficha de Jugador",
      description: "Crea y gestiona fichas para personajes jugadores",
      icon: <UserCircle className="h-8 w-8 text-[#B91C1C]" />,
      href: "/player-sheet"
    },
    {
      title: "Ficha de NPC",
      description: "Diseña personajes no jugadores para tus aventuras",
      icon: <Users className="h-8 w-8 text-[#B91C1C]" />,
      href: "/npc-sheet"
    },
    {
      title: "Fichas Guardadas",
      description: "Accede a todas tus fichas de personajes creadas",
      icon: <FileText className="h-8 w-8 text-[#B91C1C]" />,
      href: "/saved-sheets"
    },
    {
      title: "Tirador de Dados",
      description: "Lanza dados virtuales para resolver acciones y chequeos",
      icon: <Dice6 className="h-8 w-8 text-[#B91C1C]" />,
      href: "/dice-roller"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F3F4F6] p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-4">
            <Skull className="h-10 w-10 text-[#B91C1C] mr-2" />
            <h1 className="text-3xl font-bold text-[#111827]">
              Pathfinder 1 Edition Utilities
            </h1>
          </div>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Herramientas esenciales para jugadores y directores de juego de Pathfinder 1ª Edición
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link key={tool.title} href={tool.href}>
              <a className="block h-full transition-transform hover:scale-105">
                <Card className="h-full border shadow-md hover:shadow-lg">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      {tool.icon}
                      <CardTitle className="text-xl">{tool.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm text-gray-600">
                      {tool.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}