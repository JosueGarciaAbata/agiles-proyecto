<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class JWTAuthController extends Controller
{
    // User registration
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors()->toJson(), 400);
        }

        try {
            $user = User::create([
                'name' => $request->get('name'),
                'email' => $request->get('email'),
                'password' => Hash::make($request->get('password')),
            ]);

            $token = JWTAuth::fromUser($user);
            return response()->json(compact('user', 'token'), 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Could not create user', 'message' => $e->getMessage()], 500);
        }
    }

    // User login
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        try {
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'Invalid credentials'], 401);
            }

            $user = JWTAuth::user(); // Obtén el usuario autenticado
            if (!$user) {
                return response()->json(['error' => 'User not found'], 404);
            }

            // Si el usuario tiene un rol, agrégalo al token
            $token = JWTAuth::claims([
                'role' => $user->role ?? 'user',
                'name' => $user->name,
                'email' => $user->email
            ])->fromUser($user);

            return response()->json([
                'token' => $token
            ], 200);
        } catch (JWTException $e) {
            // Mostrar el mensaje de error completo
            return response()->json(['error' => 'Could not create token', 'details' => $e->getMessage()], 500);
        }
    }


    // Get authenticated user
    public function getUser()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if (!$user) {
                return response()->json(['error' => 'User not found'], 404);
            }
            return response()->json(compact('user'), 200);
        } catch (JWTException $e) {
            return response()->json(['error' => 'Token invalid or expired', 'details' => $e->getMessage()], 401);
        }
    }

    // User logout
    public function logout()
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());
            return response()->json(['message' => 'Successfully logged out'], 200);
        } catch (JWTException $e) {
            return response()->json(['error' => 'Could not logout', 'details' => $e->getMessage()], 500);
        }
    }
}