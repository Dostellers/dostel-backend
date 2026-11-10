'use client';

import { useQuery } from '@apollo/client';
import { useState, useEffect } from 'react';
import { INVENTORY_CALENDAR } from '@/lib/queries';

type InventoryDay = {
  inventoryTypeId: string;
  roomType: string;
  date: string;
  total: number;
  held: number;
  sold: number;
  blocked: number;
  available: number;
};

interface AvailabilityCalendarProps {
  hostelId: string;
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function AvailabilityCalendar({ hostelId }: AvailabilityCalendarProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [visibleYear, setVisibleYear] = useState(today.getFullYear());
  const [visibleMonth, setVisibleMonth] = useState(today.getMonth());

  const monthStart = new Date(visibleYear, visibleMonth, 1);
  const nextMonthStart = new Date(visibleYear, visibleMonth + 1, 1);
  const daysInMonth = new Date(visibleYear, visibleMonth + 1, 0).getDate();
  const startDay = monthStart.getDay();

  const startDateStr = `${visibleYear}-${String(visibleMonth + 1).padStart(2, '0')}-01`;
  const endDateStr = `${visibleYear}-${String(visibleMonth + 1).padStart(2, '0')}-${daysInMonth}`;

  const { data, loading, error } = useQuery<{ inventoryCalendar: InventoryDay[] }>(
    INVENTORY_CALENDAR,
    {
      variables: { hostelId, startDate: startDateStr, endDate: endDateStr },
      fetchPolicy: 'cache-and-network',
    }
  );

  const availabilityMap = new Map<string, InventoryDay>();
  data?.inventoryCalendar?.forEach((day) => {
    availabilityMap.set(day.date, day);
  });

  const getAvailabilityForDate = (dateStr: string) => availabilityMap.get(dateStr);

  const getDayStatus = (dateStr: string) => {
    const av = getAvailabilityForDate(dateStr);
    if (!av) return 'unknown';
    if (av.available > 0) return 'available';
    if (av.available === 0) return 'sold';
    if (av.maintenance) return 'maintenance';
    return 'unknown';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-emerald-100 text-emerald-800';
      case 'sold': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const prevMonth = () => {
    const newDate = new Date(visibleYear, visibleMonth - 1, 1);
    setVisibleMonth(newDate.getMonth());
    setVisibleYear(newDate.getFullYear());
  };

  const nextMonth = () => {
    const newDate = new Date(visibleYear, visibleMonth + 1, 1);
    setVisibleMonth(newDate.getMonth());
    setVisibleYear(newDate.getFullYear());
  };

  const goToToday = () => {
    setVisibleMonth(today.getMonth());
    setVisibleYear(today.getFullYear());
  };

  const isToday = (dateStr: string) => dateStr === today.toISOString().split('T')[0];
  const isPast = (dateStr: string) => dateStr < today.toISOString().split('T')[0];

  const calendarDays = [];
  for (let i = 0; i < startDay; i++) {
    calendarDays.push({ type: 'prev', day: null });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${visibleYear}-${String(visibleMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    calendarDays.push({ type: 'current', day, dateStr });
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="px-3 py-1 text-sm font-medium text-ink-700 hover:bg-ink-100 rounded"
        >
          Previous
        </button>
        <h3 className="text-lg font-semibold text-ink-1000">
          {MONTH_NAMES[visibleMonth]} {visibleYear}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm font-medium text-ink-700 hover:bg-ink-100 rounded"
          >
            Today
          </button>
          <button
            onClick={nextMonth}
            className="px-3 py-1 text-sm font-medium text-ink-700 hover:bg-ink-100 rounded"
          >
            Next
          </button>
        </div>
      </div>

      {loading && <p className="text-sm text-ink-600">Loading availability...</p>}
      {error && <p className="text-sm text-red-600">Unable to load availability.</p>}

      <div className="grid grid-cols-7 gap-px bg-ink-200 rounded-sm overflow-hidden">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="bg-ink-100 py-2 text-center text-xs font-semibold text-ink-600">
            {day}
          </div>
        ))}
        {calendarDays.map((item, index) => {
          if (item.type === 'prev') {
            return <div key={`prev-${index}`} className="bg-white py-2 h-24" />;
          }
          const { day, dateStr } = item;
          const status = getDayStatus(dateStr!);
          const isCurrentDay = isToday(dateStr!);
          const past = isPast(dateStr!);

          return (
            <div
              key={dateStr}
              className={`relative bg-white py-1 px-1 h-24 border-l border-t border-ink-200 ${past ? 'opacity-50' : ''}`}
            >
              <span
                className={`absolute top-1 left-1 text-xs font-medium ${
                  isCurrentDay ? 'bg-coral-600 text-white rounded-full w-5 h-5 flex items-center justify-center' : 'text-ink-700'
                }`}
              >
                {day}
              </span>
              {!past && (
                <div className="absolute top-6 left-1 right-1 bottom-1">
                  <span
                    className={`inline-block px-1.5 py-0.5 text-[0.6rem] font-medium rounded ${getStatusColor(status)}`}
                  >
                    {status}
                  </span>
                  {getAvailabilityForDate(dateStr!) && (
                    <span className="mt-1 block text-[0.6rem] text-ink-600">
                      {getAvailabilityForDate(dateStr!)?.available}/{getAvailabilityForDate(dateStr!)?.total}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex gap-4 text-xs text-ink-600">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-emerald-100" />
          Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-red-100" />
          Sold out
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-gray-100" />
          Unknown
        </span>
      </div>
    </div>
  );
}
