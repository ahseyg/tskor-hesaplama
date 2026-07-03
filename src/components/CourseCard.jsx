import React from 'react';
import { calculateGrade } from '../utils/gradingLogic';

const CourseCard = ({ course, updateCourse, deleteCourse }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateCourse(course.id, name, value);
  };

  const results = calculateGrade(course);

  return (
    <div className="course-card">
      <div className="course-header">
        <input
          type="text"
          name="name"
          value={course.name}
          onChange={handleChange}
          placeholder="Ders Adı"
        />
        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginRight: '0.5rem' }}>AKTS:</label>
          <input
            type="number"
            className="akts-input"
            name="akts"
            value={course.akts}
            onChange={handleChange}
            min="1"
          />
        </div>
        <button className="delete-btn" onClick={() => deleteCourse(course.id)} title="Dersi Sil">×</button>
      </div>

      <div className="system-toggle">
        <button 
          className={course.gradingSystem === 'sabit' ? 'active' : ''}
          onClick={() => updateCourse(course.id, 'gradingSystem', 'sabit')}
        >
          Sabit Harf
        </button>
        <button 
          className={course.gradingSystem === 'bagil' ? 'active' : ''}
          onClick={() => updateCourse(course.id, 'gradingSystem', 'bagil')}
        >
          Bağıl Çan (T-Skor)
        </button>
      </div>

      {/* Grid Headers */}
      <div className="grade-row" style={{ marginTop: '0.5rem' }}>
        <div style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Bileşen</div>
        <div style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Ağırlık (%)</div>
        <div style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Notun</div>
        <div style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Sınıf Ort.</div>
      </div>

      <div className="grade-row">
        <label>Quiz/Ödev/Lab</label>
        <input type="number" name="qLabWeight" value={course.qLabWeight} onChange={handleChange} placeholder="%" />
        <input type="number" name="qLabGrade" value={course.qLabGrade} onChange={handleChange} placeholder="Not" />
        <input type="number" name="qLabClassAvg" value={course.qLabClassAvg} onChange={handleChange} placeholder="Ort" />
      </div>

      <div className="grade-row">
        <label>Vize</label>
        <input type="number" name="vizeWeight" value={course.vizeWeight} onChange={handleChange} placeholder="%" />
        <input type="number" name="vizeGrade" value={course.vizeGrade} onChange={handleChange} placeholder="Not" />
        <input type="number" name="vizeClassAvg" value={course.vizeClassAvg} onChange={handleChange} placeholder="Ort" />
      </div>

      <div className="grade-row">
        <label>Final</label>
        <input type="number" name="finalWeight" value={course.finalWeight} onChange={handleChange} placeholder="%" />
        <input type="number" name="finalGrade" value={course.finalGrade} onChange={handleChange} placeholder="Not" />
        <input type="number" name="finalClassAvg" value={course.finalClassAvg} onChange={handleChange} placeholder="Ort" />
      </div>

      {course.gradingSystem === 'bagil' && (
        <div className="std-dev-section">
          <label>Sapma (S.S.):</label>
          <select name="stdDevMode" value={course.stdDevMode} onChange={handleChange}>
            <option value="dusuk">Düşük S.S. (~10)</option>
            <option value="orta">Orta S.S. (~15)</option>
            <option value="yuksek">Yüksek S.S. (~20)</option>
            <option value="manuel">Manuel Gir</option>
          </select>
          {course.stdDevMode === 'manuel' && (
            <input 
              type="number" 
              name="manualStdDev" 
              value={course.manualStdDev} 
              onChange={handleChange} 
              placeholder="Örn: 13" 
              style={{ width: '80px' }}
            />
          )}
        </div>
      )}

      <div className="results-section">
        <div className="result-item">
          <span className="label">Ortalamanız</span>
          <span className="value">{results.studentAvg}</span>
        </div>
        
        {course.gradingSystem === 'bagil' && (
          <>
            <div className="result-item">
              <span className="label">Sınıf Ort.</span>
              <span className="value">{results.classAvg}</span>
            </div>
            <div className="result-item">
              <span className="label">T-Skoru</span>
              <span className="value">{results.tScore}</span>
            </div>
          </>
        )}

        <div className="result-item">
          <span className="label">Harf Notu</span>
          <span className={`value letter-grade ${results.letterGrade === 'FF' ? 'FF' : ''}`}>
            {results.letterGrade}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
