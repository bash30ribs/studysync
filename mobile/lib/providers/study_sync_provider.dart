import 'package:flutter/material.dart';
import '../models/assignment.dart';
import '../models/attendance.dart';
import '../models/poll.dart';

class StudySyncProvider with ChangeNotifier {
  ThemeMode _themeMode = ThemeMode.dark;
  String _userRole = 'Student'; // 'Student' or 'CR'
  final String _userName = 'Alex Chen';
  final String _userEmail = 'alex.chen@engineering.edu';
  final String _rollNo = 'ME22B042';
  final String _className = 'MECH-3A';

  List<Assignment> _assignments = [
    Assignment(
      id: 'asg-1',
      title: 'Navier-Stokes Boundary Layer Derivation',
      subject: 'Fluid Mechanics',
      deadline: DateTime.now().add(const Duration(hours: 14)),
      points: 25,
      description: 'Handwritten analytical derivation of laminar flow across flat plate using Blasius similarity transformation.',
      isSubmitted: false,
    ),
    Assignment(
      id: 'asg-2',
      title: 'MATLAB Simulation of Rankine Cycle Reheat',
      subject: 'Thermodynamics',
      deadline: DateTime.now().add(const Duration(days: 2)),
      points: 50,
      description: 'Compute thermal efficiency with single-stage steam reheat. Plot T-s diagram and submit .m script with summary PDF.',
      isSubmitted: true,
      submissionNote: 'Submitted Rankine_Sim_v2.m and Report.pdf',
    ),
    Assignment(
      id: 'asg-3',
      title: 'Four-Bar Linkage Kinematic Synthesis',
      subject: 'Machine Dynamics',
      deadline: DateTime.now().add(const Duration(days: 4)),
      points: 30,
      description: 'Perform Freudenstein analytical method for three precision positions of crank-rocker mechanism.',
      isSubmitted: false,
    ),
    Assignment(
      id: 'asg-4',
      title: 'Tensile Stress Strain Specimen Report',
      subject: 'Strength of Materials',
      deadline: DateTime.now().subtract(const Duration(days: 1)),
      points: 20,
      description: 'Calculate 0.2% yield offset, UTS, and percentage reduction in area for Mild Steel specimen #4.',
      isSubmitted: true,
      submissionNote: 'Submitted Lab Sheet #4',
    ),
  ];

  List<AttendanceRecord> _attendanceRecords = [
    AttendanceRecord(
      id: 'att-1',
      subject: 'Fluid Mechanics',
      date: DateTime.now().subtract(const Duration(days: 1)),
      timeSlot: '09:00 AM - 10:00 AM',
      status: AttendanceStatus.present,
    ),
    AttendanceRecord(
      id: 'att-2',
      subject: 'Thermodynamics',
      date: DateTime.now().subtract(const Duration(days: 1)),
      timeSlot: '11:15 AM - 12:15 PM',
      status: AttendanceStatus.present,
    ),
    AttendanceRecord(
      id: 'att-3',
      subject: 'Machine Dynamics',
      date: DateTime.now().subtract(const Duration(days: 2)),
      timeSlot: '02:00 PM - 03:00 PM',
      status: AttendanceStatus.late,
    ),
    AttendanceRecord(
      id: 'att-4',
      subject: 'Strength of Materials',
      date: DateTime.now().subtract(const Duration(days: 3)),
      timeSlot: '10:00 AM - 11:00 AM',
      status: AttendanceStatus.present,
    ),
    AttendanceRecord(
      id: 'att-5',
      subject: 'Manufacturing Tech',
      date: DateTime.now().subtract(const Duration(days: 4)),
      timeSlot: '03:15 PM - 04:15 PM',
      status: AttendanceStatus.absent,
    ),
  ];

  List<Poll> _polls = [
    Poll(
      id: 'poll-1',
      question: 'Should we request the Dean to move the Fluid Mechanics lab exam to Monday 10 AM?',
      authorName: 'Rohan Sharma (CR)',
      createdAt: DateTime.now().subtract(const Duration(hours: 4)),
      options: [
        const PollOption(id: 'opt-1', text: 'Yes, Monday works better', votes: 34),
        const PollOption(id: 'opt-2', text: 'No, keep original Friday slot', votes: 12),
        const PollOption(id: 'opt-3', text: 'Prefer Saturday morning', votes: 5),
      ],
      userVotedOptionId: 'opt-1',
    ),
    Poll(
      id: 'poll-2',
      question: 'Which chapter needs an additional CR peer tutoring session before Mid-Terms?',
      authorName: 'Rohan Sharma (CR)',
      createdAt: DateTime.now().subtract(const Duration(days: 1)),
      options: [
        const PollOption(id: 'opt-21', text: 'Navier-Stokes Equations', votes: 28),
        const PollOption(id: 'opt-22', text: 'Rankine & Brayton Cycles', votes: 19),
        const PollOption(id: 'opt-23', text: 'Epicyclic Gear Trains', votes: 9),
      ],
      userVotedOptionId: null,
    ),
  ];

  // Getters
  ThemeMode get themeMode => _themeMode;
  bool get isDarkMode => _themeMode == ThemeMode.dark;
  String get userRole => _userRole;
  String get userName => _userName;
  String get userEmail => _userEmail;
  String get rollNo => _rollNo;
  String get className => _className;
  List<Assignment> get assignments => _assignments;
  List<AttendanceRecord> get attendanceRecords => _attendanceRecords;
  List<Poll> get polls => _polls;

  double get attendancePercentage {
    if (_attendanceRecords.isEmpty) return 100.0;
    final presentCount = _attendanceRecords
        .where((a) => a.status == AttendanceStatus.present || a.status == AttendanceStatus.late)
        .length;
    return (presentCount / _attendanceRecords.length) * 100;
  }

  int get pendingAssignmentsCount => _assignments.where((a) => !a.isSubmitted).length;

  // Actions
  void toggleTheme() {
    _themeMode = _themeMode == ThemeMode.dark ? ThemeMode.light : ThemeMode.dark;
    notifyListeners();
  }

  void toggleRole() {
    _userRole = _userRole == 'Student' ? 'CR' : 'Student';
    notifyListeners();
  }

  void submitAssignment(String id, String note) {
    _assignments = _assignments.map((a) {
      if (a.id == id) {
        return a.copyWith(isSubmitted: true, submissionNote: note);
      }
      return a;
    }).toList();
    notifyListeners();
  }

  void votePoll(String pollId, String optionId) {
    _polls = _polls.map((p) {
      if (p.id == pollId) {
        final newOptions = p.options.map((opt) {
          if (opt.id == optionId) {
            return opt.copyWith(votes: opt.votes + 1);
          }
          if (opt.id == p.userVotedOptionId) {
            return opt.copyWith(votes: (opt.votes - 1).clamp(0, 9999));
          }
          return opt;
        }).toList();

        return p.copyWith(
          options: newOptions,
          userVotedOptionId: optionId,
        );
      }
      return p;
    }).toList();
    notifyListeners();
  }
}
