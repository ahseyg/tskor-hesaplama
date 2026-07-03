export const calculateGrade = (course) => {
  const {
    gradingSystem,
    qLabWeight, qLabGrade, qLabClassAvg,
    vizeWeight, vizeGrade, vizeClassAvg,
    finalWeight, finalGrade, finalClassAvg
  } = course;

  const qWeight = Number(qLabWeight) || 0;
  const vWeight = Number(vizeWeight) || 0;
  const fWeight = Number(finalWeight) || 0;
  
  const qGrade = Number(qLabGrade);
  const vGrade = Number(vizeGrade);
  const fGrade = Number(finalGrade);

  const qClassAvg = Number(qLabClassAvg);
  const vClassAvg = Number(vizeClassAvg);
  const fClassAvg = Number(finalClassAvg);

  // ANO (Anlık Not Ortalaması) Calculation
  let totalStudentWeight = 0;
  let weightedStudentSum = 0;

  if (qLabGrade !== "") {
    totalStudentWeight += qWeight;
    weightedStudentSum += qGrade * qWeight;
  }
  if (vizeGrade !== "") {
    totalStudentWeight += vWeight;
    weightedStudentSum += vGrade * vWeight;
  }
  if (finalGrade !== "") {
    totalStudentWeight += fWeight;
    weightedStudentSum += fGrade * fWeight;
  }

  const studentAvg = totalStudentWeight > 0 ? (weightedStudentSum / totalStudentWeight) : 0;

  // Class ANO Calculation
  let totalClassWeight = 0;
  let weightedClassAvgSum = 0;

  if (qLabClassAvg !== "") {
    totalClassWeight += qWeight;
    weightedClassAvgSum += qClassAvg * qWeight;
  }
  if (vizeClassAvg !== "") {
    totalClassWeight += vWeight;
    weightedClassAvgSum += vClassAvg * vWeight;
  }
  if (finalClassAvg !== "") {
    totalClassWeight += fWeight;
    weightedClassAvgSum += fClassAvg * fWeight;
  }

  const classAvg = totalClassWeight > 0 ? (weightedClassAvgSum / totalClassWeight) : 0;

  // Helper to calculate letter from raw T-score
  const getLetterGrade = (tScore, cAvg, sAvg, isSabit) => {
    // Automatic FF if Final is entered and less than 35
    if (finalGrade !== "" && fGrade < 35) {
      return "FF";
    }

    if (isSabit) {
      if (sAvg >= 90) return "AA";
      if (sAvg >= 80) return "BA";
      if (sAvg >= 75) return "BB";
      if (sAvg >= 70) return "CB";
      if (sAvg >= 65) return "CC";
      if (sAvg >= 60) return "DC";
      if (sAvg >= 55) return "DD";
      if (sAvg >= 35) return "FD";
      return "FF";
    } else {
      let classAvgAdjustment = -8;
      if (cAvg >= 70) classAvgAdjustment = 4;
      else if (cAvg >= 62.5) classAvgAdjustment = 2;
      else if (cAvg >= 57.5) classAvgAdjustment = 0;
      else if (cAvg >= 52.5) classAvgAdjustment = -2;
      else if (cAvg >= 47.5) classAvgAdjustment = -4;
      else if (cAvg >= 42.5) classAvgAdjustment = -6;

      const adjT = tScore + classAvgAdjustment;

      if (adjT >= 73) return "AA";
      if (adjT >= 68) return "BA";
      if (adjT >= 63) return "BB";
      if (adjT >= 58) return "CB";
      if (adjT >= 53) return "CC";
      if (adjT >= 48) return "DC";
      if (adjT >= 43) return "DD";
      return "FF";
    }
  };

  const results = {
    isEmpty: totalStudentWeight === 0,
    studentAvg: studentAvg.toFixed(2),
    classAvg: classAvg.toFixed(2),
    letterGrades: {
      sabit: "-",
      low: "-",
      med: "-",
      high: "-"
    }
  };

  if (totalStudentWeight === 0) {
    return results;
  }

  if (gradingSystem === "sabit") {
    results.letterGrades.sabit = getLetterGrade(null, classAvg, studentAvg, true);
  } else {
    // Calculate T-Scores for 3 deviations (10, 15, 20)
    const tLow = ((studentAvg - classAvg) / 10) * 10 + 60;
    const tMed = ((studentAvg - classAvg) / 15) * 10 + 60;
    const tHigh = ((studentAvg - classAvg) / 20) * 10 + 60;

    results.letterGrades.low = getLetterGrade(tLow, classAvg, studentAvg, false);
    results.letterGrades.med = getLetterGrade(tMed, classAvg, studentAvg, false);
    results.letterGrades.high = getLetterGrade(tHigh, classAvg, studentAvg, false);
  }

  return results;
};

export const getGradeMultiplier = (letterGrade) => {
  const mapping = {
    "AA": 4.0,
    "BA": 3.5,
    "BB": 3.0,
    "CB": 2.5,
    "CC": 2.0,
    "DC": 1.5,
    "DD": 1.0,
    "FD": 0.5,
    "FF": 0.0
  };
  return mapping[letterGrade] || 0.0;
};
