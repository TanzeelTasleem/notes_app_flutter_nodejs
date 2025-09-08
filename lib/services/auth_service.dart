import 'dart:convert' as convert;

import 'package:http/http.dart' as http;
import 'package:notes_app/config/config.dart';
import 'package:notes_app/helper/storage_helper.dart';
import 'package:notes_app/models/api_response.dart';
import 'package:notes_app/models/user.dart';

class AuthService {
  Future<ApiResponse<User>> registerUser(
    String name,
    String email,
    String password,
  ) async {
    var url = Uri.parse('${Config.apiBaseUrl}/api/auth/signup');
    print('Registering user at $url with name: $name, email: $email');
    try {
      var response = await http.post(
        url,
        body: convert.jsonEncode({
          'name': name,
          'email': email,
          'password': password,
        }),
        headers: {'Content-Type': 'application/json'},
      );

      final Map<String, dynamic> json = convert.jsonDecode(response.body);
      final apiResponse = ApiResponse<User>.fromJson(
        json,
        (json) => User.fromJson(json as Map<String, dynamic>),
      );

      if (response.statusCode == 201 &&
          apiResponse.success &&
          apiResponse.data != null &&
          apiResponse.data!.token != null) {
        print('Response JSON while sign up and saving token: $json');
        await LocalStorage.saveToken(apiResponse.data!.token!);
        print('User sign in: $apiResponse.');
      } else {
        print(
          'Request failed with status: ${response.statusCode}\n.${response.body}',
        );
      }
      return apiResponse;
    } catch (e) {
      print('Error occurred: $e');
      return ApiResponse<User>(success: false, message: e.toString());
    }
  }

  Future<ApiResponse<User>> loginUser(String email, String password) async {
    var url = Uri.parse('${Config.apiBaseUrl}/api/auth/signin');
    print('Logging in user at $url with email: $email');
    // var userProvider = Provider.of<AuthProvider>(context, listen: false);
    try {
      // userProvider.setLoading(true);
      var response = await http.post(
        url,
        body: convert.jsonEncode({'email': email, 'password': password}),
        headers: {'Content-Type': 'application/json'},
      );

      final Map<String, dynamic> json = convert.jsonDecode(response.body);
      print('Response JSON: $json');

      final apiResponse = ApiResponse<User>.fromJson(
        json,
        (json) => User.fromJson(json as Map<String, dynamic>),
      );

      if (response.statusCode == 200 &&
          apiResponse.success &&
          apiResponse.data != null &&
          apiResponse.data!.token != null) {
        await LocalStorage.saveToken(apiResponse.data!.token!);
        print('User logged in: $apiResponse.');
      } else {
        print(
          'Request failed with status: ${response.statusCode}\n ${response.body}',
        );
      }
      return apiResponse;
    } catch (e) {
      print('Error occurred: $e');
      return ApiResponse<User>(success: false, message: e.toString());
    }
  }

  Future<ApiResponse<User>> getUserDetails(String token) async {
    var url = Uri.parse('${Config.apiBaseUrl}/api/auth/getUser');
    print('Fetching user details from $url');
    try {
      var response = await http.get(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      final Map<String, dynamic> json = convert.jsonDecode(response.body);
      print('Response JSON: $json');

      final apiResponse = ApiResponse<User>.fromJson(
        json,
        (json) => User.fromJson(json as Map<String, dynamic>),
      );

      if (response.statusCode == 200 && apiResponse.success) {
        print('User details fetched: ${apiResponse.data?.name} .');
      } else {
        print(
          'Request failed with status: ${response.statusCode}\n.${response.body}',
        );
      }
      return apiResponse;
    } catch (e) {
      print('Error occurred: $e');
      return ApiResponse<User>(success: false, message: e.toString());
    }
  }
}
