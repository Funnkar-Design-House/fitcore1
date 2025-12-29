
import { useData } from '../contexts/DataContext';
import { Calendar } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { MemberLayout } from '../components/layout/MemberLayout';

export default function MemberCalendarView() {
  const { entryLogs } = useData();
  const memberId = sessionStorage.getItem('memberId');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Month and year display
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Get the first and last day of the current month
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Get all check-in dates for this member in the current month
  const checkInDatesSet = useMemo(() => {
    const set = new Set(
      entryLogs
        .filter((log) => log.memberId === memberId && log.status === 'allowed')
        .map((log) => log.timestamp.split('T')[0])
    );
    return set;
  }, [entryLogs, memberId]);

  // Generate calendar days array
  const calendarDays = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // Check if a date is today
  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  // Check if a day is a check-in day
  const isCheckInDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    // Check for both 0-padded and non-padded dates
    return (
      checkInDatesSet.has(dateStr) ||
      checkInDatesSet.has(`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${day}`)
    );
  };

  return (
    <MemberLayout>
      <div className="max-w-3xl mx-auto py-8 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-3xl font-bold text-foreground">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              &lt;
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium"
            >
              Today
            </button>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              &gt;
            </button>
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="grid grid-cols-7 gap-2">
            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
              <div
                key={day}
                className="text-center font-semibold text-muted-foreground text-xs py-2 uppercase"
              >
                {day}
              </div>
            ))}
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="min-h-[80px]" />;
              }
              const today = isToday(day);
              const checkedIn = isCheckInDay(day);
              return (
                <div
                  key={day}
                  className={`min-h-[80px] border rounded-lg p-2 transition-all flex flex-col items-center justify-center ${
                    today
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                      : checkedIn
                        ? 'border-success bg-success/10'
                        : 'border-border bg-secondary/10 hover:bg-secondary/20'
                  }`}
                >
                  <div className={`text-sm font-semibold mb-2 ${today ? 'text-primary' : checkedIn ? 'text-success' : 'text-foreground/70'}`}>
                    {day}
                  </div>
                  {checkedIn && <div className="text-xs text-success font-bold">Checked In</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </MemberLayout>
  );
}
