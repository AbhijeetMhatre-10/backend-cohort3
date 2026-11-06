import React from "react";
import useLogin from "../../hooks/LoginHook";
import { Link } from "react-router";

const Login = () => {
  const { register, handleSubmit, errors, isSubmitting, onSubmit } = useLogin();

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>

          <p className="mt-2 text-sm text-gray-400">
            Login to your account to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* General / Backend Error */}
          {errors.root && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
              <p className="text-sm text-red-400">{errors.root.message}</p>
            </div>
          )}

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500"
              {...register("email", {
                required: "Email is required",

                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Enter a valid email",
                },
              })}
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500"
              {...register("password", {
                required: "Password is required",
              })}
            />

            {errors.password && (
              <p className="mt-1 text-sm text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-blue-500 hover:text-blue-400"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
