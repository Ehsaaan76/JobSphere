import React, { useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "./../../config/axios";
import {Loader} from "lucide-react";

const SignUpForm = () => {

  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { mutate: signUpMutation, isLoading } = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("/auth/signup", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Account created successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"]},)
    },
    onError: (error) => {
	  	toast.error(error.response.data.message || "We have an error: ");
    },
  });

  const handleSignUp = (e) => {
    e.preventDefault();
    signUpMutation({name, username , email, password});
  };

  return (
    <form onSubmit={handleSignUp} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input input-bordered w-full bg-gray-100"
        required
      />
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="input input-bordered w-full bg-gray-100"
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input input-bordered w-full bg-gray-100"
        required
      />
      <input
        type="password"
        placeholder="Password (6+ characters)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input input-bordered w-full bg-gray-100"
        required
      />

      <button type="submit" disabled={isLoading} className="btn btn-primary w-full text-white">
        {isLoading ? <Loader className="size-5 animate-spin" /> : "Agree & Join"}
      </button>
    </form>
  );
};
export default SignUpForm;
