class Assignment {
  final String id;
  final String title;
  final String subject;
  final DateTime deadline;
  final int points;
  final String description;
  final bool isSubmitted;
  final String? submissionNote;

  const Assignment({
    required this.id,
    required this.title,
    required this.subject,
    required this.deadline,
    required this.points,
    required this.description,
    this.isSubmitted = false,
    this.submissionNote,
  });

  Assignment copyWith({
    String? id,
    String? title,
    String? subject,
    DateTime? deadline,
    int? points,
    String? description,
    bool? isSubmitted,
    String? submissionNote,
  }) {
    return Assignment(
      id: id ?? this.id,
      title: title ?? this.title,
      subject: subject ?? this.subject,
      deadline: deadline ?? this.deadline,
      points: points ?? this.points,
      description: description ?? this.description,
      isSubmitted: isSubmitted ?? this.isSubmitted,
      submissionNote: submissionNote ?? this.submissionNote,
    );
  }
}
