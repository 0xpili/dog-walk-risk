import { describe, expect, it } from "vitest";
import { assessWalk, humidityLevel, tuftsScore } from "./walk.ts";

/** °F to °C, so a test can name the Tufts tick exactly. */
function celsius(fahrenheit: number): number {
  return ((fahrenheit - 32) * 5) / 9;
}

describe("Tufts medium/large walk score", () => {
  it("is low at 60 °F (score 1)", () => {
    expect(tuftsScore(celsius(60))).toBe(1);
    expect(assessWalk(celsius(60), 30).level).toBe("green");
  });

  it("is caution at 75 °F (score 3)", () => {
    expect(tuftsScore(celsius(75))).toBe(3);
    expect(assessWalk(celsius(75), 20).level).toBe("yellow");
  });

  it("is high at 80 °F (score 4) and 85 °F (score 5)", () => {
    expect(tuftsScore(celsius(80))).toBe(4);
    expect(assessWalk(celsius(80), 10).level).toBe("red");
    expect(tuftsScore(celsius(85))).toBe(5);
    expect(assessWalk(celsius(85), 10).level).toBe("red");
  });

  it("is caution at 20 °F (score 3) and high at −10 °F (score 4)", () => {
    expect(tuftsScore(celsius(20))).toBe(3);
    expect(assessWalk(celsius(20), 40).level).toBe("yellow");
    expect(tuftsScore(celsius(-10))).toBe(4);
    expect(assessWalk(celsius(-10), 40).level).toBe("red");
  });
});

describe("humidity rule on top of Tufts", () => {
  it("raises a low Tufts score to caution when °F + humidity is over 150", () => {
    // 65 °F is Tufts score 2 (low). 65 + 90 = 155.
    expect(tuftsScore(celsius(65))).toBe(2);
    expect(humidityLevel(celsius(65), 90)).toBe("yellow");
    expect(assessWalk(celsius(65), 90).level).toBe("yellow");
  });

  it("is high when °F + humidity is over 180", () => {
    expect(humidityLevel(30, 100)).toBe("red");
    expect(assessWalk(30, 100).level).toBe("red");
  });

  it("does not lower a higher Tufts score", () => {
    expect(assessWalk(celsius(80), 10).level).toBe("red");
  });
});
