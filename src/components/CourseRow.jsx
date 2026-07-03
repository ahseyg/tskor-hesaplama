import React from 'react';
import { calculateGrade } from '../utils/gradingLogic';

const CourseRow = ({ course, updateCourse, deleteCourse }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateCourse(course.id, name, value);
  };

  const results = calculateGrade(course);
  const isSabit = course.gradingSystem === 'sabit';

  const totalWeight = (Number(course.qLabWeight) || 0) + (Number(course.vizeWeight) || 0) + (Number(course.finalWeight) || 0);
  const isWeightError = totalWeight !== 100;
  const weightInputClass = `num-input ${isWeightError ? 'input-error' : ''}`;

  return (
    <tr>
      <td data-label="Ders Adı">
        <input
          type="text"
          className="text-input"
          name="name"
          value={course.name}
          onChange={handleChange}
          placeholder="Ders Kodu"
        />
      </td>
      <td data-label="AKTS">
        <input
          type="number"
          className="num-input"
          name="akts"
          value={course.akts}
          onChange={handleChange}
          min="1"
        />
      </td>
      
      {/* Sistem */}
      <td data-label="Hesaplama Sistemi">
        <select className="sys-select" name="gradingSystem" value={course.gradingSystem} onChange={handleChange} title="Bağıl Çan / Sabit Harf">
          <option value="bagil">Çan</option>
          <option value="sabit">Sabit</option>
        </select>
      </td>
      
      {/* Quiz */}
      <td data-label="Quiz/Ödev %">
        <input type="number" className={weightInputClass} name="qLabWeight" value={course.qLabWeight} onChange={handleChange} title={isWeightError ? "Ağırlıkların toplamı 100 olmalı!" : ""} />
      </td>
      <td data-label="Quiz/Ödev Notu">
        <input type="number" className="num-input" name="qLabGrade" value={course.qLabGrade} onChange={handleChange} />
      </td>
      <td data-label="Quiz/Ödev Sınıf Ort.">
        <input type="number" className="num-input" name="qLabClassAvg" value={course.qLabClassAvg} onChange={handleChange} />
      </td>

      {/* Vize */}
      <td data-label="Vize %">
        <input type="number" className={weightInputClass} name="vizeWeight" value={course.vizeWeight} onChange={handleChange} title={isWeightError ? "Ağırlıkların toplamı 100 olmalı!" : ""} />
      </td>
      <td data-label="Vize Notu">
        <input type="number" className="num-input" name="vizeGrade" value={course.vizeGrade} onChange={handleChange} />
      </td>
      <td data-label="Vize Sınıf Ort.">
        <input type="number" className="num-input" name="vizeClassAvg" value={course.vizeClassAvg} onChange={handleChange} />
      </td>

      {/* Final */}
      <td data-label="Final %">
        <input type="number" className={weightInputClass} name="finalWeight" value={course.finalWeight} onChange={handleChange} title={isWeightError ? "Ağırlıkların toplamı 100 olmalı!" : ""} />
      </td>
      <td data-label="Final Notu">
        <input type="number" className="num-input" name="finalGrade" value={course.finalGrade} onChange={handleChange} />
      </td>
      <td data-label="Final Sınıf Ort.">
        <input type="number" className="num-input" name="finalClassAvg" value={course.finalClassAvg} onChange={handleChange} />
      </td>

      {/* Results */}
      <td data-label="Senin Ortalaman" className={`result-text ${results.isEmpty ? 'dimmed' : ''}`}>{results.isEmpty ? '-' : results.studentAvg}</td>
      <td data-label="Sınıf Ortalaması" className={`result-text ${results.isEmpty ? 'dimmed' : ''}`}>{course.gradingSystem === 'bagil' ? (results.isEmpty ? '-' : results.classAvg) : '-'}</td>
      
      {/* 3 Harf Sütunu veya Sabit Harf */}
      {isSabit ? (
        <td data-label="Harf Notu" colSpan="3" className={`result-text letter-grade ${results.letterGrades.sabit} ${results.isEmpty ? 'dimmed' : ''}`}>
          {results.letterGrades.sabit}
        </td>
      ) : (
        <>
          <td data-label="Harf Notu (Düşük S.S.)" className={`result-text letter-grade ${results.letterGrades.low} ${results.isEmpty ? 'dimmed' : ''}`}>
            <span title="Düşük S.S. (10)">{results.letterGrades.low}</span>
          </td>
          <td data-label="Harf Notu (Orta S.S.)" className={`result-text letter-grade ${results.letterGrades.med} ${results.isEmpty ? 'dimmed' : ''}`}>
            <span title="Orta S.S. (15)">{results.letterGrades.med}</span>
          </td>
          <td data-label="Harf Notu (Yüksek S.S.)" className={`result-text letter-grade ${results.letterGrades.high} ${results.isEmpty ? 'dimmed' : ''}`}>
            <span title="Yüksek S.S. (20)">{results.letterGrades.high}</span>
          </td>
        </>
      )}
      
      <td data-label="İşlemler">
        <button className="delete-btn" onClick={() => deleteCourse(course.id)}>Sil</button>
      </td>
    </tr>
  );
};

export default CourseRow;
