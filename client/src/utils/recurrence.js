export function buildRRule({
  recurrenceRule,
  recurrenceDays,
  recurrenceStart,
  recurrenceEnd,
  dueTime
}) {
  if (!recurrenceRule) return null;

  const baseDate = recurrenceStart
    ? new Date(recurrenceStart)
    : new Date();

  let hours = 0;
  let minutes = 0;

  if (dueTime) {
    const [h, m] = dueTime.split(":");
    hours = Number(h);
    minutes = Number(m);
  }

  baseDate.setHours(hours, minutes, 0, 0);

  const dtstart =
    baseDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  let rule = `DTSTART:${dtstart}`;

  if (recurrenceRule === "daily") {
    rule += ";FREQ=DAILY";
  }

  if (recurrenceRule === "weekly") {
    const map = {
      monday: "MO",
      tuesday: "TU",
      wednesday: "WE",
      thursday: "TH",
      friday: "FR",
      saturday: "SA",
      sunday: "SU"
    };

    const byday = (recurrenceDays || []).map(d => map[d]).filter(Boolean);

    rule += `;FREQ=WEEKLY${byday.length ? `;BYDAY=${byday.join(",")}` : ""}`;
  }

  if (recurrenceRule === "monthly") {
    // KEY IDEA:
    // date picker already defines the day-of-month
    const day = baseDate.getDate();
    rule += `;FREQ=MONTHLY;BYMONTHDAY=${day}`;
  }

  if (recurrenceEnd) {
    const until =
      new Date(recurrenceEnd)
        .toISOString()
        .replace(/[-:]/g, "")
        .split(".")[0] + "Z";

    rule += `;UNTIL=${until}`;
  }

  return rule;
}