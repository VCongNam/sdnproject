import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { Clock, MapPin, Edit, Trash2, Plus, Calendar } from 'lucide-react';
import './ScheduleList.css';

const ScheduleList = ({ eventId, eventTitle, onEditSchedule, onAddSchedule }) => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    if (eventId) {
      fetchSchedules();
    }
  }, [eventId]);

  const fetchSchedules = async () => {
    try {
      const params = {};
      if (typeFilter) params.type = typeFilter;
      
      const response = await axios.get(`http://localhost:9999/api/schedules/event/${eventId}`, { params });
      setSchedules(response.data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (scheduleId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lịch trình này?')) {
      try {
        await axios.delete(`http://localhost:9999/api/schedules/${scheduleId}`);
        fetchSchedules();
      } catch (error) {
        console.error('Error deleting schedule:', error);
      }
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'session': return 'type-session';
      case 'break': return 'type-break';
      case 'workshop': return 'type-workshop';
      case 'presentation': return 'type-presentation';
      case 'other': return 'type-other';
      default: return '';
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'session': return 'Phiên thảo luận';
      case 'break': return 'Nghỉ giải lao';
      case 'workshop': return 'Hội thảo';
      case 'presentation': return 'Thuyết trình';
      case 'other': return 'Khác';
      default: return type;
    }
  };

  const formatTime = (date) => {
    return format(new Date(date), 'HH:mm');
  };

  const formatDate = (date) => {
    return format(new Date(date), 'dd/MM/yyyy');
  };

  if (loading) {
    return <div className="loading">Đang tải lịch trình...</div>;
  }

  return (
    <div className="schedule-list">
      <div className="schedule-list-header">
        <div className="schedule-title">
          <h2>Lịch trình sự kiện</h2>
          {eventTitle && <p className="event-title">{eventTitle}</p>}
        </div>
        <button className="btn-add" onClick={onAddSchedule}>
          <Plus size={16} />
          Thêm lịch trình
        </button>
      </div>

      <div className="schedule-filters">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="type-filter"
        >
          <option value="">Tất cả loại</option>
          <option value="session">Phiên thảo luận</option>
          <option value="break">Nghỉ giải lao</option>
          <option value="workshop">Hội thảo</option>
          <option value="presentation">Thuyết trình</option>
          <option value="other">Khác</option>
        </select>
        <button onClick={fetchSchedules} className="btn-refresh">
          Làm mới
        </button>
      </div>

      <div className="schedule-timeline">
        {schedules.length === 0 ? (
          <div className="no-schedules">Chưa có lịch trình nào</div>
        ) : (
          schedules.map((schedule, index) => (
            <div key={schedule._id} className="schedule-item">
              <div className="schedule-time">
                <div className="time-start">{formatTime(schedule.startTime)}</div>
                <div className="time-end">{formatTime(schedule.endTime)}</div>
              </div>
              
              <div className="schedule-content">
                <div className="schedule-header">
                  <h3 className="schedule-title">{schedule.title}</h3>
                  <span className={`type-badge ${getTypeColor(schedule.type)}`}>
                    {getTypeText(schedule.type)}
                  </span>
                </div>
                
                {schedule.description && (
                  <p className="schedule-description">{schedule.description}</p>
                )}
                
                <div className="schedule-details">
                  {schedule.location && (
                    <div className="schedule-detail">
                      <MapPin size={14} />
                      <span>{schedule.location}</span>
                    </div>
                  )}
                  
                  <div className="schedule-detail">
                    <Calendar size={14} />
                    <span>{formatDate(schedule.startTime)}</span>
                  </div>
                </div>

                <div className="schedule-actions">
                  <button
                    className="btn-edit"
                    onClick={() => onEditSchedule(schedule)}
                  >
                    <Edit size={14} />
                    Sửa
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(schedule._id)}
                  >
                    <Trash2 size={14} />
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ScheduleList; 