"use client";
import LoginIcon from "@/containers/login/icons/LoginIcon";
import MailIcon from "@/containers/login/icons/MailIcon";
import PasswordIcon from "@/containers/login/icons/PasswordIcon";
import Link from "next/link";
import React, { useState } from "react";
import Logo from "@/components/Icons/Logo";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

import { signIn } from "next-auth/react";

interface LoginFormInputs {
  username: string;
  password: string;
}

const LoginPage = () => {

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const res = await signIn("credentials", {
        redirect: false,
        username: data.username,
        password: data.password
      });

      if (res?.error) {
        toast.error(res.error);
      } else {
        router.push("/statistics");
      }
    } catch (error) {
      toast.error("An error occurred during login");
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex flex-wrap items-center">
        <div className="hidden w-full xl:block xl:w-1/2">
          <div className="px-26 py-17.5 text-center">
            <Link
              className="mb-5.5 flex gap-4 items-center justify-center"
              href="/"
            >
              <Logo width={60} height={60} />
              <h3 className="text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Tender
              </h3>
            </Link>

            <span className="mt-15 inline-block">
              <LoginIcon />
            </span>
          </div>
        </div>

        <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
              Hesabınıza daxil olun
            </h2>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Mailinizi daxil edin"
                    className={`w-full rounded-lg border ${errors.username ? "border-red-500" : "border-stroke"
                      } bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                    {...register("username", {
                      required: "Email tələb olunur",
                      // pattern: {
                      //   value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      //   message: "Düzgün email formatı deyil",
                      // },
                    })}
                  />

                  <span className="absolute right-4 top-4">
                    <MailIcon />
                  </span>
                </div>
                {errors.username && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Şifrə
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Şifrənizi daxil edin"
                    className={`w-full rounded-lg border ${errors.password ? "border-red-500" : "border-stroke"
                      } bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                    {...register("password", {
                      required: "Şifrə tələb olunur",
                      minLength: {
                        value: 6,
                        message: "Şifrə ən azı 6 simvol olmalıdır",
                      },
                    })}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-gray-500 hover:text-primary"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="mb-5">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 disabled:bg-opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Daxil olunur..." : "Daxil ol"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
