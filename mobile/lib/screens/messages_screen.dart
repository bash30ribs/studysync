import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../providers/study_sync_provider.dart';
import '../theme/app_theme.dart';

class ChatMessage {
  final String id;
  final String senderName;
  final String content;
  final bool isMine;
  final DateTime sentAt;
  final String? fileName;

  const ChatMessage({
    required this.id,
    required this.senderName,
    required this.content,
    required this.isMine,
    required this.sentAt,
    this.fileName,
  });
}

class MessagesScreen extends StatefulWidget {
  const MessagesScreen({super.key});

  @override
  State<MessagesScreen> createState() => _MessagesScreenState();
}

class _MessagesScreenState extends State<MessagesScreen> {
  final TextEditingController _textController = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  List<ChatMessage> _chatMessages = [
    ChatMessage(
      id: 'm1',
      senderName: 'Rohan Sharma (CR)',
      content: 'Hello everyone! Please remember that all lab submissions for Thermodynamics must be completed before Friday evening.',
      isMine: false,
      sentAt: DateTime.now().subtract(const Duration(hours: 3)),
    ),
    ChatMessage(
      id: 'm2',
      senderName: 'Alex Chen',
      content: 'Got it Rohan. Are handwritten solutions acceptable or do we need typed MATLAB reports?',
      isMine: true,
      sentAt: DateTime.now().subtract(const Duration(hours: 2, minutes: 30)),
    ),
    ChatMessage(
      id: 'm3',
      senderName: 'Rohan Sharma (CR)',
      content: 'Typed summary with the attached .m script as per Prof. Mukherjee instructions.',
      isMine: false,
      sentAt: DateTime.now().subtract(const Duration(hours: 2, minutes: 10)),
      fileName: 'Rankine_Cycle_Guidelines.pdf',
    ),
    ChatMessage(
      id: 'm4',
      senderName: 'Alex Chen',
      content: 'Perfect, submitting now.',
      isMine: true,
      sentAt: DateTime.now().subtract(const Duration(hours: 1)),
    ),
  ];

  void _sendMessage() {
    final text = _textController.text.trim();
    if (text.isEmpty) return;

    setState(() {
      _chatMessages.add(
        ChatMessage(
          id: 'm_${DateTime.now().millisecondsSinceEpoch}',
          senderName: 'Alex Chen',
          content: text,
          isMine: true,
          sentAt: DateTime.now(),
        ),
      );
      _textController.clear();
    });

    Future.delayed(const Duration(milliseconds: 100), () {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 250),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<StudySyncProvider>();
    final isDark = provider.isDarkMode;
    final cardBorder = isDark ? const Color(0xFF262626) : const Color(0xFFDBDBDB);
    final secondaryText = isDark ? const Color(0xFFA8A8A8) : const Color(0xFF737373);

    return Scaffold(
      appBar: AppBar(
        titleSpacing: 0,
        title: Row(
          children: [
            Container(
              width: 34,
              height: 34,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(color: AppTheme.instagramBlue, width: 1.5),
                color: isDark ? const Color(0xFF262626) : const Color(0xFFEFEFEF),
              ),
              alignment: Alignment.center,
              child: const Text(
                'R',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Row(
                    children: [
                      Text(
                        'Rohan Sharma',
                        style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700),
                      ),
                      SizedBox(width: 4),
                      Icon(Icons.verified, color: AppTheme.instagramBlue, size: 14),
                    ],
                  ),
                  Text(
                    'Active now · AES-256 Encrypted',
                    style: TextStyle(fontSize: 10, color: secondaryText),
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.lock_outline, size: 20),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Cryptographic verification: AES-GCM-256 active')),
              );
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // E2EE notice
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
            child: Column(
              children: [
                const Icon(Icons.lock, size: 18, color: AppTheme.instagramBlue),
                const SizedBox(height: 6),
                const Text(
                  'End-to-End Encrypted',
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700),
                ),
                const SizedBox(height: 2),
                Text(
                  'Messages and calls are secured with AES-256 client cryptography. Only participants in this thread can read them.',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 10, color: secondaryText, height: 1.35),
                ),
              ],
            ),
          ),

          Divider(color: cardBorder, height: 1),

          // Message stream
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              itemCount: _chatMessages.length,
              itemBuilder: (context, index) {
                final msg = _chatMessages[index];

                return Align(
                  alignment: msg.isMine ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 8),
                    constraints: BoxConstraints(
                      maxWidth: MediaQuery.of(context).size.width * 0.76,
                    ),
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    decoration: BoxDecoration(
                      color: msg.isMine
                          ? AppTheme.instagramBlue
                          : (isDark ? const Color(0xFF262626) : const Color(0xFFEFEFEF)),
                      borderRadius: BorderRadius.only(
                        topLeft: const Radius.circular(18),
                        topRight: const Radius.circular(18),
                        bottomLeft: Radius.circular(msg.isMine ? 18 : 4),
                        bottomRight: Radius.circular(msg.isMine ? 4 : 18),
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          msg.content,
                          style: TextStyle(
                            fontSize: 13,
                            height: 1.35,
                            color: msg.isMine
                                ? Colors.white
                                : (isDark ? const Color(0xFFF5F5F5) : Colors.black),
                          ),
                        ),
                        if (msg.fileName != null) ...[
                          const SizedBox(height: 8),
                          Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: isDark ? Colors.black.withOpacity(0.3) : Colors.white,
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Row(
                              children: [
                                const Icon(Icons.description, size: 16, color: AppTheme.instagramBlue),
                                const SizedBox(width: 6),
                                Expanded(
                                  child: Text(
                                    msg.fileName!,
                                    style: TextStyle(
                                      fontSize: 11,
                                      fontWeight: FontWeight.w600,
                                      color: isDark ? Colors.white : Colors.black,
                                    ),
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                        const SizedBox(height: 4),
                        Align(
                          alignment: Alignment.bottomRight,
                          child: Text(
                            DateFormat('h:mm a').format(msg.sentAt),
                            style: TextStyle(
                              fontSize: 9,
                              color: msg.isMine ? Colors.white.withOpacity(0.7) : Colors.grey,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),

          // Instagram Pill Input Bar
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF000000) : Colors.white,
              border: Border(top: BorderSide(color: cardBorder, width: 0.5)),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14),
                    height: 42,
                    decoration: BoxDecoration(
                      color: isDark ? const Color(0xFF121212) : const Color(0xFFFAFAFA),
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: cardBorder),
                    ),
                    child: Row(
                      children: [
                        Icon(Icons.attach_file, size: 18, color: secondaryText),
                        const SizedBox(width: 8),
                        Expanded(
                          child: TextField(
                            controller: _textController,
                            style: const TextStyle(fontSize: 13),
                            decoration: const InputDecoration(
                              hintText: 'Message...',
                              hintStyle: TextStyle(fontSize: 13, color: Colors.grey),
                              border: InputBorder.none,
                              isDense: true,
                              contentPadding: EdgeInsets.zero,
                            ),
                            onSubmitted: (_) => _sendMessage(),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                IconButton(
                  onPressed: _sendMessage,
                  icon: const Icon(Icons.send, color: AppTheme.instagramBlue),
                  iconSize: 20,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
