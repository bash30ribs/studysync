class PollOption {
  final String id;
  final String text;
  final int votes;

  const PollOption({
    required this.id,
    required this.text,
    required this.votes,
  });

  PollOption copyWith({
    String? id,
    String? text,
    int? votes,
  }) {
    return PollOption(
      id: id ?? this.id,
      text: text ?? this.text,
      votes: votes ?? this.votes,
    );
  }
}

class Poll {
  final String id;
  final String question;
  final String authorName;
  final DateTime createdAt;
  final List<PollOption> options;
  final String? userVotedOptionId;

  const Poll({
    required this.id,
    required this.question,
    required this.authorName,
    required this.createdAt,
    required this.options,
    this.userVotedOptionId,
  });

  int get totalVotes => options.fold(0, (sum, opt) => sum + opt.votes);

  Poll copyWith({
    String? id,
    String? question,
    String? authorName,
    DateTime? createdAt,
    List<PollOption>? options,
    String? userVotedOptionId,
  }) {
    return Poll(
      id: id ?? this.id,
      question: question ?? this.question,
      authorName: authorName ?? this.authorName,
      createdAt: createdAt ?? this.createdAt,
      options: options ?? this.options,
      userVotedOptionId: userVotedOptionId ?? this.userVotedOptionId,
    );
  }
}
