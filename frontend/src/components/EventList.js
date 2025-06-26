import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import {
  Box,
  Flex,
  Heading,
  Button,
  Input,
  Select,
  Grid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Badge,
  Text,
  Icon,
  Skeleton,
  SkeletonText,
  useToast,
  useColorModeValue
} from '@chakra-ui/react';
import { CalendarIcon, AtSignIcon, EditIcon, DeleteIcon, AddIcon, TimeIcon } from '@chakra-ui/icons';

const statusMap = {
  active: { color: "green", text: "Đang diễn ra" },
  cancelled: { color: "red", text: "Đã huỷ" },
  completed: { color: "gray", text: "Đã hoàn thành" },
};

const EventList = ({ onEditEvent, onAddEvent, onViewSchedules }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const toast = useToast();

  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (statusFilter) params.status = statusFilter;
      const response = await axios.get('http://localhost:9999/api/events', { params });
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách sự kiện",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('Bạn có chắc chắn muốn xoá sự kiện này?')) {
      try {
        await axios.delete(`http://localhost:9999/api/events/${eventId}`);
        toast({
          title: "Thành công",
          description: "Đã xoá sự kiện",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        fetchEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
        toast({
          title: "Lỗi",
          description: "Không thể xoá sự kiện",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Danh sách sự kiện</Heading>
        <Button
          leftIcon={<AddIcon />}
          colorScheme="blue"
          onClick={onAddEvent}
        >
          Thêm sự kiện
        </Button>
      </Flex>

      <Flex gap={4} mb={6} direction={{ base: 'column', md: 'row' }}>
        <Input
          placeholder="Tìm kiếm sự kiện..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          maxW={{ base: 'full', md: '300px' }}
        />
        <Select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          maxW={{ base: 'full', md: '200px' }}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="active">Đang diễn ra</option>
          <option value="cancelled">Đã huỷ</option>
          <option value="completed">Đã hoàn thành</option>
        </Select>
        <Button variant="outline" onClick={fetchEvents}>
          Tìm kiếm
        </Button>
      </Flex>

      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} bg={cardBg} border="1px" borderColor={borderColor}>
              <CardHeader>
                <Skeleton height="20px" width="60%" mb={2} />
                <Skeleton height="16px" width="40%" />
              </CardHeader>
              <CardBody>
                <SkeletonText noOfLines={2} spacing={2} />
              </CardBody>
              <CardFooter>
                <Skeleton height="32px" width="80px" mr={2} />
                <Skeleton height="32px" width="60px" mr={2} />
                <Skeleton height="32px" width="60px" />
              </CardFooter>
            </Card>
          ))
        ) : events.length === 0 ? (
          <Box gridColumn="1 / -1" textAlign="center" py={10} color="gray.500">
            Không có sự kiện nào
          </Box>
        ) : (
          events.map(event => (
            <Card key={event._id} bg={cardBg} border="1px" borderColor={borderColor} _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }} transition="all 0.2s">
              <CardHeader>
                <Flex justify="space-between" align="start" gap={2}>
                  <Heading size="md" noOfLines={1} flex={1}>
                    {event.title}
                  </Heading>
                  <Badge colorScheme={statusMap[event.status]?.color || "gray"}>
                    {statusMap[event.status]?.text || event.status}
                  </Badge>
                </Flex>
              </CardHeader>
              <CardBody pt={0}>
                <Text color="gray.600" noOfLines={2} mb={4} minH="40px">
                  {event.description}
                </Text>
                <Box>
                  <Flex align="center" gap={2} mb={2} color="gray.500" fontSize="sm">
                    <Icon as={CalendarIcon} />
                    <Text>
                      {format(new Date(event.startDate), 'dd/MM/yyyy')} - {format(new Date(event.endDate), 'dd/MM/yyyy')}
                    </Text>
                  </Flex>
                  {event.location && (
                    <Flex align="center" gap={2} mb={2} color="gray.500" fontSize="sm">
                      <Icon as={AtSignIcon} />
                      <Text>{event.location}</Text>
                    </Flex>
                  )}
                  {event.category && (
                    <Badge colorScheme="blue" variant="subtle" fontSize="xs">
                      {event.category}
                    </Badge>
                  )}
                </Box>
              </CardBody>
              <CardFooter pt={0}>
                <Flex gap={2} w="full">
                  <Button
                    leftIcon={<TimeIcon />}
                    size="sm"
                    colorScheme="teal"
                    variant="outline"
                    onClick={() => onViewSchedules(event)}
                    flex={1}
                  >
                    Lịch trình
                  </Button>
                  <Button
                    leftIcon={<EditIcon />}
                    size="sm"
                    colorScheme="blue"
                    variant="outline"
                    onClick={() => onEditEvent(event)}
                    flex={1}
                  >
                    Sửa
                  </Button>
                  <Button
                    leftIcon={<DeleteIcon />}
                    size="sm"
                    colorScheme="red"
                    variant="outline"
                    onClick={() => handleDelete(event._id)}
                    flex={1}
                  >
                    Xoá
                  </Button>
                </Flex>
              </CardFooter>
            </Card>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default EventList; 