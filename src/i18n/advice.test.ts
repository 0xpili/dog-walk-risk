import { describe, expect, it } from "vitest";
import { assess } from "../lib/risk.ts";
import { exerciseCopy, walkCopy } from "./advice.ts";

describe("exercise tips", () => {
  it("uses the exercise sentence on a hot red day, not the walk tip", () => {
    const sport = assess(30, 40);
    const exercise = exerciseCopy("es", sport);
    const walk = walkCopy("es", 30, "red", false);

    expect(exercise.title).toBe("Mejor corto");
    expect(exercise.tip).toBe("Hoy no es día para correr. Mejor un juego tranquilo y corto a la sombra.");
    expect(exercise.tip).not.toBe(walk.tip);
  });

  it("keeps the walk tip unchanged", () => {
    expect(walkCopy("es", 24, "yellow", false).tip).toBe(
      "Hacé paseos más cortos y tranquilos, buscá sombra y llevá agua.",
    );
  });
});
