// ignore_for_file: public_member_api_docs, sort_constructors_first
import 'package:flutter/material.dart';
import 'package:notes_app/helper/storage_helper.dart';
import 'package:notes_app/models/api_response.dart';
import 'package:notes_app/models/user.dart';
import 'package:notes_app/services/auth_service.dart';

class AuthProvider extends ChangeNotifier {
  User? _user;
  bool _isLoading = false;
  bool _isInitialLoading = true; // For the app's initial load (checking auth status)

  User? get user => _user;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _user != null;
  bool get isInitialLoading => _isInitialLoading;

  AuthProvider({required bool isLoading}) : _isLoading = isLoading;

  Future<ApiResponse<User>> login(String email, String password) async {
    _isLoading = true;
    notifyListeners();

    final res = await AuthService().loginUser(email, password);

    if (res.success && res.data != null) {
      _user = res.data;
    }

    _isLoading = false;
    notifyListeners();
    return res;
  }

  Future<ApiResponse<User>> register(String name, String email, String password) async {
    _isLoading = true;
    notifyListeners();

    final res = await AuthService().registerUser(name, email, password);

    if (res.success && res.data != null) {
      _user = res.data;
    }

    _isLoading = false;
    notifyListeners();
    return res;
  }

  Future<void> logout() async {
    _user = null;
    await LocalStorage.removeToken();
    notifyListeners();
  }

  Future<void> loadUserFromStorage() async {
    _isInitialLoading = true;
    notifyListeners();

    final token = await LocalStorage.getToken();
    if (token != null) {
      // Optionally, you can verify the token's validity here
      // For simplicity, we'll assume the token is valid and fetch user details
      final res = await AuthService().getUserDetails(token);
      if (res.success && res.data != null) {
        _user = res.data;
      } else {
        await LocalStorage.removeToken(); // Remove invalid token
      }
    }

    _isInitialLoading = false;
    notifyListeners();
  }

}
