import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  VStack,
  HStack,
  Text,
  useToast,
  Box,
  Icon
} from '@chakra-ui/react';
import { TimeIcon, AtSignIcon } from '@chakra-ui/icons';
import 'react-datepicker/dist/react-datepicker.css';

const typeOptions = [
  { value: 'session', label: 'Phiên thảo luận' },
  { value: 'break', label: 'Nghỉ giải lao' },
  { value: 'workshop', label: 'Hội thảo' },
  { value: 'presentation', label: 'Thuyết trình' },
  { value: 'other', label: 'Khác' },
];

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
  const toast = useToast();

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
    if (!formData.title.trim()) newErrors.title = 'Tiêu đề là bắt buộc';
    if (!formData.startTime) newErrors.startTime = 'Thời gian bắt đầu là bắt buộc';
    if (!formData.endTime) newErrors.endTime = 'Thời gian kết thúc là bắt buộc';
    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) newErrors.endTime = 'Thời gian kết thúc phải sau thời gian bắt đầu';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
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
        response = await axios.put(`http://localhost:9999/api/schedules/${schedule._id}`, scheduleData);
      } else {
        response = await axios.post('http://localhost:9999/api/schedules', scheduleData);
      }
      toast({
        title: "Thành công",
        description: schedule ? "Đã cập nhật lịch trình" : "Đã tạo lịch trình mới",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onSave(response.data);
    } catch (error) {
      console.error('Error saving schedule:', error);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi lưu lịch trình",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const customDatePickerStyle = {
    width: '100%',
    padding: '8px 12px',
    border: errors.startTime || errors.endTime ? '1px solid #E53E3E' : '1px solid #E2E8F0',
    borderRadius: '6px',
    fontSize: '14px'
  };

  return (
    <Modal isOpen={true} onClose={onCancel} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{schedule ? 'Sửa lịch trình' : 'Thêm lịch trình mới'}</ModalHeader>
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isInvalid={!!errors.title}>
                <FormLabel>Tiêu đề *</FormLabel>
                <Input
                  value={formData.title}
                  onChange={e => handleInputChange('title', e.target.value)}
                  placeholder="Nhập tiêu đề lịch trình"
                  autoFocus
                />
                {errors.title && <Text color="red.500" fontSize="sm" mt={1}>{errors.title}</Text>}
              </FormControl>

              <FormControl>
                <FormLabel>Mô tả</FormLabel>
                <Textarea
                  value={formData.description}
                  onChange={e => handleInputChange('description', e.target.value)}
                  placeholder="Nhập mô tả lịch trình"
                  rows={3}
                />
              </FormControl>

              <HStack spacing={4} w="full">
                <FormControl isInvalid={!!errors.startTime}>
                  <FormLabel>Thời gian bắt đầu *</FormLabel>
                  <Box position="relative">
                    <DatePicker
                      selected={formData.startTime}
                      onChange={date => handleInputChange('startTime', date)}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      dateFormat="dd/MM/yyyy HH:mm"
                      style={customDatePickerStyle}
                      placeholderText="Chọn thời gian bắt đầu"
                    />
                    <Icon as={TimeIcon} position="absolute" right={3} top="50%" transform="translateY(-50%)" color="gray.400" />
                  </Box>
                  {errors.startTime && <Text color="red.500" fontSize="sm" mt={1}>{errors.startTime}</Text>}
                </FormControl>

                <FormControl isInvalid={!!errors.endTime}>
                  <FormLabel>Thời gian kết thúc *</FormLabel>
                  <Box position="relative">
                    <DatePicker
                      selected={formData.endTime}
                      onChange={date => handleInputChange('endTime', date)}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      dateFormat="dd/MM/yyyy HH:mm"
                      minDate={formData.startTime}
                      style={customDatePickerStyle}
                      placeholderText="Chọn thời gian kết thúc"
                    />
                    <Icon as={TimeIcon} position="absolute" right={3} top="50%" transform="translateY(-50%)" color="gray.400" />
                  </Box>
                  {errors.endTime && <Text color="red.500" fontSize="sm" mt={1}>{errors.endTime}</Text>}
                </FormControl>
              </HStack>

              <HStack spacing={4} w="full">
                <FormControl>
                  <FormLabel>Địa điểm</FormLabel>
                  <Box position="relative">
                    <Input
                      value={formData.location}
                      onChange={e => handleInputChange('location', e.target.value)}
                      placeholder="Nhập địa điểm"
                      pr={10}
                    />
                    <Icon as={AtSignIcon} position="absolute" right={3} top="50%" transform="translateY(-50%)" color="gray.400" />
                  </Box>
                </FormControl>

                <FormControl>
                  <FormLabel>Loại lịch trình</FormLabel>
                  <Select
                    value={formData.type}
                    onChange={e => handleInputChange('type', e.target.value)}
                  >
                    {typeOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </Select>
                </FormControl>
              </HStack>

              <FormControl>
                <FormLabel>Thứ tự</FormLabel>
                <Input
                  type="number"
                  value={formData.order}
                  onChange={e => handleInputChange('order', parseInt(e.target.value) || 0)}
                  placeholder="Nhập thứ tự"
                  min={0}
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onCancel} disabled={loading}>
              Huỷ
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              isLoading={loading}
              loadingText={schedule ? 'Đang cập nhật...' : 'Đang tạo...'}
            >
              {schedule ? 'Cập nhật' : 'Tạo lịch trình'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default ScheduleForm; 