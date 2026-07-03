import { useState, useEffect, useRef } from 'react';
import './index.css';
import CourseRow from './components/CourseRow';
import Toast from './components/Toast';
import { calculateGrade, getGradeMultiplier } from './utils/gradingLogic';

function App() {
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('grade-calculator-courses');
    return saved ? JSON.parse(saved) : [];
  });

  const [prevStats, setPrevStats] = useState(() => {
    const saved = localStorage.getItem('grade-calculator-prev');
    return saved ? JSON.parse(saved) : { akts: '', agno: '' };
  });

  const [toast, setToast] = useState({ message: '', type: '' });
  const fileInputRef = useRef(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    localStorage.setItem('grade-calculator-courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('grade-calculator-prev', JSON.stringify(prevStats));
  }, [prevStats]);

  const addCourse = () => {
    const newCourse = {
      id: Date.now().toString(),
      name: '',
      akts: '6',
      gradingSystem: 'bagil',
      qLabWeight: '0', qLabGrade: '', qLabClassAvg: '',
      vizeWeight: '40', vizeGrade: '', vizeClassAvg: '',
      finalWeight: '60', finalGrade: '', finalClassAvg: ''
    };
    setCourses([...courses, newCourse]);
    showToast('Yeni ders eklendi.');
  };

  const updateCourse = (id, field, value) => {
    setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const deleteCourse = (id) => {
    setCourses(courses.filter(c => c.id !== id));
    showToast('Ders silindi.', 'error');
  };

  const exportData = () => {
    const exportObject = {
      _aciklama: "Bu yedek dosyasi Not & T-Skor Hesaplayici uygulamasina aittir. Düzenlerken virgüllere ve tirnak isaretlerine dikkat edin.",
      oncekiDonemler: prevStats,
      dersler: courses
    };
    const data = JSON.stringify(exportObject, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'notlarim-yedek.json';
    a.click();
    showToast('Veriler başarıyla dışa aktarıldı.', 'success');
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        // Destek eski yedek formati veya yeni format
        if (data.dersler || data.courses) setCourses(data.dersler || data.courses);
        if (data.oncekiDonemler || data.prevStats) setPrevStats(data.oncekiDonemler || data.prevStats);
        showToast('Veriler başarıyla içe aktarıldı.', 'success');
      } catch (err) {
        showToast('Geçersiz dosya formatı.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = null; // reset
  };

  const handlePrevChange = (e) => {
    const { name, value } = e.target;
    setPrevStats({ ...prevStats, [name]: value });
  };

  // Calculate Global Stats
  let currentAkts = 0;
  let currentPoints = 0;

  courses.forEach(course => {
    const aktsNum = Number(course.akts) || 0;
    const { letterGrades } = calculateGrade(course);
    
    // We'll use the 'medium' std dev letter for generic AGNO calculation 
    // if bagil, otherwise 'sabit'
    const letter = course.gradingSystem === 'sabit' ? letterGrades.sabit : letterGrades.med;

    if (letter && letter !== "Bekleniyor" && letter !== "FF" && letter !== "FD" && letter !== "-") {
      currentAkts += aktsNum;
      currentPoints += aktsNum * getGradeMultiplier(letter);
    } else if (letter === "FF" || letter === "FD") {
      currentAkts += aktsNum;
    }
  });

  const prevAkts = Number(prevStats.akts) || 0;
  const prevAgno = Number(prevStats.agno) || 0;
  
  const totalAkts = prevAkts + currentAkts;
  const totalPoints = (prevAkts * prevAgno) + currentPoints;
  const currentAno = currentAkts > 0 ? (currentPoints / currentAkts).toFixed(2) : "0.00";
  const globalAgno = totalAkts > 0 ? (totalPoints / totalAkts).toFixed(2) : "0.00";

  return (
    <div className="container">
      <header className="page-header">
        <div>
          <h1>Not & T-Skor Hesaplayıcı</h1>
          <p>Ders verilerini girin, harf notunuzu bağıl veya sabit sisteme göre otomatik hesaplayın.</p>
        </div>
        
        <div className="global-stats-container">
          <div className="header-actions-row">
            <div className="io-actions">
              <input 
                type="file" 
                accept=".json" 
                style={{ display: 'none' }} 
                ref={fileInputRef} 
                onChange={handleImport} 
              />
              <button className="btn-secondary btn-sm" onClick={() => fileInputRef.current.click()} title="Dışarıdan Veri Yükle">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                İçe Aktar
              </button>
              <button className="btn-secondary btn-sm" onClick={exportData} title="Verileri Yedekle">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Dışa Aktar
              </button>
            </div>

            <div className="prev-stats">
              <div>
                <label>Önceki AKTS:</label>
                <input type="number" name="akts" value={prevStats.akts} onChange={handlePrevChange} placeholder="Örn: 90" className="num-input small-input" />
              </div>
              <div>
                <label>Önceki AGNO:</label>
                <input type="number" name="agno" value={prevStats.agno} onChange={handlePrevChange} placeholder="Örn: 2.50" step="0.01" className="num-input small-input" />
              </div>
            </div>
          </div>
          
          <div className="global-stats">
            <div className="stat"><span>Dönem AKTS:</span> <strong>{currentAkts}</strong></div>
            <div className="stat"><span>Dönem ANO:</span> <strong>{currentAno}</strong></div>
            <div className="stat"><span>Genel AGNO:</span> <strong>{globalAgno}</strong></div>
          </div>
        </div>
      </header>

      <div className="table-actions">
        <button className="add-btn btn-sm" onClick={addCourse}>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Yeni Ders Ekle
        </button>
      </div>

      <div className="table-container">
        <table className="grades-table">
          <thead>
            <tr>
              <th rowSpan="2" className="col-name">Ders Adı</th>
              <th rowSpan="2" className="col-akts">AKTS</th>
              <th rowSpan="2" className="col-sys" title="Hesaplama Sistemi">Sistem</th>
              <th colSpan="3" className="col-group">Quiz / Ödev</th>
              <th colSpan="3" className="col-group">Vize</th>
              <th colSpan="3" className="col-group">Final</th>
              <th rowSpan="2" className="col-res" title="Senin Ortalaman">Senin Ort.</th>
              <th rowSpan="2" className="col-res" title="Sınıf Ortalaması">Sınıf Ort.</th>
              <th colSpan="3" className="col-res">Harf Notu (S.S. Tahmini)</th>
              <th rowSpan="2" className="col-act">İşlem</th>
            </tr>
            <tr>
              <th className="sub-col">%</th>
              <th className="sub-col">Not</th>
              <th className="sub-col">S.Ort</th>
              <th className="sub-col">%</th>
              <th className="sub-col">Not</th>
              <th className="sub-col">S.Ort</th>
              <th className="sub-col">%</th>
              <th className="sub-col">Not</th>
              <th className="sub-col">S.Ort</th>
              <th className="sub-col" title="Düşük S.S. (10)">Düşük</th>
              <th className="sub-col" title="Orta S.S. (15)">Orta</th>
              <th className="sub-col" title="Yüksek S.S. (20)">Yüksek</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <CourseRow 
                key={course.id} 
                course={course} 
                updateCourse={updateCourse} 
                deleteCourse={deleteCourse} 
              />
            ))}
            {courses.length === 0 && (
              <tr>
                <td colSpan="18" className="empty-state">
                  Tablo boş. Lütfen "Yeni Ders Ekle" butonuna tıklayarak başlayın.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Toast 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ message: '', type: '' })} 
      />
    </div>
  );
}

export default App;
