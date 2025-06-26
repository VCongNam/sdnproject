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
import { CalendarIcon, AtSignIcon, StarIcon } from '@chakra-ui/icons';
import 'react-datepicker/dist/react-datepicker.css';

const statusOptions = [
  { value: 'active', label: 'Đang diễn ra' },
  { value: 'cancelled', label: 'Đã huỷ' },
  { value: 'completed', label: 'Đã hoàn thành' },
];

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
  const toast = useToast();

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
    if (!formData.title.trim()) newErrors.title = 'Tiêu đề là bắt buộc';
    if (!formData.description.trim()) newErrors.description = 'Mô tả là bắt buộc';
    if (!formData.startDate) newErrors.startDate = 'Ngày bắt đầu là bắt buộc';
    if (!formData.endDate) newErrors.endDate = 'Ngày kết thúc là bắt buộc';
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const eventData = {
        ...formData,
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate.toISOString()
      };
      let response;
      if (event) {
        response = await axios.put(`http://localhost:9999/api/events/${event._id}`, eventData);
      } else {
        response = await axios.post('http://localhost:9999/api/events', eventData);
      }
      toast({
        title: "Thành công",
        description: event ? "Đã cập nhật sự kiện" : "Đã tạo sự kiện mới",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onSave(response.data);
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi lưu sự kiện",
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
    border: errors.startDate || errors.endDate ? '1px solid #E53E3E' : '1px solid #E2E8F0',
    borderRadius: '6px',
    fontSize: '14px'
  };

  return (
    <Modal isOpen={true} onClose={onCancel} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{event ? 'Sửa sự kiện' : 'Thêm sự kiện mới'}</ModalHeader>
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isInvalid={!!errors.title}>
                <FormLabel>Tiêu đề *</FormLabel>
                <Input
                  value={formData.title}
                  onChange={e => handleInputChange('title', e.target.value)}
                  placeholder="Nhập tiêu đề sự kiện"
                  autoFocus
                />
                {errors.title && <Text color="red.500" fontSize="sm" mt={1}>{errors.title}</Text>}
              </FormControl>

              <FormControl isInvalid={!!errors.description}>
                <FormLabel>Mô tả *</FormLabel>
                <Textarea
                  value={formData.description}
                  onChange={e => handleInputChange('description', e.target.value)}
                  placeholder="Nhập mô tả sự kiện"
                  rows={3}
                />
                {errors.description && <Text color="red.500" fontSize="sm" mt={1}>{errors.description}</Text>}
              </FormControl>

              <HStack spacing={4} w="full">
                <FormControl isInvalid={!!errors.startDate}>
                  <FormLabel>Ngày bắt đầu *</FormLabel>
                  <Box position="relative">
                    <DatePicker
                      selected={formData.startDate}
                      onChange={date => handleInputChange('startDate', date)}
                      showTimeSelect={false}
                      dateFormat="dd/MM/yyyy"
                      style={customDatePickerStyle}
                      placeholderText="Chọn ngày bắt đầu"
                    />
                    <Icon as={CalendarIcon} position="absolute" right={3} top="50%" transform="translateY(-50%)" color="gray.400" />
                  </Box>
                  {errors.startDate && <Text color="red.500" fontSize="sm" mt={1}>{errors.startDate}</Text>}
                </FormControl>

                <FormControl isInvalid={!!errors.endDate}>
                  <FormLabel>Ngày kết thúc *</FormLabel>
                  <Box position="relative">
                    <DatePicker
                      selected={formData.endDate}
                      onChange={date => handleInputChange('endDate', date)}
                      showTimeSelect={false}
                      dateFormat="dd/MM/yyyy"
                      minDate={formData.startDate}
                      style={customDatePickerStyle}
                      placeholderText="Chọn ngày kết thúc"
                    />
                    <Icon as={CalendarIcon} position="absolute" right={3} top="50%" transform="translateY(-50%)" color="gray.400" />
                  </Box>
                  {errors.endDate && <Text color="red.500" fontSize="sm" mt={1}>{errors.endDate}</Text>}
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
                  <FormLabel>Danh mục</FormLabel>
                  <Box position="relative">
                    <Input
                      value={formData.category}
                      onChange={e => handleInputChange('category', e.target.value)}
                      placeholder="Nhập danh mục"
                      pr={10}
                    />
                    <Icon as={StarIcon} position="absolute" right={3} top="50%" transform="translateY(-50%)" color="gray.400" />
                  </Box>
                </FormControl>
              </HStack>

              <FormControl>
                <FormLabel>Trạng thái</FormLabel>
                <Select
                  value={formData.status}
                  onChange={e => handleInputChange('status', e.target.value)}
                >
                  {statusOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </Select>
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
              loadingText={event ? 'Đang cập nhật...' : 'Đang tạo...'}
            >
              {event ? 'Cập nhật' : 'Tạo sự kiện'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default EventForm; 