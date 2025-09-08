import 'package:flutter/material.dart';
import 'package:notes_app/providers/auth_provider.dart';
import 'package:notes_app/screens/login_page.dart';
import 'package:provider/provider.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final user = authProvider.user;
    return Scaffold(
      appBar: AppBar(
        title: const Text('Home'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              await authProvider.logout(); // you'll define this
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(builder: (context) => const LoginPage()),
              );
            },
          ),
        ],
      ),
      body: user == null
          ? const Center(child: Text("No user data found"))
          : Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '👤 Name: ${user.name}',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  const SizedBox(height: 8),
                  Text('📧 Email: ${user.email}'),

                  if (user.token != null) ...[
                    const SizedBox(height: 8),
                    Text('🔑 Token: ${user.token}'),
                  ],
                ],
              ),
            ),
    );
  }
}
