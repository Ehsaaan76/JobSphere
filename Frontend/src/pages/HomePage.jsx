import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { axiosInstance } from '../config/axios'
import Sidebar from '../components/Sidebar';
import PostCreation from './../components/PostCreation';
import { Users } from 'lucide-react';
import Post from '../components/Post';
import RecommendedUser from '../components/RecommendedUser';

function HomePage() {

 const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        return res.data;  
      } catch (err) {
        if (err.response && err.response.status === 401) {
          return null;
        }
        toast.error(err.response.data.message || "Something went wrong");
      }
    },
  });
  const { data: recommendedUsers } = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: async() => {
        const res = await axiosInstance.get("/users/suggestions");
        return res.data;
    },
  });

    const { data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: async() => {
        const res = await axiosInstance.get("/posts");
        return res.data;
    },
  });


return (
		<div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
			<div className='hidden lg:block lg:col-span-1'>
				<Sidebar user={authUser} />
			</div>

			<div className='col-span-1 lg:col-span-2 order-first lg:order-none'>
				<PostCreation user={authUser} />

				{posts?.map((post) => (
					<Post key={post._id} post={post} />
				))}

				{posts?.length === 0 && (
					<div className='bg-white rounded-lg shadow p-8 text-center'>
						<div className='mb-6'>
							<Users size={64} className='mx-auto text-blue-500' />
						</div>
						<h2 className='text-2xl font-bold mb-4 text-gray-800'>No Posts Yet</h2>
						<p className='text-gray-600 mb-6'>Connect with others to start seeing posts in your feed!</p>
					</div>
				)}
			</div>

			{recommendedUsers?.length > 0 && (
				<div className='col-span-1 lg:col-span-1 hidden lg:block'>
					<div className='bg-white rounded-lg shadow p-4'>
						<h2 className='font-semibold mb-4'>People you may know</h2>
						{recommendedUsers?.map((user) => (
							<RecommendedUser key={user._id} user={user} />
						))}
					</div>
				</div>
			)}
		</div>
	);
};
export default HomePage;