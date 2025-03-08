// client/src/pages/dice-roller.tsx
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function DiceRoller() {
  return (
    <div className="min-h-screen bg-[#F3F4F6] p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-[#111827]">
            Tirador de Dados
          </h1>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-500">Esta función estará disponible próximamente.</p>
        </div>
      </div>
    </div>
  );
}