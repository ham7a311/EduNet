import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, Calendar, Clock, MapPin, Edit, Trash2, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CalendarComponent = () => {
  const { t, i18n } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem('calendar-events');
    return savedEvents ? JSON.parse(savedEvents) : {};
  });
  const [showEventModal, setShowEventModal] = useState(false);
  const [showDayEvents, setShowDayEvents] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showColorDropdown, setShowColorDropdown] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    time: '',
    description: '',
    location: '',
    attendees: '',
    color: '#3b82f6'
  });

  // Set document direction based on language to ensure RTL persists after refresh
  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  useEffect(() => {
    try {
      localStorage.setItem('calendar-events', JSON.stringify(events));
    } catch (error) {
      console.error('Error saving events to localStorage:', error);
    }
  }, [events]);

  const monthKeys = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ];
  const eventColors = [
    { value: '#3b82f6', key: 'blue', light: '#dbeafe' },
    { value: '#ef4444', key: 'red', light: '#fee2e2' },
    { value: '#10b981', key: 'emerald', light: '#d1fae5' },
    { value: '#f59e0b', key: 'amber', light: '#fef3c7' },
    { value: '#8b5cf6', key: 'violet', light: '#ede9fe' },
    { value: '#ec4899', key: 'pink', light: '#fce7f3' },
    { value: '#06b6d4', key: 'cyan', light: '#cffafe' },
    { value: '#84cc16', key: 'lime', light: '#ecfccb' },
    { value: '#f97316', key: 'orange', light: '#fed7aa' },
    { value: '#64748b', key: 'slate', light: '#f1f5f9' }
  ];

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
    setShowDayEvents(true);
  };

  const handleCreateEvent = (date = null) => {
    if (date) {
      setSelectedDate(date);
      setShowDayEvents(false);
      setShowEventModal(true);
    } else {
      setShowDatePicker(true);
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setNewEvent({
      title: event.title,
      time: event.time,
      description: event.description,
      location: event.location,
      attendees: event.attendees || '',
      color: event.color
    });
    setShowDayEvents(false);
    setShowEventModal(true);
  };

  const handleDeleteEvent = (eventToDelete) => {
    const dateKey = formatDate(selectedDate);
    setEvents(prev => {
      const updatedEvents = {
        ...prev,
        [dateKey]: prev[dateKey]?.filter(event => event.id !== eventToDelete.id) || []
      };
      if (updatedEvents[dateKey].length === 0) {
        delete updatedEvents[dateKey];
      }
      return updatedEvents;
    });
  };

  const handleDateSelection = (day) => {
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(selectedDate);
    setShowDatePicker(false);
    setShowEventModal(true);
  };

  const handleColorSelect = (color) => {
    setNewEvent(prev => ({ ...prev, color }));
    setShowColorDropdown(false);
  };

  const handleEventSubmit = () => {
    if (!newEvent.title.trim()) return;

    const dateKey = formatDate(selectedDate);
    
    if (editingEvent) {
      const eventWithId = {
        ...newEvent,
        id: editingEvent.id,
        date: dateKey
      };

      setEvents(prev => ({
        ...prev,
        [dateKey]: prev[dateKey]?.map(event => 
          event.id === editingEvent.id ? eventWithId : event
        ) || [eventWithId]
      }));
    } else {
      const eventWithId = {
        ...newEvent,
        id: Date.now(),
        date: dateKey
      };

      setEvents(prev => ({
        ...prev,
        [dateKey]: [...(prev[dateKey] || []), eventWithId]
      }));
    }

    setNewEvent({
      title: '',
      time: '',
      description: '',
      location: '',
      attendees: '',
      color: '#3b82f6'
    });
    setEditingEvent(null);
    setShowEventModal(false);
    setShowColorDropdown(false);
  };

  const closeModal = () => {
    setShowEventModal(false);
    setShowDayEvents(false);
    setShowDatePicker(false);
    setShowColorDropdown(false);
    setEditingEvent(null);
    setNewEvent({
      title: '',
      time: '',
      description: '',
      location: '',
      attendees: '',
      color: '#3b82f6'
    });
  };

  const getSortedEvents = (dateKey) => {
    const dayEvents = events[dateKey] || [];
    return dayEvents.sort((a, b) => {
      if (!a.time && !b.time) return 0;
      if (!a.time) return 1;
      if (!b.time) return -1;
      return a.time.localeCompare(b.time);
    });
  };

  const getSelectedColor = () => {
    return eventColors.find(color => color.value === newEvent.color) || eventColors[0];
  };

  const isArabic = i18n.language === 'ar';

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
  
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-32 sm:h-36 px-3 sm:px-4 min-w-[70px]"
        ></div>
      );
    }
  
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = formatDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      );
      const dayEvents = getSortedEvents(dateKey);
      const isToday =
        new Date().toDateString() ===
        new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
  
      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(day)}
          className={`group h-32 sm:h-36 p-3 sm:p-4 min-w-[70px] border border-gray-200 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-900 hover:shadow-md ${
            isToday ? "bg-black ring-2 ring-black" : "bg-white"
          }`}
        >
          <div
            className={`text-sm font-semibold mb-2 transition-colors duration-200 ${
              isToday ? "text-white" : "text-gray-700 group-hover:text-white"
            }`}
          >
            {day}
          </div>
          <div className="space-y-1 overflow-hidden">
            {dayEvents.slice(0, 2).map((event, idx) => (
              <div
                key={idx}
                className="text-[11px] px-2 py-1 rounded-md text-white truncate shadow-sm"
                style={{ backgroundColor: event.color }}
              >
                {event.time && <span className="mr-1">{event.time}</span>}
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-[10px] text-gray-500 px-2 group-hover:text-white">
                +{dayEvents.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }
  
    return days;
  };
  

  return (
    <div className="max-w-6xl mx-auto p-2 sm:p-4 md:p-6 bg-white min-h-screen" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="relative">
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 mb-4 sm:mb-6 border border-white/20 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
            <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                <Calendar className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {t('calendar.title')}
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">{t('calendar.subtitle')}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between w-full sm:space-x-4 flex-wrap gap-2 sm:gap-0">
              <button
                onClick={() => navigateMonth(isArabic ? 1 : -1)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                {isArabic ? <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600" /> : <ChevronLeft className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600" />}
              </button>
              <h2 className="flex-1 text-center text-base sm:text-xl font-semibold text-gray-800">
                {t(`calendar.months.${monthKeys[currentDate.getMonth()]}`)} {currentDate.getFullYear()}
              </h2>
              <button
                onClick={() => navigateMonth(isArabic ? -1 : 1)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                {isArabic ? <ChevronLeft className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600" /> : <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600" />}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-white/20">
          <div className="grid grid-cols-7 bg-gradient-to-r from-gray-50 to-gray-100">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 sm:p-2 text-center text-xs sm:text-sm font-semibold text-gray-600 border-r border-gray-200 last:border-r-0">
                {t(`calendar.days.${day.toLowerCase()}`)}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 w-full overflow-y-auto">
            {renderCalendarDays()}
          </div>
        </div>
      </div>

      <div className="opacity-100">
        <button
          onClick={() => handleCreateEvent()}
          className="fixed bottom-8 right-8 bg-black text-white p-5 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors z-[70]"
          aria-label={t('calendar.create_event')}
        >
          <Plus className="h-7 w-7" />
        </button>

        {showDatePicker && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-60">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[90vw] sm:max-w-md transform transition-all duration-300 scale-100">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center space-x-2 sm:space-x-3 rtl:space-x-reverse">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                      <Calendar className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                      {t('calendar.select_date')}
                    </h3>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  >
                    <X className="w-4 sm:w-5 h-4 sm:h-5 text-gray-500" />
                  </button>
                </div>

                <div className="mb-4">
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">{t('calendar.choose_date')}</p>
                  <div className="grid grid-cols-7 gap-1">
                    {['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].map((day) => (
                      <div key={day} className="text-center text-[10px] sm:text-xs font-medium text-gray-500 p-1 sm:p-2">
                        {t(`calendar.days_short.${day}`)}
                      </div>
                    ))}
                    
                    {(() => {
                      const daysInMonth = getDaysInMonth(currentDate);
                      const firstDay = getFirstDayOfMonth(currentDate);
                      const days = [];

                      for (let i = 0; i < firstDay; i++) {
                        days.push(<div key={`empty-${i}`} className="p-1 sm:p-2"></div>);
                      }

                      for (let day = 1; day <= daysInMonth; day++) {
                        const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
                        days.push(
                          <button
                            key={day}
                            onClick={() => handleDateSelection(day)}
                            className={`p-1 sm:p-2 text-xs sm:text-sm rounded-lg hover:bg-slate-900 hover:text-white transition-colors duration-200 ${
                              isToday ? 'bg-black text-white' : 'text-gray-700 hover:text-white'
                            }`}
                          >
                            {day}
                          </button>
                        );
                      }

                      return days;
                    })()}
                  </div>
                </div>

                <div className="flex space-x-2 sm:space-x-3 rtl:space-x-reverse pt-3 sm:pt-4 border-t border-gray-200">
                  <button
                    onClick={closeModal}
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium text-xs sm:text-sm"
                  >
                    {t('calendar.cancel')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showDayEvents && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-60">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[90vw] sm:max-w-lg transform transition-all duration-300 scale-100 max-h-[80vh] overflow-hidden">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center space-x-2 sm:space-x-3 rtl:space-x-reverse">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                      <Calendar className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                        {t('calendar.events')}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {selectedDate?.toLocaleDateString(isArabic ? 'ar-EG' : 'en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  >
                    <X className="w-4 sm:w-5 h-4 sm:h-5 text-gray-500" />
                  </button>
                </div>

                <div className="max-h-[60vh] sm:max-h-96 overflow-y-auto">
                  {(() => {
                    const dateKey = selectedDate ? formatDate(selectedDate) : '';
                    const dayEvents = getSortedEvents(dateKey);
                    
                    if (dayEvents.length === 0) {
                      return (
                        <div className="text-center py-6 sm:py-8">
                          <Calendar className="w-10 sm:w-12 h-10 sm:h-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
                          <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">{t('calendar.no_events')}</p>
                          <button
                            onClick={() => handleCreateEvent(selectedDate)}
                            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-black text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 text-xs sm:text-sm"
                          >
                            {t('calendar.create_event')}
                          </button>
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-2 sm:space-y-3">
                        {dayEvents.map((event, idx) => (
                          <div
                            key={idx}
                            className="p-3 sm:p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200"
                            style={{ borderLeft: `4px solid ${event.color}` }}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-sm sm:text-base text-gray-800 mb-1 sm:mb-2">
                                  {event.title}
                                </h4>
                                {event.time && (
                                  <div className="flex items-center text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">
                                    <Clock className="w-3 sm:w-4 h-3 sm:h-4 mr-1" />
                                    {event.time}
                                  </div>
                                )}
                                {event.location && (
                                  <div className="flex items-center text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">
                                    <MapPin className="w-3 sm:w-4 h-3 sm:h-4 mr-1" />
                                    {event.location}
                                  </div>
                                )}
                                {event.description && (
                                  <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
                                    {event.description}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center space-x-2 sm:space-x-3 rtl:space-x-reverse">
                                <div
                                  className="w-3 sm:w-4 h-3 sm:h-4 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: event.color }}
                                />
                                <button
                                  onClick={() => handleEditEvent(event)}
                                  className="p-1 sm:p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200"
                                  title={t('calendar.edit_event')}
                                >
                                  <Edit className="w-3 sm:w-4 h-3 sm:h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteEvent(event)}
                                  className="p-1 sm:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
                                  title={t('calendar.delete_event')}
                                >
                                  <Trash2 className="w-3 sm:w-4 h-3 sm:h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>

                <div className="flex space-x-4 sm:space-x-6 rtl:space-x-reverse pt-4 sm:pt-6 border-t border-gray-200">
                  <button
                    onClick={closeModal}
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium text-xs sm:text-sm"
                  >
                    {t('calendar.close')}
                  </button>
                  <button
                    onClick={() => handleCreateEvent(selectedDate)}
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-black text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl flex items-center justify-center space-x-1 sm:space-x-2 rtl:space-x-reverse text-xs sm:text-sm"
                  >
                    <Plus className="w-3 sm:w-4 h-3 sm:h-4" />
                    <span>{t('calendar.add_event')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showEventModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-60">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[90vw] sm:max-w-md transform transition-all duration-300 scale-100">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center space-x-2 sm:space-x-3 rtl:space-x-reverse">
                    <div className="p-2 bg-black rounded-full">
                      <Plus className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                      {editingEvent ? t('calendar.edit_event') : t('calendar.create_event')}
                    </h3>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  >
                    <X className="w-4 sm:w-5 h-4 sm:h-5 text-gray-500" />
                  </button>
                </div>

                <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-black rounded-lg">
                  <p className="text-xs sm:text-sm text-white font-medium">
                    {selectedDate?.toLocaleDateString(isArabic ? 'ar-EG' : 'en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      {t('calendar.event_title')} *
                    </label>
                    <input
                      type="text"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 text-xs sm:text-sm"
                      placeholder={t('calendar.event_title_placeholder')}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        <Clock className="w-3 sm:w-4 h-3 sm:h-4 inline mr-1" />
                        {t('calendar.time')}
                      </label>
                      <input
                        type="time"
                        value={newEvent.time}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                        className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none transition-all duration-200 text-xs sm:text-sm"
                      />
                    </div>
                    
                    <div className="relative">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        {t('calendar.color')}
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowColorDropdown(!showColorDropdown)}
                        className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-transparent transition-all duration-200 flex items-center justify-between text-xs sm:text-sm"
                        style={{ backgroundColor: getSelectedColor().light }}
                      >
                        <div className="flex items-center space-x-1 sm:space-x-2 rtl:space-x-reverse">
                          <div
                            className="w-3 sm:w-4 h-3 sm:h-4 rounded-full"
                            style={{ backgroundColor: getSelectedColor().value }}
                          />
                          <span className="text-xs sm:text-sm text-gray-700">{t(`calendar.colors.${getSelectedColor().key}`)}</span>
                        </div>
                        <ChevronDown className="w-3 sm:w-4 h-3 sm:h-4 text-gray-400" />
                      </button>
                      
                      {showColorDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-40 sm:max-h-48 overflow-y-auto">
                          {eventColors.map((color) => (
                            <button
                              key={color.value}
                              type="button"
                              onClick={() => handleColorSelect(color.value)}
                              className="w-full p-2 sm:p-3 flex items-center space-x-2 sm:space-x-3 rtl:space-x-reverse hover:bg-gray-50 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg text-xs sm:text-sm"
                              style={{ backgroundColor: newEvent.color === color.value ? color.light : 'white' }}
                            >
                              <div
                                className="w-4 sm:w-5 h-4 sm:h-5 rounded-full border border-gray-200"
                                style={{ backgroundColor: color.value }}
                              />
                              <span className="text-xs sm:text-sm text-gray-700 font-medium">{t(`calendar.colors.${color.key}`)}</span>
                              {newEvent.color === color.value && (
                                <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full" />
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      <MapPin className="w-3 sm:w-4 h-3 sm:h-4 inline mr-1" />
                      {t('calendar.location')}
                    </label>
                    <input
                      type="text"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 text-xs sm:text-sm"
                      placeholder={t('calendar.location_placeholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      {t('calendar.description')}
                    </label>
                    <textarea
                      value={newEvent.description}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 resize-none text-xs sm:text-sm"
                      rows="3"
                      placeholder={t('calendar.description_placeholder')}
                    />
                  </div>

                  <div className="flex space-x-3 sm:space-x-4 rtl:space-x-reverse pt-3 sm:pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium text-xs sm:text-sm"
                    >
                      {t('calendar.cancel')}
                    </button>
                    <button
                      type="button"
                      onClick={handleEventSubmit}
                      className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-black text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl text-xs sm:text-sm"
                    >
                      {editingEvent ? t('calendar.update_event') : t('calendar.create_event')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarComponent;