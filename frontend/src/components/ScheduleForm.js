import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import { X, Save, Clock, MapPin } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';
import './ScheduleForm.css';

const ScheduleForm = ({ schedule, eventId, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: new Date(),
    endTime: new Date(),
    location: '',
    type: 'session',
    order: 0
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (schedule) {
      setFormData({
        title: schedule.title || '',
        description: schedule.description || '',
        startTime: new Date(schedule.startTime) || new Date(),
        endTime: new Date(schedule.endTime) || new Date(),
        location: schedule.location || '',
        type: schedule.type || 'session',
        order: schedule.order || 0
      });
    }
  }, [schedule]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Tiêu đề là bắt buộc';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Thời gian bắt đầu là bắt buộc';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'Thời gian kết thúc là bắt buộc';
    }

    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.endTime = 'Thời gian kết thúc phải sau thời gian bắt đầu';
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
      const scheduleData = {
        ...formData,
        eventId: eventId,
        startTime: formData.startTime.toISOString(),
        endTime: formData.endTime.toISOString()
      };

      let response;
      if (schedule) {
        // Update existing schedule
        response = await axios.put(`http://localhost:9999/api/schedules/${schedule._id}`, scheduleData);
      } else {
        // Create new schedule
        response = await axios.post('http://localhost:9999/api/schedules', scheduleData);
      }

      onSave(response.data);
    } catch (error) {
      console.error('Error saving schedule:', error);
      alert('Có lỗi xảy ra khi lưu lịch trình');
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
    <div className="schedule-form-overlay">
      <div className="schedule-form-modal">
        <div className="schedule-form-header">
          <h2>{schedule ? 'Sửa lịch trình' : 'Thêm lịch trình mới'}</h2>
          <button className="btn-close" onClick={onCancel}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="schedule-form">
          <div className="form-group">
            <label htmlFor="title">Tiêu đề *</label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={errors.title ? 'error' : ''}
              placeholder="Nhập tiêu đề lịch trình"
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Mô tả</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Nhập mô tả lịch trình"
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startTime">Thời gian bắt đầu *</label>
              <div className="datetime-picker-wrapper">
                <DatePicker
                  selected={formData.startTime}
                  onChange={(date) => handleInputChange('startTime', date)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="dd/MM/yyyy HH:mm"
                  className={errors.startTime ? 'error' : ''}
                  placeholderText="Chọn thời gian bắt đầu"
                />
                <Clock size={16} className="datetime-icon" />
              </div>
              {errors.startTime && <span className="error-message">{errors.startTime}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="endTime">Thời gian kết thúc *</label>
              <div className="datetime-picker-wrapper">
                <DatePicker
                  selected={formData.endTime}
                  onChange={(date) => handleInputChange('endTime', date)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="dd/MM/yyyy HH:mm"
                  minDate={formData.startTime}
                  className={errors.endTime ? 'error' : ''}
                  placeholderText="Chọn thời gian kết thúc"
                />
                <Clock size={16} className="datetime-icon" />
              </div>
              {errors.endTime && <span className="error-message">{errors.endTime}</span>}
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
              <label htmlFor="type">Loại lịch trình</label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
              >
                <option value="session">Phiên thảo luận</option>
                <option value="break">Nghỉ giải lao</option>
                <option value="workshop">Hội thảo</option>
                <option value="presentation">Thuyết trình</option>
                <option value="other">Khác</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="order">Thứ tự</label>
            <input
              type="number"
              id="order"
              value={formData.order}
              onChange={(e) => handleInputChange('order', parseInt(e.target.value) || 0)}
              placeholder="Nhập thứ tự"
              min="0"
            />
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
              {loading ? 'Đang lưu...' : (schedule ? 'Cập nhật' : 'Tạo lịch trình')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleForm; 