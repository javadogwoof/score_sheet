import Calendar from '@/components/Calendar';
import { Modal } from '@/components/Modal';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDateSelect: (date: Date) => void;
  selectedDate?: Date;
  view?: 'month' | 'year' | 'decade';
  title?: string;
}

export const CalendarModal = ({
  isOpen,
  onClose,
  onDateSelect,
  selectedDate,
  view = 'month',
  title,
}: CalendarModalProps) => {
  const handleDateSelect = (date: Date) => {
    onDateSelect(date);
    onClose();
  };

  const defaultTitle = view === 'year' ? '月を選択' : '日付を選択';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title || defaultTitle}>
      <Calendar
        onDateSelect={handleDateSelect}
        value={selectedDate}
        view={view}
      />
    </Modal>
  );
};
