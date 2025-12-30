import { useState, useMemo, useCallback } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useData } from '../contexts/DataContext';
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';

type ViewMode = 'month' | 'year';

interface DayEvent {
  type: 'check-in' | 'registration';
  count: number;
  color: string;
  label: string;
}

export default function CalendarView() {
  const { entryLogs, members, payments } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');

  // Month and year display
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Get the first and last day of the current month
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
  // Get the day of week for the first day (0 = Sunday, 6 = Saturday)
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToPreviousYear = () => {
    setCurrentDate(new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1));
  };

  const goToNextYear = () => {
    setCurrentDate(new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setViewMode('month');
  };

  const goToMonth = (monthIndex: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), monthIndex, 1));
    setViewMode('month');
  };

  // Calculate check-ins and registrations per day
  const dailyStats = useMemo(() => {
    const stats: { [key: string]: { checkIns: number; registrations: number; payments: number } } = {};

    // Count check-ins per day
    entryLogs.forEach((log) => {
      if (log.status === 'allowed') {
        const logDate = new Date(log.timestamp);
        const dateKey = `${logDate.getFullYear()}-${logDate.getMonth()}-${logDate.getDate()}`;
        
        if (!stats[dateKey]) {
          stats[dateKey] = { checkIns: 0, registrations: 0, payments: 0 };
        }
        stats[dateKey].checkIns++;
      }
    });

    // Count registrations per day
    members.forEach((member) => {
      const joinDate = new Date(member.joinDate);
      const dateKey = `${joinDate.getFullYear()}-${joinDate.getMonth()}-${joinDate.getDate()}`;
      
      if (!stats[dateKey]) {
        stats[dateKey] = { checkIns: 0, registrations: 0, payments: 0 };
      }
      stats[dateKey].registrations++;
    });

    // Count payments per day
    payments.forEach((payment) => {
      const paymentDate = new Date(payment.date);
      const dateKey = `${paymentDate.getFullYear()}-${paymentDate.getMonth()}-${paymentDate.getDate()}`;
      
      if (!stats[dateKey]) {
        stats[dateKey] = { checkIns: 0, registrations: 0, payments: 0 };
      }
      stats[dateKey].payments++;
    });

    return stats;
  }, [entryLogs, members, payments]);

  // Get events for a specific day (with optional year and month parameters)
  const getEventsForDay = useCallback((day: number, month?: number, year?: number): DayEvent[] => {
    const targetMonth = month !== undefined ? month : currentDate.getMonth();
    const targetYear = year !== undefined ? year : currentDate.getFullYear();
    const dateKey = `${targetYear}-${targetMonth}-${day}`;
    const stats = dailyStats[dateKey] || { checkIns: 0, registrations: 0, payments: 0 };
    const events: DayEvent[] = [];

    if (stats.checkIns > 0) {
      events.push({
        type: 'check-in',
        count: stats.checkIns,
        color: 'bg-blue-500',
        label: `${stats.checkIns} Check-in${stats.checkIns > 1 ? 's' : ''}`
      });
    }
  
    if (stats.registrations > 0) {
      events.push({
        type: 'registration',
        count: stats.registrations,
        color: 'bg-emerald-500',
        label: `${stats.registrations} New Member${stats.registrations > 1 ? 's' : ''}`
      });
    }

    if (stats.payments > 0) {
      events.push({
        type: 'check-in',
        count: stats.payments,
        color: 'bg-orange-500',
        label: `${stats.payments} Payment${stats.payments > 1 ? 's' : ''}`
      });
    }

    return events;
  }, [dailyStats, currentDate]);

  // Get upcoming events for sidebar
  const upcomingEvents = useMemo(() => {
    const events: Array<{
      day: number;
      month: string;
      year: number;
      events: DayEvent[];
      color: string;
    }> = [];

    const today = new Date();
    const nextDays = 30;

    for (let i = 0; i < nextDays; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() + i);
      
      const dateKey = `${checkDate.getFullYear()}-${checkDate.getMonth()}-${checkDate.getDate()}`;
      const stats = dailyStats[dateKey];
      
      if (stats && (stats.checkIns > 0 || stats.registrations > 0 || stats.payments > 0)) {
        const dayEvents = getEventsForDay(checkDate.getDate(), checkDate.getMonth(), checkDate.getFullYear());
        const colors = ['bg-purple-500', 'bg-cyan-500', 'bg-blue-500', 'bg-pink-500', 'bg-orange-500'];
        
        events.push({
          day: checkDate.getDate(),
          month: monthNames[checkDate.getMonth()],
          year: checkDate.getFullYear(),
          events: dayEvents,
          color: colors[events.length % colors.length]
        });
      }

      if (events.length >= 5) break;
    }

    return events;
  }, [dailyStats, getEventsForDay, monthNames]);

  // Check if a date is today
  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  // Generate calendar days array
  const calendarDays = [];
  
  // Add empty cells for days before the month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // Get activity count for a month
  const getMonthActivityCount = (monthIndex: number) => {
    let count = 0;
    const year = currentDate.getFullYear();
    const daysInTargetMonth = new Date(year, monthIndex + 1, 0).getDate();
    
    for (let day = 1; day <= daysInTargetMonth; day++) {
      const dateKey = `${year}-${monthIndex}-${day}`;
      const stats = dailyStats[dateKey];
      if (stats) {
        count += stats.checkIns + stats.registrations + stats.payments;
      }
    }
    return count;
  };

  // Check if a month is current month
  const isCurrentMonth = (monthIndex: number) => {
    const today = new Date();
    return (
      monthIndex === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <DashboardLayout>
      <div className="flex gap-6 h-full">
        {/* Main Calendar Area */}
        <div className="flex-1 min-w-0">
          {/* Header with Month/Year Toggle */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-3xl font-bold text-foreground">
              {viewMode === 'year' ? currentDate.getFullYear() : `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
            </h2>
            
            <div className="flex items-center gap-3">
              <div className="inline-flex rounded-lg border border-border bg-secondary/30 p-1">
                <button
                  onClick={() => setViewMode('month')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'month'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  MONTH
                </button>
                <button
                  onClick={() => setViewMode('year')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'year'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  YEAR
                </button>
              </div>
            </div>
          </div>

          {/* Calendar Navigation and Grid */}
          <div className="glass-card p-6">
            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <button
                onClick={viewMode === 'year' ? goToPreviousYear : goToPreviousMonth}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={goToToday}
                className="px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium"
              >
                Today
              </button>
              <button
                onClick={viewMode === 'year' ? goToNextYear : goToNextMonth}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {viewMode === 'month' ? (
              /* Month View - Calendar Grid */
              <div className="grid grid-cols-7 gap-2">
                {/* Day headers */}
                {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].map((day) => (
                  <div
                    key={day}
                    className="text-center font-semibold text-muted-foreground text-xs py-2 uppercase"
                  >
                    {day}
                  </div>
                ))}

                {/* Calendar days */}
                {calendarDays.map((day, index) => {
                  if (day === null) {
                    return <div key={`empty-${index}`} className="min-h-[100px]" />;
                  }

                  const events = getEventsForDay(day);
                  const today = isToday(day);

                  return (
                    <div
                      key={day}
                      className={`min-h-[100px] border rounded-lg p-2 transition-all ${
                        today
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                          : 'border-border bg-secondary/10 hover:bg-secondary/20'
                      }`}
                    >
                      <div className="flex flex-col h-full">
                        <div className={`text-sm font-semibold mb-2 ${
                          today ? 'text-primary' : 'text-foreground/70'
                        }`}>
                          {day}
                        </div>
                        
                        <div className="flex-1 space-y-1">
                          {events.map((event, idx) => (
                            <div
                              key={idx}
                              className={`${event.color} text-white text-[10px] px-2 py-1 rounded font-medium truncate`}
                            >
                              {event.label}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Year View - 12 Months Grid */
              <div className="grid grid-cols-3 gap-4">
                {monthNames.map((month, monthIndex) => {
                  const activityCount = getMonthActivityCount(monthIndex);
                  const isCurrent = isCurrentMonth(monthIndex);
                  
                  return (
                    <button
                      key={monthIndex}
                      onClick={() => goToMonth(monthIndex)}
                      className={`p-4 rounded-lg border-2 transition-all text-left hover:shadow-lg ${
                        isCurrent
                          ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                          : 'border-border bg-secondary/10 hover:border-primary/50 hover:bg-secondary/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className={`font-semibold text-lg ${isCurrent ? 'text-primary' : 'text-foreground'}`}>
                          {month}
                        </h3>
                        {activityCount > 0 && (
                          <span className="px-2 py-1 bg-primary/20 text-primary rounded-full text-xs font-bold">
                            {activityCount}
                          </span>
                        )}
                      </div>
                      
                      {activityCount > 0 ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <span>Check-ins & Activities</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground">No activities</p>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Upcoming Events */}
        <div className="w-80 hidden lg:block">
          <div className="sticky top-6 space-y-4">
            {upcomingEvents.length === 0 ? (
              <div className="glass-card p-6 text-center">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">No upcoming events</p>
              </div>
            ) : (
              upcomingEvents.map((event, index) => (
                <div
                  key={index}
                  className={`${event.color} rounded-lg p-4 text-white shadow-lg`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold font-display">
                        {event.day}
                      </div>
                      <div className="text-xs uppercase opacity-90 mt-1">
                        {event.month.slice(0, 3)}
                      </div>
                    </div>
                    <div className="flex-1">
                      {event.events.map((evt, idx) => (
                        <div key={idx} className="mb-2 last:mb-0">
                          <div className="font-semibold text-sm">{evt.label}</div>
                          <div className="flex items-center gap-1 text-xs opacity-90 mt-1">
                            <Clock className="h-3 w-3" />
                            <span>{event.month} {event.day}, {event.year}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
