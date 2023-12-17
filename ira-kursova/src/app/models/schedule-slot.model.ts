export class ScheduleSlot {
  id?: any;
  dayOfWeek: number; // 1, 2, ... 5 понеділок по пятницю
  slotNumber: number; // 1, 2, 3, 4 ,5 це пари
  groupId?: string; // група
  subjectId?: string; // дисципліна
  roomId?: string; // аудиторія
  userId?: string; // викладач
  approved: boolean; // підтвердження викладачем
}