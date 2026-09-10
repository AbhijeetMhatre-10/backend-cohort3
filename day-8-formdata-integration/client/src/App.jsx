import React from "react";
import { useForm } from "react-hook-form";
import { Camera, User } from "lucide-react";

const App = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const profilePicture = watch("profilePicture");

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("image", data.profilePicture[0]);

    const response = await fetch("http://localhost:3000/file", {
      method: "POST",
      body: formData,
    });

    console.log(await response.text());
    reset();
  };

  return (
    <div className="min-h-screen bg-(--background) flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-(--border) bg-(--card) p-6 shadow-sm">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-(--foreground)">
            Complete Your Profile
          </h1>

          <p className="mt-1 text-sm text-(--muted-foreground)">
            Add your details and profile picture
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Profile Picture */}
          <div className="flex justify-center">
            <label
              htmlFor="profilePicture"
              className="group relative flex h-28 w-28 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-(--border) bg-(--background) transition hover:border-(--primary)"
            >
              {profilePicture?.[0] ? (
                <img
                  src={URL.createObjectURL(profilePicture[0])}
                  alt="Profile preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-1 text-(--muted-foreground)">
                  <User size={36} strokeWidth={1.5} />
                  <span className="text-xs">Add photo</span>
                </div>
              )}

              {/* Camera overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                <Camera className="text-white" size={24} />
              </div>

              <input
                id="profilePicture"
                type="file"
                accept="image/*"
                className="hidden"
                {...register("profilePicture", {
                  required: "Profile picture is required",
                  validate: {
                    image: (files) =>
                      files?.[0]?.type.startsWith("image/") ||
                      "Please select an image",
                    size: (files) =>
                      !files?.[0] ||
                      files[0].size <= 5 * 1024 * 1024 ||
                      "Image must be less than 5MB",
                  },
                })}
              />
            </label>
          </div>

          {errors.profilePicture && (
            <p className="text-center text-sm text-red-500">
              {errors.profilePicture.message}
            </p>
          )}

          {/* Name */}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-sm font-medium text-(--foreground)"
            >
              Name
            </label>

            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              className="h-11 w-full rounded-lg border border-(--border) bg-(--background) px-3 text-sm text-(--foreground) outline-none transition placeholder:text-(--muted-foreground) focus:border-(--primary) focus:ring-2 focus:ring-(--primary)/20"
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
            />

            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-(--foreground)"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="h-11 w-full rounded-lg border border-(--border) bg-(--background) px-3 text-sm text-(--foreground) outline-none transition placeholder:text-(--muted-foreground) focus:border-(--primary) focus:ring-2 focus:ring-(--primary)/20"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
            />

            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="h-11 w-full rounded-lg bg-(--primary) px-4 text-sm font-medium text-(--primary-foreground) transition hover:opacity-90 active:scale-[0.98]"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
