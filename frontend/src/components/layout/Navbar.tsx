// navbar comp
import { useNavigate } from "react-router-dom";
import { Button } from "../ui";

export function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
      <div className="flex items-center gap-2">
        <span className="text-l font-bold tracking-tight text-white">
          <span className="text-3xl">1</span>forge
        </span>
      </div>

      <Button
        variant="ghost"
        className="text-white opacity-70 hover:text-white hover:bg-white/10"
        onClick={() => navigate("/login")}
      >
        Sign In
      </Button>
    </nav>
  );
}
