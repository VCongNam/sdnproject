import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { Calendar, MapPin, Clock, Edit, Trash2, Plus, CalendarDays } from 'lucide-react';
import './EventList.css';

const EventList = ({ onEditEvent, onAddEvent, onViewSchedules }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (statusFilter) params.status = statusFilter;
      
      const response = await axios.get('http://localhost:9999/api/events', { params });
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sự kiện này?')) {
      try {
        await axios.delete(`http://localhost:9999/api/events/${eventId}`);
        fetchEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'status-active';
      case 'cancelled': return 'status-cancelled';
      case 'completed': return 'status-completed';
      default: return '';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Đang diễn ra';
      case 'cancelled': return 'Đã hủy';
      case 'completed': return 'Đã hoàn thành';
      default: return status;
    }
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="event-list">
      <div className="event-list-header">
        <h2>Danh sách sự kiện</h2>
        <button className="btn-add" onClick={onAddEvent}>
          <Plus size={16} />
          Thêm sự kiện
        </button>
      </div>

      <div className="event-filters">
        <input
          type="text"
          placeholder="Tìm kiếm sự kiện..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="status-filter"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="active">Đang diễn ra</option>
          <option value="cancelled">Đã hủy</option>
          <option value="completed">Đã hoàn thành</option>
        </select>
        <button onClick={fetchEvents} className="btn-refresh">
          Làm mới
        </button>
      </div>

      <div className="events-grid">
        {events.length === 0 ? (
          <div className="no-events">Không có sự kiện nào</div>
        ) : (
          events.map((event) => (
            <div key={event._id} className="event-card">
              <div className="event-header">
                <h3 className="event-title">{event.title}</h3>
                <span className={`status-badge ${getStatusColor(event.status)}`}>
                  {getStatusText(event.status)}
                </span>
              </div>
              
              <p className="event-description">{event.description}</p>
              
              <div className="event-details">
                <div className="event-detail">
                  <Calendar size={16} />
                  <span>
                    {format(new Date(event.startDate), 'dd/MM/yyyy')} - {format(new Date(event.endDate), 'dd/MM/yyyy')}
                  </span>
                </div>
                
                {event.location && (
                  <div className="event-detail">
                    <MapPin size={16} />
                    <span>{event.location}</span>
                  </div>
                )}
                
                {event.category && (
                  <div className="event-detail">
                    <span className="category-tag">{event.category}</span>
                  </div>
                )}
              </div>

              <div className="event-actions">
                <button
                  className="btn-schedule"
                  onClick={() => onViewSchedules(event)}
                >
                  <CalendarDays size={16} />
                  Lịch trình
                </button>
                <button
                  className="btn-edit"
                  onClick={() => onEditEvent(event)}
                >
                  <Edit size={16} />
                  Sửa
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(event._id)}
                >
                  <Trash2 size={16} />
                  Xóa
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventList; 