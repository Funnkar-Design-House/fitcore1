import { useData } from '../contexts/DataContext';
import { Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function MemberCalendarView() {
  const { entryLogs } = useData();
  const [checkInDates, setCheckInDates] = useState<string[]>([]);

  useEffect(() => {
    const memberId = sessionStorage.getItem('memberId');
    if (!memberId) return;
    // Get all check-in dates for this member
    const dates = entryLogs
      .filter((log) => log.memberId === memberId && log.status === 'allowed')
      .map((log) => log.timestamp.split('T')[0]);
    setCheckInDates(Array.from(new Set(dates)));
  }, [entryLogs]);

  return (
    <div className="max-w-2xl mx-auto py-8 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-6 w-6 text-primary" />
        <h2 className="font-display text-2xl font-bold">Calendar View</h2>
      </div>
      {checkInDates.length === 0 ? (
        <div className="text-muted-foreground">No check-ins yet. Your check-in calendar will appear here.</div>
      ) : (
        <div>
          <h3 className="font-semibold mb-2">Days you checked in:</h3>
          <ul className="list-disc ml-6">
            {checkInDates.map((date) => (
              <li key={date} className="text-foreground">{date}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
