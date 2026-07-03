import React from 'react';
import { calculateGrade } from '../utils/gradingLogic';

const CourseRow = ({ course, updateCourse, deleteCourse }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateCourse(course.id, name, value);
  };

  const results = calculateGrade(course);
  const isSabit = course.gradingSystem === 'sabit';

  return (
    <tr>
      <td>
        <input
          type="text"
          className="text-input"
          name="name"
          value={course.name}
          onChange={handleChange}
          placeholder="Ders Kodu"
        />
      </td>
      <td>
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
      <td>
        <select className="sys-select" name="gradingSystem" value={course.gradingSystem} onChange={handleChange} title="Bağıl Çan / Sabit Harf">
          <option value="bagil">Çan</option>
          <option value="sabit">Sabit</option>
        </select>
      </td>
      
      {/* Quiz */}
      <td>
        <input type="number" className="num-input" name="qLabWeight" value={course.qLabWeight} onChange={handleChange} />
      </td>
      <td>
        <input type="number" className="num-input" name="qLabGrade" value={course.qLabGrade} onChange={handleChange} />
      </td>
      <td>
        <input type="number" className="num-input" name="qLabClassAvg" value={course.qLabClassAvg} onChange={handleChange} />
      </td>

      {/* Vize */}
      <td>
        <input type="number" className="num-input" name="vizeWeight" value={course.vizeWeight} onChange={handleChange} />
      </td>
      <td>
        <input type="number" className="num-input" name="vizeGrade" value={course.vizeGrade} onChange={handleChange} />
      </td>
      <td>
        <input type="number" className="num-input" name="vizeClassAvg" value={course.vizeClassAvg} onChange={handleChange} />
      </td>

      {/* Final */}
      <td>
        <input type="number" className="num-input" name="finalWeight" value={course.finalWeight} onChange={handleChange} />
      </td>
      <td>
        <input type="number" className="num-input" name="finalGrade" value={course.finalGrade} onChange={handleChange} />
      </td>
      <td>
        <input type="number" className="num-input" name="finalClassAvg" value={course.finalClassAvg} onChange={handleChange} />
      </td>

      {/* Results */}
      <td className={`result-text ${results.isEmpty ? 'dimmed' : ''}`}>{results.isEmpty ? '-' : results.studentAvg}</td>
      <td className={`result-text ${results.isEmpty ? 'dimmed' : ''}`}>{course.gradingSystem === 'bagil' ? (results.isEmpty ? '-' : results.classAvg) : '-'}</td>
      
      {/* 3 Harf Sütunu veya Sabit Harf */}
      {isSabit ? (
        <td colSpan="3" className={`result-text letter-grade ${results.letterGrades.sabit} ${results.isEmpty ? 'dimmed' : ''}`}>
          {results.letterGrades.sabit}
        </td>
      ) : (
        <>
          <td className={`result-text letter-grade ${results.letterGrades.low} ${results.isEmpty ? 'dimmed' : ''}`}>
            <span title="Düşük S.S. (10)">{results.letterGrades.low}</span>
          </td>
          <td className={`result-text letter-grade ${results.letterGrades.med} ${results.isEmpty ? 'dimmed' : ''}`}>
            <span title="Orta S.S. (15)">{results.letterGrades.med}</span>
          </td>
          <td className={`result-text letter-grade ${results.letterGrades.high} ${results.isEmpty ? 'dimmed' : ''}`}>
            <span title="Yüksek S.S. (20)">{results.letterGrades.high}</span>
          </td>
        </>
      )}
      
      <td>
        <button className="delete-btn" onClick={() => deleteCourse(course.id)}>Sil</button>
      </td>
    </tr>
  );
};

export default CourseRow;
