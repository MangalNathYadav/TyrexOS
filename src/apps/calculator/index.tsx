"use client";

import { useState, useEffect } from "react";
import { Plus, Minus, X, Divide, Delete, Equal, Percent } from "lucide-react";

export default function CalculatorApp() {
  const [display, setDisplay] = useState("0");
  const [equation, setEquation] = useState("");
  const [isFinished, setIsFinished] = useState(false);

  const handleNumber = (num: string) => {
    if (display === "0" || isFinished) {
      setDisplay(num);
      setIsFinished(false);
    } else {
      setDisplay(display + num);
    }
  };

  const handleDecimal = () => {
    if (isFinished) {
      setDisplay("0.");
      setIsFinished(false);
      return;
    }
    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const handleOperator = (op: string) => {
    setEquation(display + " " + op + " ");
    setIsFinished(true);
  };

  const handleClear = () => {
    setDisplay("0");
    setEquation("");
    setIsFinished(false);
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay("0");
    }
  };

  const handlePercent = () => {
    try {
      const val = parseFloat(display);
      setDisplay((val / 100).toString());
    } catch {
      setDisplay("Error");
    }
  };

  const handleEqual = () => {
    if (!equation) return;
    const fullEq = equation + display;
    try {
      // Safe execution using basic algebraic parsing to prevent eval vulnerabilities
      const parts = fullEq.split(" ");
      if (parts.length < 3) return;
      const num1 = parseFloat(parts[0]);
      const op = parts[1];
      const num2 = parseFloat(parts[2]);

      let result = 0;
      switch (op) {
        case "+":
          result = num1 + num2;
          break;
        case "-":
          result = num1 - num2;
          break;
        case "×":
        case "*":
          result = num1 * num2;
          break;
        case "÷":
        case "/":
          result = num2 !== 0 ? num1 / num2 : 0;
          break;
        default:
          return;
      }
      
      // Limit decimal spots cleanly
      const rounded = Math.round(result * 1000000) / 1000000;
      setDisplay(rounded.toString());
      setEquation("");
      setIsFinished(true);
    } catch {
      setDisplay("Error");
    }
  };

  // Keyboard Event Listeners for native operating system integration
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      if (/[0-9]/.test(key)) {
        handleNumber(key);
      } else if (key === ".") {
        handleDecimal();
      } else if (key === "+" || key === "-") {
        handleOperator(key);
      } else if (key === "*") {
        handleOperator("×");
      } else if (key === "/") {
        handleOperator("÷");
      } else if (key === "Enter" || key === "=") {
        handleEqual();
      } else if (key === "Escape" || key === "c" || key === "C") {
        handleClear();
      } else if (key === "Backspace") {
        handleBackspace();
      } else if (key === "%") {
        handlePercent();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [display, equation, isFinished]);

  return (
    <div className="flex flex-col h-full bg-[var(--color-app-bg)] text-[var(--color-app-text)] font-sans select-none rounded-b-lg p-5 justify-between">
      {/* Display Panel */}
      <div className="bg-[var(--color-input-bg)] border border-[var(--color-glass-border)] rounded-2xl p-4 flex flex-col items-end justify-between min-h-[96px] shadow-inner mb-4 relative overflow-hidden">
        <div className="absolute top-1 left-2 h-1.5 w-1.5 rounded-full bg-[var(--color-cyber-blue)] animate-pulse"></div>
        
        {/* Helper Equation Preview */}
        <span className="text-xs font-mono text-[var(--color-app-text-secondary)] tracking-wider h-5 block">
          {equation}
        </span>
        
        {/* Main Display Value */}
        <span className="text-3xl font-bold font-mono tracking-tight text-[var(--color-app-text)] truncate max-w-full drop-shadow">
          {display}
        </span>
      </div>

      {/* Buttons Grid */}
      <div className="grid grid-cols-4 gap-3 flex-1">
        {/* Row 1 */}
        <button
          onClick={handleClear}
          className="rounded-xl border border-red-500/20 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 font-semibold font-mono text-sm transition-all duration-150 flex items-center justify-center cursor-pointer active:scale-95"
        >
          C
        </button>
        <button
          onClick={handleBackspace}
          className="rounded-xl border border-[var(--color-glass-border)] bg-[var(--color-input-bg)] hover:bg-white/10 text-[var(--color-app-text-secondary)] font-semibold transition-all duration-150 flex items-center justify-center cursor-pointer active:scale-95"
        >
          <Delete className="h-4 w-4" />
        </button>
        <button
          onClick={handlePercent}
          className="rounded-xl border border-[var(--color-glass-border)] bg-[var(--color-input-bg)] hover:bg-white/10 text-[var(--color-app-text-secondary)] font-semibold transition-all duration-150 flex items-center justify-center cursor-pointer active:scale-95"
        >
          <Percent className="h-4 w-4" />
        </button>
        <button
          onClick={() => handleOperator("÷")}
          className="rounded-xl border border-[var(--color-glass-border)] bg-[var(--color-cyber-blue)]/25 hover:bg-[var(--color-cyber-blue)] hover:text-white text-[var(--color-cyber-blue)] font-semibold transition-all duration-150 flex items-center justify-center cursor-pointer active:scale-95"
        >
          <Divide className="h-4 w-4" />
        </button>

        {/* Row 2 */}
        <button
          onClick={() => handleNumber("7")}
          className="rounded-xl border border-[var(--color-glass-border)] bg-[var(--color-input-bg)]/40 hover:bg-white/5 font-semibold text-sm transition-all duration-150 flex items-center justify-center cursor-pointer active:scale-95"
        >
          7
        </button>
        <button
          onClick={() => handleNumber("8")}
          className="rounded-xl border border-[var(--color-glass-border)] bg-[var(--color-input-bg)]/40 hover:bg-white/5 font-semibold text-sm transition-all duration-150 flex items-center justify-center cursor-pointer active:scale-95"
        >
          8
        </button>
        <button
          onClick={() => handleNumber("9")}
          className="rounded-xl border border-[var(--color-glass-border)] bg-[var(--color-input-bg)]/40 hover:bg-white/5 font-semibold text-sm transition-all duration-150 flex items-center justify-center cursor-pointer active:scale-95"
        >
          9
        </button>
        <button
          onClick={() => handleOperator("×")}
          className="rounded-xl border border-[var(--color-glass-border)] bg-[var(--color-cyber-blue)]/25 hover:bg-[var(--color-cyber-blue)] hover:text-white text-[var(--color-cyber-blue)] font-semibold transition-all duration-150 flex items-center justify-center cursor-pointer active:scale-95"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Row 3 */}
        <button
          onClick={() => handleNumber("4")}
          className="rounded-xl border border-[var(--color-glass-border)] bg-[var(--color-input-bg)]/40 hover:bg-white/5 font-semibold text-sm transition-all duration-150 flex items-center justify-center cursor-pointer active:scale-95"
        >
          4
        </button>
        <button
          onClick={() => handleNumber("5")}
          className="rounded-xl border border-[var(--color-glass-border)] bg-[var(--color-input-bg)]/40 hover:bg-white/5 font-semibold text-sm transition-all duration-150 flex items-center justify-center cursor-pointer active:scale-95"
        >
          5
        </button>
        <button
          onClick={() => handleNumber("6")}
          className="rounded-xl border border-[var(--color-glass-border)] bg-[var(--color-input-bg)]/40 hover:bg-white/5 font-semibold text-sm transition-all duration-150 flex items-center justify-center cursor-pointer active:scale-95"
        >
          6
        </button>
        <button
          onClick={() => handleOperator("-")}
          className="rounded-xl border border-[var(--color-glass-border)] bg-[var(--color-cyber-blue)]/25 hover:bg-[var(--color-cyber-blue)] hover:text-white text-[var(--color-cyber-blue)] font-semibold transition-all duration-150 flex items-center justify-center cursor-pointer active:scale-95"
        >
          <Minus className="h-4 w-4" />
        </button>

        {/* Row 4 */}
        <button
          onClick={() => handleNumber("1")}
          className="rounded-xl border border-[var(--color-glass-border)] bg-[var(--color-input-bg)]/40 hover:bg-white/5 font-semibold text-sm transition-all duration-150 flex items-center justify-center cursor-pointer active:scale-95"
        >
          1
        </button>
        <button
          onClick={() => handleNumber("2")}
          className="rounded-xl border border-[var(--color-glass-border)] bg-[var(--color-input-bg)]/40 hover:bg-white/5 font-semibold text-sm transition-all duration-150 flex items-center justify-center cursor-pointer active:scale-95"
        >
          2
        </button>
        <button
          onClick={() => handleNumber("3")}
          className="rounded-xl border border-[var(--color-glass-border)] bg-[var(--color-input-bg)]/40 hover:bg-white/5 font-semibold text-sm transition-all duration-150 flex items-center justify-center cursor-pointer active:scale-95"
        >
          3
        </button>
        <button
          onClick={() => handleOperator("+")}
          className="rounded-xl border border-[var(--color-glass-border)] bg-[var(--color-cyber-blue)]/25 hover:bg-[var(--color-cyber-blue)] hover:text-white text-[var(--color-cyber-blue)] font-semibold transition-all duration-150 flex items-center justify-center cursor-pointer active:scale-95"
        >
          <Plus className="h-4 w-4" />
        </button>

        {/* Row 5 */}
        <button
          onClick={() => handleNumber("0")}
          className="col-span-2 rounded-xl border border-[var(--color-glass-border)] bg-[var(--color-input-bg)]/40 hover:bg-white/5 font-semibold text-sm transition-all duration-150 flex items-center justify-center cursor-pointer active:scale-95"
        >
          0
        </button>
        <button
          onClick={handleDecimal}
          className="rounded-xl border border-[var(--color-glass-border)] bg-[var(--color-input-bg)]/40 hover:bg-white/5 font-bold text-sm transition-all duration-150 flex items-center justify-center cursor-pointer active:scale-95"
        >
          .
        </button>
        <button
          onClick={handleEqual}
          className="rounded-xl border border-[var(--color-glass-border)] bg-gradient-to-r from-[var(--color-cyber-purple)] to-[var(--color-cyber-blue)] text-white hover:brightness-110 font-semibold transition-all duration-150 flex items-center justify-center cursor-pointer active:scale-95 shadow-[0_0_12px_rgba(124,93,250,0.3)]"
        >
          <Equal className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
