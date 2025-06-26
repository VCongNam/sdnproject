import React, { useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Button,
  useColorModeValue,
  Container
} from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import EventList from './components/EventList';
import EventForm from './components/EventForm';
import ScheduleList from './components/ScheduleList';
import ScheduleForm from './components/ScheduleForm';

function App() {
  const [showEventForm, setShowEventForm] = useState(false);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [currentView, setCurrentView] = useState('events'); // 'events' or 'schedules'

  const bgColor = useColorModeValue('blue.500', 'blue.600');
  const textColor = useColorModeValue('white', 'white');

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setShowEventForm(true);
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setShowEventForm(true);
  };

  const handleSaveEvent = (savedEvent) => {
    setShowEventForm(false);
    setSelectedEvent(null);
    // Refresh event list by triggering a re-render
    window.location.reload();
  };

  const handleCancelEvent = () => {
    setShowEventForm(false);
    setSelectedEvent(null);
  };

  const handleAddSchedule = () => {
    setSelectedSchedule(null);
    setShowScheduleForm(true);
  };

  const handleEditSchedule = (schedule) => {
    setSelectedSchedule(schedule);
    setShowScheduleForm(true);
  };

  const handleSaveSchedule = (savedSchedule) => {
    setShowScheduleForm(false);
    setSelectedSchedule(null);
    // Refresh schedule list by triggering a re-render
    window.location.reload();
  };

  const handleCancelSchedule = () => {
    setShowScheduleForm(false);
    setSelectedSchedule(null);
  };

  const handleViewSchedules = (event) => {
    setSelectedEvent(event);
    setCurrentView('schedules');
  };

  const handleBackToEvents = () => {
    setCurrentView('events');
    setSelectedEvent(null);
  };

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      <Box bg={bgColor} color={textColor} px={6} py={4} boxShadow="md">
        <Flex justify="space-between" align="center" maxW="1200px" mx="auto">
          <Heading size="lg" m={0}>
            Quản lý sự kiện
          </Heading>
          {currentView === 'schedules' && selectedEvent && (
            <Button
              leftIcon={<ChevronLeftIcon />}
              variant="ghost"
              color={textColor}
              _hover={{ bg: 'whiteAlpha.200' }}
              onClick={handleBackToEvents}
            >
              Quay lại danh sách sự kiện
            </Button>
          )}
        </Flex>
      </Box>

      <Container maxW="1200px" py={8}>
        {currentView === 'events' ? (
          <EventList 
            onEditEvent={handleEditEvent}
            onAddEvent={handleAddEvent}
            onViewSchedules={handleViewSchedules}
          />
        ) : (
          <ScheduleList
            eventId={selectedEvent?._id}
            eventTitle={selectedEvent?.title}
            onEditSchedule={handleEditSchedule}
            onAddSchedule={handleAddSchedule}
          />
        )}
      </Container>

      {showEventForm && (
        <EventForm
          event={selectedEvent}
          onSave={handleSaveEvent}
          onCancel={handleCancelEvent}
        />
      )}

      {showScheduleForm && (
        <ScheduleForm
          schedule={selectedSchedule}
          eventId={selectedEvent?._id}
          onSave={handleSaveSchedule}
          onCancel={handleCancelSchedule}
        />
      )}
    </Box>
  );
}

// import React, { useState } from 'react';
// import './App.css';
// import EventList from './components/EventList';
// import EventForm from './components/EventForm';
// import ScheduleList from './components/ScheduleList';
// import ScheduleForm from './components/ScheduleForm';

// function App() {
//   const [showEventForm, setShowEventForm] = useState(false);
//   const [showScheduleForm, setShowScheduleForm] = useState(false);
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [selectedSchedule, setSelectedSchedule] = useState(null);
//   const [currentView, setCurrentView] = useState('events'); // 'events' or 'schedules'

//   const handleAddEvent = () => {
//     setSelectedEvent(null);
//     setShowEventForm(true);
//   };

//   const handleEditEvent = (event) => {
//     setSelectedEvent(event);
//     setShowEventForm(true);
//   };

//   const handleSaveEvent = (savedEvent) => {
//     setShowEventForm(false);
//     setSelectedEvent(null);
//     // Refresh event list by triggering a re-render
//     window.location.reload();
//   };

//   const handleCancelEvent = () => {
//     setShowEventForm(false);
//     setSelectedEvent(null);
//   };

//   const handleAddSchedule = () => {
//     setSelectedSchedule(null);
//     setShowScheduleForm(true);
//   };

//   const handleEditSchedule = (schedule) => {
//     setSelectedSchedule(schedule);
//     setShowScheduleForm(true);
//   };

//   const handleSaveSchedule = (savedSchedule) => {
//     setShowScheduleForm(false);
//     setSelectedSchedule(null);
//     // Refresh schedule list by triggering a re-render
//     window.location.reload();
//   };

//   const handleCancelSchedule = () => {
//     setShowScheduleForm(false);
//     setSelectedSchedule(null);
//   };

//   const handleViewSchedules = (event) => {
//     setSelectedEvent(event);
//     setCurrentView('schedules');
//   };

//   const handleBackToEvents = () => {
//     setCurrentView('events');
//     setSelectedEvent(null);
//   };

//   return (
//     <div className="App">
//       <header className="App-header">
//         <h1>Quản lý sự kiện</h1>
//         {currentView === 'schedules' && selectedEvent && (
//           <button className="btn-back" onClick={handleBackToEvents}>
//             ← Quay lại danh sách sự kiện
//           </button>
//         )}
//       </header>

//       <main className="App-main">
//         {currentView === 'events' ? (
//           <EventList 
//             onEditEvent={handleEditEvent}
//             onAddEvent={handleAddEvent}
//             onViewSchedules={handleViewSchedules}
//           />
//         ) : (
//           <ScheduleList
//             eventId={selectedEvent?._id}
//             eventTitle={selectedEvent?.title}
//             onEditSchedule={handleEditSchedule}
//             onAddSchedule={handleAddSchedule}
//           />
//         )}
//       </main>

//       {showEventForm && (
//         <EventForm
//           event={selectedEvent}
//           onSave={handleSaveEvent}
//           onCancel={handleCancelEvent}
//         />
//       )}

//       {showScheduleForm && (
//         <ScheduleForm
//           schedule={selectedSchedule}
//           eventId={selectedEvent?._id}
//           onSave={handleSaveSchedule}
//           onCancel={handleCancelSchedule}
//         />
//       )}
//     </div>
//   );
// }

export default App;
