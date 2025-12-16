import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useData } from '@/contexts/DataContext';
import { ChevronLeft, ChevronRight, Calendar, Users, UserPlus } from 'lucide-react';

export default function CalendarView() {
  const { entryLogs, members } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());

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

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Calculate check-ins and registrations per day
  const dailyStats = useMemo(() => {
    const stats: { [key: string]: { checkIns: number; registrations: number } } = {};

    // Count check-ins per day
    entryLogs.forEach((log) => {
      if (log.status === 'allowed') {
        const logDate = new Date(log.timestamp);
        const dateKey = `${logDate.getFullYear()}-${logDate.getMonth()}-${logDate.getDate()}`;
        
        if (!stats[dateKey]) {
          stats[dateKey] = { checkIns: 0, registrations: 0 };
        }
        stats[dateKey].checkIns++;
      }
    });

    // Count registrations per day
    members.forEach((member) => {
      const joinDate = new Date(member.joinDate);
      const dateKey = `${joinDate.getFullYear()}-${joinDate.getMonth()}-${joinDate.getDate()}`;
      
      if (!stats[dateKey]) {
        stats[dateKey] = { checkIns: 0, registrations: 0 };
      }
      stats[dateKey].registrations++;
    });

    return stats;
  }, [entryLogs, members]);

  // Get stats for a specific day
  const getStatsForDay = (day: number) => {
    const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`;
    return dailyStats[dateKey] || { checkIns: 0, registrations: 0 };
  };

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

  // Month and year display
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthYear = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  // Calculate monthly totals
  const monthlyCheckIns = Object.entries(dailyStats).reduce((sum, [key, stats]) => {
    const [year, month] = key.split('-').map(Number);
    if (year === currentDate.getFullYear() && month === currentDate.getMonth()) {
      return sum + stats.checkIns;
    }
    return sum;
  }, 0);

  const monthlyRegistrations = Object.entries(dailyStats).reduce((sum, [key, stats]) => {
    const [year, month] = key.split('-').map(Number);
    if (year === currentDate.getFullYear() && month === currentDate.getMonth()) {
      return sum + stats.registrations;
    }
    return sum;
  }, 0);

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-fade-in">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Calendar View</h1>
          <p className="mt-1 text-muted-foreground">Track daily attendance and member registrations.</p>
        </div>
        <button
          onClick={goToToday}
          className="btn-primary flex items-center gap-2 w-fit"
        >
          <Calendar className="h-5 w-5" />
          Today
        </button>
      </div>

      {/* Monthly Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="stat-card border-primary/30 hover:border-primary/50 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Monthly Check-ins</p>
              <p className="font-display text-4xl font-bold text-foreground mt-2">{monthlyCheckIns}</p>
            </div>
            <div className="p-3 rounded-xl bg-primary/20">
              <Users className="h-8 w-8 text-primary" />
            </div>
          </div>
        </div>
        <div className="stat-card border-success/30 hover:border-success/50 animate-fade-in" style={{ animationDelay: '150ms' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">New Registrations</p>
              <p className="font-display text-4xl font-bold text-foreground mt-2">{monthlyRegistrations}</p>
            </div>
            <div className="p-3 rounded-xl bg-success/20">
              <UserPlus className="h-8 w-8 text-success" />
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={goToPreviousMonth}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h2 className="font-display text-2xl font-bold text-foreground">{monthYear}</h2>
          <button
            onClick={goToNextMonth}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-6 pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <span className="text-sm text-muted-foreground">Check-ins</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success"></div>
            <span className="text-sm text-muted-foreground">Registrations</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="text-center font-semibold text-muted-foreground text-sm py-2"
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const stats = getStatsForDay(day);
            const today = isToday(day);
            const hasActivity = stats.checkIns > 0 || stats.registrations > 0;

            return (
              <div
                key={day}
                className={`aspect-square border-2 rounded-lg p-2 transition-all ${
                  today
                    ? 'border-primary bg-primary/10'
                    : hasActivity
                    ? 'border-border hover:border-primary/50 bg-secondary/30'
                    : 'border-border/50 bg-secondary/10'
                }`}
              >
                <div className="flex flex-col h-full">
                  <div className={`text-sm font-semibold mb-auto ${
                    today ? 'text-primary' : 'text-foreground'
                  }`}>
                    {day}
                  </div>
                  
                  {hasActivity && (
                    <div className="flex items-center justify-center gap-2 mt-1">
                      {stats.checkIns > 0 && (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                          <span className="text-xs font-bold text-primary">{stats.checkIns}</span>
                        </div>
                      )}
                      {stats.registrations > 0 && (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-success"></div>
                          <span className="text-xs font-bold text-success">{stats.registrations}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info Card */}
      <div className="glass-card p-6 mt-6 animate-fade-in" style={{ animationDelay: '250ms' }}>
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          How to Read the Calendar
        </h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• <span className="text-primary font-semibold">Blue numbers</span> indicate the number of member check-ins on that day</p>
          <p>• <span className="text-success font-semibold">Green numbers</span> indicate the number of new member registrations on that day</p>
          <p>• Days with a <span className="text-primary font-semibold">blue border</span> represent today's date</p>
          <p>• Use the arrow buttons to navigate between months</p>
          <p>• Click "Today" to return to the current month</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
