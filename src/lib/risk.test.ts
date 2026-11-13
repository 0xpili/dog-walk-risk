import { describe, expect, it } from "vitest";
import { assess } from "./risk.ts";

describe("apparent temperature chart", () => {
  it("reads 0% / 5 °C as 1 °C green", () => {
    const result = assess(5, 0);
    expect(result.apparentC).toBe(1);
    expect(result.level).toBe("green");
    expect(result.band).toBe("table");
  });

  it("reads 50% / 22 °C as 22 °C red", () => {
    const result = assess(22, 50);
    expect(result.apparentC).toBe(22);
    expect(result.level).toBe("red");
  });

  it("reads 100% / 22 °C as 27 °C red", () => {
    const result = assess(22, 100);
    expect(result.apparentC).toBe(27);
    expect(result.level).toBe("red");
  });

  it("reads 45% / 15 °C as 13.5 °C yellow", () => {
    const result = assess(15, 45);
    expect(result.apparentC).toBe(13.5);
    expect(result.level).toBe("yellow");
  });

  it("matches the worked examples in the mushing rules", () => {
    const fullDistance = assess(10, 45);
    expect(fullDistance.apparentC).toBe(7.5);
    expect(fullDistance.level).toBe("green");

    const shortened = assess(16, 85);
    expect(shortened.apparentC).toBe(16.5);
    expect(shortened.level).toBe("yellow");
  });

  it("rounds temperature to 1 °C and humidity to 5%", () => {
    const result = assess(14.6, 47);
    expect(result.roundedTempC).toBe(15);
    expect(result.roundedHumidity).toBe(45);
    expect(result.apparentC).toBe(13.5);
    expect(result.level).toBe("yellow");
  });
});

describe("above the chart", () => {
  it("keeps 23 °C and 25 °C at 50% at least red", () => {
    expect(assess(23, 50).level).toBe("red");
    expect(assess(25, 50).level).toBe("red");
  });

  it("does not let risk or apparent temperature fall as the air gets hotter", () => {
    const at22 = assess(22, 0);
    const at23 = assess(23, 0);
    const at30 = assess(30, 0);
    expect(at22.level).toBe("yellow");
    expect(at23.level).toBe("yellow");
    expect(at23.apparentC).toBeGreaterThanOrEqual(at22.apparentC ?? 0);
    expect(at30.level).toBe("red");
    expect(at30.apparentC).toBeGreaterThanOrEqual(at22.apparentC ?? 0);
  });
});

describe("below the chart", () => {
  it("marks 0 to 4 °C as caution and deep cold as high risk", () => {
    expect(assess(3, 40).level).toBe("yellow");
    expect(assess(3, 40).band).toBe("cold");
    expect(assess(0, 50).level).toBe("yellow");
    expect(assess(-2, 60).level).toBe("yellow");
    expect(assess(-8, 40).level).toBe("red");
  });
});
