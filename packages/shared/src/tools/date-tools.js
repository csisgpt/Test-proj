/*import moment from "jalali-moment";

export default {
    convertToJalali: (date$) => date$ && moment(date$, "YYYY/MM/DD").locale("fa").format("YYYY/MM/DD"),
    convertToMiladi: (date) => date && moment(date, "jYYYY-jMM-jDD").locale("en").format("YYYY-MM-DD")
}*/

import moment from "jalali-moment";

export const convertToJalali = (dateStr, showTime = false) => {
  const format = showTime ? "YYYY/MM/DD HH:mm" : "YYYY/MM/DD";
  let m = moment(dateStr, format);
  if (!dateStr || dateStr == "") return "";
  m.locale("en");
  if (m.isValid()) return m.locale("fa").format(format);
  return "";
};
export const convertToMiladi = (date) =>
  date && moment(date, "jYYYY-jMM-jDD").locale("en").format("YYYY-MM-DD");
export const currentMiladiDate = () => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  return yyyy + "/" + mm + "/" + dd;
};
export const currentJaliliDate = () => {
  return convertToJalali(currentMiladiDate());
};

export const elapsedTime = (
  start_date,
  steps = 2,
  end_date = new Date(),
  hasLastStr = true
) => {
  start_date = moment(start_date, "YYYY-MM-DD HH:mm:ss");
  end_date = moment(end_date, "YYYY-MM-DD HH:mm:ss");
  // calculate the elapsed time between the start and end dates with momentJs
  let elapsed_time = moment.duration(end_date.diff(start_date)).locale("fa");

  const timeLabels = [
    { name: "years", label: "سال", max: 0, overflow: 0 },
    { name: "months", label: "ماه", max: 12, overflow: 9 },
    { name: "weeks", label: "هفته", max: 4, overflow: 3 },
    { name: "days", label: "روز", max: 7, overflow: 4 },
    { name: "hours", label: "ساعت", max: 24, overflow: 18 },
    { name: "minutes", label: "دقیقه", max: 60, overflow: 45 },
    { name: "seconds", label: "ثانیه", max: 60, overflow: 45 },
  ];

  let weekLength = 0;
  let nextElapsed = 0;
  let negative = false;
  function calcDaysFromWeek(days, weekLength) {
    return parseInt(Math.abs(days)) - weekLength * 7;
  }
  for (let i = 0; i < timeLabels.length; i++) {
    const label = timeLabels[i];
    let elapsed = elapsed_time[label.name]();
    if (elapsed < 0) {
      negative = true;
      elapsed = Math.abs(elapsed);
    }
    timeLabels[i].elapsed = elapsed;
    if (elapsed !== 0) {
      if (label.name == "weeks") {
        weekLength = elapsed;
      }
      if (label.name == "days" && weekLength > 0)
        elapsed = calcDaysFromWeek(elapsed, weekLength);
      if (timeLabels[i + 1])
        nextElapsed =
          label.name == "weeks"
            ? calcDaysFromWeek(
                elapsed_time[timeLabels[i + 1].name](),
                weekLength
              )
            : elapsed_time[timeLabels[i + 1].name]();
      nextElapsed = Math.abs(nextElapsed);
      if (
        timeLabels.filter((i) => i.elapsed > 0)?.length === steps &&
        timeLabels[i + 1] &&
        nextElapsed >= timeLabels[i + 1].overflow
      ) {
        elapsed++;
      }
    }
    timeLabels[i].elapsed = elapsed;
  }
  for (let i = timeLabels.length - 1; i > 0; i--) {
    const label = timeLabels[i];
    let elapsed = label.elapsed ?? 0;
    if (elapsed !== 0) {
      if (label.max > 0 && elapsed >= label.max && timeLabels[i - 1]) {
        timeLabels[i - 1].elapsed++;
        elapsed = 0;
        if (steps > 1) steps--;
      }
      timeLabels[i].elapsed = elapsed;
    }
  }
  const elapsed_time_arr = timeLabels
    .filter((i) => i.elapsed != 0)
    .map((i) => `${i.elapsed} ${i.label}`);

  //console.log(timeLabels, elapsed_time_arr);
  elapsed_time_arr.splice(steps);
  let result_str = elapsed_time_arr.join(" و ");
  const ext = hasLastStr ? " " + (negative ? "بعد" : "پیش") : "";
  if (Math.abs(elapsed_time.asSeconds()) < 60 && hasLastStr)
    return "لحظاتی" + ext;
  return result_str + ext;
};
