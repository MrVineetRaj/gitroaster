import { formatCompactTime } from "../src/lib/utils";

test("formats summary correctly", () => {
  const formattedTime = formatCompactTime(5 * 60);
  console.log(formattedTime);
  expect(formattedTime).toBe("5m");
});