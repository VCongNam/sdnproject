import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import {
  Box,
  Flex,
  Heading,
  Button,
  Select,
  VStack,
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
import { AtSignIcon, EditIcon, DeleteIcon, AddIcon, CalendarIcon } from '@chakra-ui/icons';

const typeMap = {
  session: { color: "blue", text: "Phiên thảo luận" },
  break: { color: "yellow", text: "Nghỉ giải lao" },
  workshop: { color: "green", text: "Hội thảo" },
  presentation: { color: "purple", text: "Thuyết trình" },
  other: { color: "gray", text: "Khác" },
};

const ScheduleList = ({ eventId, eventTitle, onEditSchedule, onAddSchedule }) => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const toast = useToast();

  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    if (eventId) {
      fetchSchedules();
    }
    // eslint-disable-next-line
  }, [eventId]);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const params = {};
      if (typeFilter) params.type = typeFilter;
      const response = await axios.get(`http://localhost:9999/api/schedules/event/${eventId}`, { params });
      setSchedules(response.data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách lịch trình",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (scheduleId) => {
    if (window.confirm('Bạn có chắc chắn muốn xoá lịch trình này?')) {
      try {
        await axios.delete(`http://localhost:9999/api/schedules/${scheduleId}`);
        toast({
          title: "Thành công",
          description: "Đã xoá lịch trình",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        fetchSchedules();
      } catch (error) {
        console.error('Error deleting schedule:', error);
        toast({
          title: "Lỗi",
          description: "Không thể xoá lịch trình",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const formatTime = (date) => format(new Date(date), 'HH:mm');
  const formatDate = (date) => format(new Date(date), 'dd/MM/yyyy');

  return (
    <Box maxW="800px" mx="auto">
      <Flex justify="space-between" align="start" mb={6}>
        <Box>
          <Heading size="lg">Lịch trình sự kiện</Heading>
          {eventTitle && <Text color="gray.500" fontSize="sm" mt={1}>{eventTitle}</Text>}
        </Box>
        <Button
          leftIcon={<AddIcon />}
          colorScheme="blue"
          onClick={onAddSchedule}
        >
          Thêm lịch trình
        </Button>
      </Flex>

      

      <VStack spacing={4} align="stretch">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} bg={cardBg} border="1px" borderColor={borderColor}>
              <CardHeader>
                <Skeleton height="18px" width="50%" mb={2} />
                <Skeleton height="14px" width="25%" />
              </CardHeader>
              <CardBody>
                <SkeletonText noOfLines={2} spacing={2} />
              </CardBody>
              <CardFooter>
                <Skeleton height="32px" width="60px" mr={2} />
                <Skeleton height="32px" width="60px" />
              </CardFooter>
            </Card>
          ))
        ) : schedules.length === 0 ? (
          <Box textAlign="center" py={10} color="gray.500">
            Chưa có lịch trình nào
          </Box>
        ) : (
          schedules.map(schedule => (
            <Card key={schedule._id} bg={cardBg} border="1px" borderColor={borderColor} _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }} transition="all 0.2s">
              <Flex direction={{ base: 'column', md: 'row' }} align={{ base: 'stretch', md: 'center' }} gap={4}>
                <CardHeader flexShrink={0} minW="120px">
                  <Flex direction="column" align="center" gap={2}>
                    <Box textAlign="center">
                      <Text fontSize="lg" fontWeight="bold" fontFamily="mono">
                        {formatTime(schedule.startTime)}
                      </Text>
                      <Text fontSize="xs" color="gray.400">
                        {formatDate(schedule.startTime)}
                      </Text>
                    </Box>
                    <Box textAlign="center">
                      <Text fontSize="lg" fontWeight="bold" fontFamily="mono">
                        {formatTime(schedule.endTime)}
                      </Text>
                      <Text fontSize="xs" color="gray.400">
                        {formatDate(schedule.endTime)}
                      </Text>
                    </Box>
                  </Flex>
                </CardHeader>

                <CardBody flex={1}>
                  <Flex justify="space-between" align="start" mb={2}>
                    <Heading size="md" noOfLines={1} flex={1} mr={2}>
                      {schedule.title}
                    </Heading>
                    <Badge colorScheme={typeMap[schedule.type]?.color || "gray"}>
                      {typeMap[schedule.type]?.text || schedule.type}
                    </Badge>
                  </Flex>
                  
                  {schedule.description && (
                    <Text color="gray.600" noOfLines={2} mb={3} minH="32px">
                      {schedule.description}
                    </Text>
                  )}
                  
                  <Flex flexWrap="wrap" gap={2} color="gray.500" fontSize="sm">
                    {schedule.location && (
                      <Flex align="center" gap={1}>
                        <Icon as={AtSignIcon} boxSize={3} />
                        <Text>{schedule.location}</Text>
                      </Flex>
                    )}
                    <Flex align="center" gap={1}>
                      <Icon as={CalendarIcon} boxSize={3} />
                      <Text>{formatDate(schedule.startTime)}</Text>
                    </Flex>
                  </Flex>
                </CardBody>

                <CardFooter flexShrink={0} minW="120px">
                  <Flex gap={2} direction={{ base: 'row', md: 'column' }} w="full">
                    <Button
                      leftIcon={<EditIcon />}
                      size="sm"
                      colorScheme="blue"
                      variant="outline"
                      onClick={() => onEditSchedule(schedule)}
                      flex={1}
                    >
                      Sửa
                    </Button>
                    <Button
                      leftIcon={<DeleteIcon />}
                      size="sm"
                      colorScheme="red"
                      variant="outline"
                      onClick={() => handleDelete(schedule._id)}
                      flex={1}
                    >
                      Xoá
                    </Button>
                  </Flex>
                </CardFooter>
              </Flex>
            </Card>
          ))
        )}
      </VStack>
    </Box>
  );
};

export default ScheduleList; 