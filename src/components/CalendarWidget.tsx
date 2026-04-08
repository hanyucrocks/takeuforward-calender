import { useState, useEffect } from 'react';
import { 
  format, addMonths, subMonths, startOfMonth, 
  startOfWeek, isSameMonth, isSameDay, addDays,
  isWithinInterval, isBefore, isAfter
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const monthThemes = [
  { name: 'January', color: '#1d4ed8', image: 'https://images.unsplash.com/photo-1418985991508-e47386d96a71?auto=format&fit=crop&w=1000&q=80' },
  { name: 'February', color: '#be185d', image: 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?auto=format&fit=crop&w=1000&q=80' },
  { name: 'March', color: '#047857', image: 'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?auto=format&fit=crop&w=1000&q=80' },
  { name: 'April', color: '#b45309', image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1000&q=80' },
  { name: 'May', color: '#6d28d9', image: 'https://images.unsplash.com/photo-1464047736614-af63643285bf?auto=format&fit=crop&w=1000&q=80' },
  { name: 'June', color: '#0369a1', image: 'https://images.unsplash.com/photo-1468413253725-0d5181091126?auto=format&fit=crop&w=1000&q=80' },
  { name: 'July', color: '#e11d48', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80' },
  { name: 'August', color: '#a21caf', image: 'https://images.unsplash.com/photo-1468581264429-2548ef9eb732?auto=format&fit=crop&w=1000&q=80' },
  { name: 'September', color: '#b45309', image: 'https://images.unsplash.com/photo-1444491037305-64585ec8dafc?auto=format&fit=crop&w=1000&q=80' },
  { name: 'October', color: '#c2410c', image: 'https://images.unsplash.com/photo-1507371341162-763b5e419408?auto=format&fit=crop&w=1000&q=80' },
  { name: 'November', color: '#475569', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=80' },
  { name: 'December', color: '#0369a1', image: 'https://images.unsplash.com/photo-1512314889357-e157c22f938d?auto=format&fit=crop&w=1000&q=80' }
];

const holidays: Record<string, string> = {
  '01-26': "Republic Day",
  '08-15': "Independence Day",
  '10-02': "Gandhi Jayanti",
};

export default function CalendarWidget() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  // Notes state mapping a dynamic key to an array of 6 strings (the lines)
  const [notesData, setNotesData] = useState<Record<string, string[]>>(() => {
    const saved = localStorage.getItem('calendarNotes');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {};
  });
  const [flipState, setFlipState] = useState<'idle' | 'out' | 'in'>('idle');

  useEffect(() => {
    localStorage.setItem('calendarNotes', JSON.stringify(notesData));
  }, [notesData]);

  // Determine the current context key for notes
  const getNotesKey = () => {
    if (startDate && endDate) {
      return `range_${format(startDate, 'yyyy-MM-dd')}_${format(endDate, 'yyyy-MM-dd')}`;
    }
    if (startDate && !endDate) {
      return `date_${format(startDate, 'yyyy-MM-dd')}`;
    }
    return `month_${format(currentMonth, 'yyyy-MM')}`;
  };

  const currentNotesKey = getNotesKey();
  const currentNotesLines = notesData[currentNotesKey] || ['', '', '', '', '', ''];

  const handleNoteChange = (index: number, value: string) => {
    const newLines = [...currentNotesLines];
    newLines[index] = value;
    setNotesData(prev => ({ ...prev, [currentNotesKey]: newLines }));
  };

  const handleMonthChange = (direction: 'next' | 'prev') => {
    if (flipState !== 'idle') return;
    setFlipState('out');
    setTimeout(() => {
      setCurrentMonth(prev => direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1));
      setFlipState('in');
      setTimeout(() => {
        setFlipState('idle');
      }, 300);
    }, 300);
  };

  const jumpToToday = () => {
    if (flipState !== 'idle') return;
    setFlipState('out');
    setTimeout(() => {
      setCurrentMonth(new Date());
      setFlipState('in');
      setTimeout(() => {
        setFlipState('idle');
      }, 300);
    }, 300);
  };

  const nextMonth = () => handleMonthChange('next');
  const prevMonth = () => handleMonthChange('prev');

  const onDateClick = (day: Date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (isBefore(day, startDate)) {
        setEndDate(startDate);
        setStartDate(day);
      } else {
        setEndDate(day);
      }
    }
  };

  const clearSelection = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-6" onClick={(e) => e.stopPropagation()}>
        <button onClick={prevMonth} className="text-gray-400 hover:text-[var(--color-brand-blue)] cursor-pointer transition-colors p-2 rounded-full hover:bg-gray-100">
          <ChevronLeft />
        </button>
        <div className="text-center md:text-right relative group">
          <div className="text-xl md:text-2xl text-gray-400 font-light flex items-center justify-center md:justify-end gap-2">
            <span>{format(currentMonth, 'yyyy')}</span>
            <button 
              onClick={jumpToToday}
              className="text-[0.6rem] md:text-xs bg-gray-100 uppercase tracking-widest px-2 py-1 rounded-sm hover:bg-[var(--color-brand-blue)] hover:text-white transition-colors cursor-pointer text-gray-500 font-bold"
            >
              Today
            </button>
          </div>
          <div className="text-2xl md:text-4xl font-bold text-[var(--color-brand-blue)] uppercase tracking-wider leading-none">{format(currentMonth, 'MMMM')}</div>
        </div>
        <button onClick={nextMonth} className="text-gray-400 hover:text-[var(--color-brand-blue)] cursor-pointer transition-colors p-2 rounded-full hover:bg-gray-100">
          <ChevronRight />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const dateFormat = "EEE";
    let startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="text-center font-bold text-xs text-gray-500 uppercase tracking-widest py-2" key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    return <div className="grid grid-cols-7 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const startDateGrid = startOfWeek(monthStart, { weekStartsOn: 1 });

    const rows = [];
    let days = [];
    let day = startDateGrid;
    let formattedDate = "";

    for (let rowLength = 0; rowLength < 6; rowLength++) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;

        // Selection states
        const isSelectedStart = startDate && isSameDay(day, startDate);
        const isSelectedEnd = endDate && isSameDay(day, endDate);
        const isBetween = startDate && endDate && isWithinInterval(day, { start: startDate, end: endDate });
        const hoverBetween = startDate && !endDate && hoverDate && isWithinInterval(day, {
          start: isBefore(hoverDate, startDate) ? hoverDate : startDate,
          end: isAfter(hoverDate, startDate) ? hoverDate : startDate
        });

        const isCurrentMonth = isSameMonth(day, monthStart);

        // Check for notes badge
        const dayStr = format(day, 'yyyy-MM-dd');
        let hasNotes = false;
        
        if (notesData[`date_${dayStr}`]?.some(line => line.trim() !== '')) {
          hasNotes = true;
        } else {
          for (const key of Object.keys(notesData)) {
            if (key.startsWith('range_') && notesData[key].some(line => line.trim() !== '')) {
              const parts = key.split('_');
              if (parts.length === 3) {
                if (dayStr >= parts[1] && dayStr <= parts[2]) {
                  hasNotes = true;
                  break;
                }
              }
            }
          }
        }

        let cellClasses = "relative flex items-center justify-center h-10 md:h-12 w-full cursor-pointer transition-colors ";
        let textClasses = "z-10 ";
        
        const isRealToday = isSameDay(day, new Date());
        const holidayName = holidays[format(day, 'MM-dd')];

        if (!isCurrentMonth) {
          textClasses += "text-gray-300 font-medium ";
        } else if (isSelectedStart || isSelectedEnd) {
          textClasses += "text-white font-medium ";
        } else if (isBetween || hoverBetween) {
          textClasses += "text-[var(--color-brand-blue)] font-medium ";
        } else {
          textClasses += "text-gray-700 hover:text-[var(--color-brand-blue)] ";
          if (isRealToday) {
             textClasses += "font-black text-[var(--color-brand-blue)] ";
          } else {
             textClasses += "font-medium ";
          }
        }

        // Backgrounds
        let bgClasses = "absolute inset-0 ";
        if (isSelectedStart && !isSelectedEnd) {
          bgClasses += "bg-[var(--color-brand-blue)] rounded-l-full " + (hoverDate || endDate ? "" : "rounded-r-full ");
        } else if (isSelectedEnd && !isSelectedStart) {
          bgClasses += "bg-[var(--color-brand-blue)] rounded-r-full ";
        } else if (isSelectedStart && isSelectedEnd) {
          bgClasses += "bg-[var(--color-brand-blue)] rounded-full ";
        } else if (isBetween || hoverBetween) {
          bgClasses += "bg-[var(--color-brand-light)] ";
        } else if (isCurrentMonth) {
          bgClasses += "hover:bg-gray-100 rounded-full scale-90 ";
        } else {
           bgClasses += "hidden ";
        }

        let ringClass = "";
        if (isRealToday) ringClass = " ring-2 ring-gray-900 ring-offset-2 z-0 ";

        days.push(
          <div
            className={`flex items-center justify-center p-1 ${!isCurrentMonth ? 'pointer-events-none' : ''}`}
            key={day.toString()}
            onClick={(e) => {
              e.stopPropagation();
              onDateClick(cloneDay);
            }}
            onMouseEnter={() => setHoverDate(cloneDay)}
            onMouseLeave={() => setHoverDate(null)}
            title={holidayName || (isRealToday ? "Today" : undefined)}
          >
            <div className={cellClasses}>
              <div className={bgClasses + ringClass}></div>
              <span className={`${textClasses} ${hasNotes || holidayName ? '-mt-2' : ''}`}>{formattedDate}</span>
              {holidayName && (
                <div className={`absolute bottom-1 px-1 rounded text-[0.45rem] tracking-widest font-bold uppercase transition bg-opacity-80 z-10 ${isSelectedStart || isSelectedEnd ? 'bg-white text-[var(--color-brand-blue)]' : 'bg-red-50 text-red-500'}`}>H</div>
              )}
              {hasNotes && !holidayName && (
                <div className={`absolute bottom-2 w-1.5 h-1.5 rounded-full z-10 ${isSelectedStart || isSelectedEnd ? 'bg-white' : 'bg-[var(--color-brand-blue)]'}`}></div>
              )}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="select-none">{rows}</div>;
  };

  const renderNotesArea = () => {
    let contextTitle = "Monthly Notes";
    if (startDate && endDate) {
       contextTitle = `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d')}`;
    } else if (startDate) {
       contextTitle = `${format(startDate, 'MMM d')} Notes`;
    }

    return (
      <div className="flex flex-col h-full pl-0 md:pl-4 pt-6 md:pt-0" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-1">Notes</h3>
        <div className="text-xs text-[var(--color-brand-blue)] mb-4 font-medium transition-all">{contextTitle}</div>
        <div className="flex-grow space-y-4">
           {currentNotesLines.map((line, i) => (
             <input 
               key={i}
               type="text" 
               value={line}
               onChange={(e) => handleNoteChange(i, e.target.value)}
               className="w-full bg-transparent border-b border-gray-300 pb-1 text-sm focus:outline-none focus:border-[var(--color-brand-blue)] transition-colors text-gray-600"
               placeholder={i === 0 ? "Add your notes here..." : ""}
             />
           ))}
        </div>
      </div>
    );
  };

  const currentMonthData = monthThemes[currentMonth.getMonth()];

  return (
    <div 
      className="max-w-4xl mx-auto my-8 bg-white overflow-hidden flex flex-col w-[95%] shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] rounded-xl border border-gray-100 relative transition-colors duration-500" 
      onClick={clearSelection}
      style={{ '--color-brand-blue': currentMonthData.color, '--color-brand-light': `${currentMonthData.color}20` } as React.CSSProperties}
    >
        {/* Ring binder styling using CSS circles to simulate calendar binding */}
        <div className="absolute top-0 left-0 w-full h-4 flex justify-between px-10 z-20 overflow-hidden transform -translate-y-2 opacity-80">
            {[...Array(20)].map((_, i) => (
                <div key={i} className="w-2 h-4 border-2 border-gray-800 rounded-full bg-gray-300"></div>
            ))}
        </div>

      {/* Hero Section */}
      <div className="relative h-64 md:h-96 w-full bg-[var(--color-brand-blue)] clip-bottom-wave z-10 transition-colors duration-500">
        <img 
          src={currentMonthData.image} 
          alt={`${currentMonthData.name} Hero`} 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-80 transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-brand-blue)] to-transparent opacity-60"></div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 md:p-10 flex flex-col-reverse md:flex-row md:space-x-12 bg-white relative z-0 md:-mt-12 pt-8 md:pt-16">
        
        {/* Left Col: Notes */}
        <div className="w-full md:w-1/3 mt-8 md:mt-0 md:border-r border-gray-100 pr-0 md:pr-8">
          {renderNotesArea()}
        </div>

        {/* Right Col: Calendar Grid */}
        <div className="w-full md:w-2/3 perspective-1000">
          {renderHeader()}
          <div className={`${flipState === 'out' ? 'animate-flip-out' : flipState === 'in' ? 'animate-flip-in' : ''}`}>
            {renderDays()}
            {renderCells()}
          </div>
        </div>

      </div>
    </div>
  );
}
