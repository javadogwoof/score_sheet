import Calendar from '@/components/Calendar';
import { Modal } from '@/components/Modal';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDateSelect: (date: Date) => void;
  selectedDate?: Date;
}

export const CalendarModal = ({
  isOpen,
  onClose,
  onDateSelect,
  selectedDate,
}: CalendarModalProps) => {
  const handleDateSelect = (date: Date) => {
    onDateSelect(date);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="日付を選択">
      <Calendar onDateSelect={handleDateSelect} value={selectedDate} />
    </Modal>
  );
};
