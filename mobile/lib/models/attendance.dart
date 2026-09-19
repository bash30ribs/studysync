enum AttendanceStatus {
  present,
  late,
  absent,
}

class AttendanceRecord {
  final String id;
  final String subject;
  final DateTime date;
  final String timeSlot;
  final AttendanceStatus status;

  const AttendanceRecord({
    required this.id,
    required this.subject,
    required this.date,
    required this.timeSlot,
    required this.status,
  });
}
