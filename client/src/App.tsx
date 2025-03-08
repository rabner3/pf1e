// client/src/App.tsx
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import CombatTracker from "@/pages/combat-tracker";
import PlayerSheet from "@/pages/player-sheet";
import NpcSheet from "@/pages/npc-sheet";
import SavedSheets from "@/pages/saved-sheets";
import DiceRoller from "@/pages/dice-roller";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/combat-tracker" component={CombatTracker} />
      <Route path="/player-sheet" component={PlayerSheet} />
      <Route path="/npc-sheet" component={NpcSheet} />
      <Route path="/saved-sheets" component={SavedSheets} />
      <Route path="/dice-roller" component={DiceRoller} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;