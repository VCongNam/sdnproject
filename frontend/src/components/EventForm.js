import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import { X, Save, Calendar, MapPin, Tag } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';
import './EventForm.css';

const EventForm = ({ event, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    location: '',
    category: '',
    status: 'active'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        startDate: new Date(event.startDate) || new Date(),
        endDate: new Date(event.endDate) || new Date(),
        location: event.location || '',
        category: event.category || '',
        status: event.status || 'active'
      });
    }
  }, [event]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Tiêu đề là bắt buộc';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Mô tả là bắt buộc';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Ngày bắt đầu là bắt buộc';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'Ngày kết thúc là bắt buộc';
    }

    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const eventData = {
        ...formData,
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate.toISOString()
      };

      let response;
      if (event) {
        // Update existing event
        response = await axios.put(`http://localhost:9999/api/events/${event._id}`, eventData);
      } else {
        // Create new event
        response = await axios.post('http://localhost:9999/api/events', eventData);
      }

      onSave(response.data);
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Có lỗi xảy ra khi lưu sự kiện');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <div className="event-form-overlay">
      <div className="event-form-modal">
        <div className="event-form-header">
          <h2>{event ? 'Sửa sự kiện' : 'Thêm sự kiện mới'}</h2>
          <button className="btn-close" onClick={onCancel}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-group">
            <label htmlFor="title">Tiêu đề *</label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={errors.title ? 'error' : ''}
              placeholder="Nhập tiêu đề sự kiện"
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Mô tả *</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={errors.description ? 'error' : ''}
              placeholder="Nhập mô tả sự kiện"
              rows="3"
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Ngày bắt đầu *</label>
              <div className="date-picker-wrapper">
                <DatePicker
                  selected={formData.startDate}
                  onChange={(date) => handleInputChange('startDate', date)}
                  showTimeSelect={false}
                  dateFormat="dd/MM/yyyy"
                  className={errors.startDate ? 'error' : ''}
                  placeholderText="Chọn ngày bắt đầu"
                />
                <Calendar size={16} className="date-icon" />
              </div>
              {errors.startDate && <span className="error-message">{errors.startDate}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="endDate">Ngày kết thúc *</label>
              <div className="date-picker-wrapper">
                <DatePicker
                  selected={formData.endDate}
                  onChange={(date) => handleInputChange('endDate', date)}
                  showTimeSelect={false}
                  dateFormat="dd/MM/yyyy"
                  minDate={formData.startDate}
                  className={errors.endDate ? 'error' : ''}
                  placeholderText="Chọn ngày kết thúc"
                />
                <Calendar size={16} className="date-icon" />
              </div>
              {errors.endDate && <span className="error-message">{errors.endDate}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Địa điểm</label>
              <div className="input-with-icon">
                <input
                  type="text"
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Nhập địa điểm"
                />
                <MapPin size={16} className="input-icon" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="category">Danh mục</label>
              <div className="input-with-icon">
                <input
                  type="text"
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  placeholder="Nhập danh mục"
                />
                <Tag size={16} className="input-icon" />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="status">Trạng thái</label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
            >
              <option value="active">Đang diễn ra</option>
              <option value="cancelled">Đã hủy</option>
              <option value="completed">Đã hoàn thành</option>
            </select>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onCancel}
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn-save"
              disabled={loading}
            >
              <Save size={16} />
              {loading ? 'Đang lưu...' : (event ? 'Cập nhật' : 'Tạo sự kiện')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm; 