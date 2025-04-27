import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { TETabs, TETabsItem } from "tw-elements-react";
import PostsList from "../components/PostsList";
import axios from "axios";
import toast from "react-hot-toast";
import WorkoutStatus from "./WorkoutStatus";
import WorkoutPlan from "./WorkoutPlan";
import MealPlan from "./MealPlan";
import { useActiveTab } from "../context/ActiveTabContext";
import { SharedPostlist } from "../components/SharedPostlist";
import { FaFire, FaHeartbeat, FaChartLine, FaRunning, FaDumbbell, FaUtensils, FaUsers, FaTrophy } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data for demonstration
const progressData = [
  { date: 'Jan', weight: 75, bodyFat: 20 },
  { date: 'Feb', weight: 74, bodyFat: 19 },
  { date: 'Mar', weight: 73, bodyFat: 18 },
  { date: 'Apr', weight: 72, bodyFat: 17 },
  { date: 'May', weight: 71, bodyFat: 16 },
];

const featuredPlans = [
  {
    id: 1,
    title: 'Beginner Strength Training',
    description: 'Perfect for those new to weightlifting',
    duration: '8 weeks',
    difficulty: 'Beginner',
    image: 'https://source.unsplash.com/random/800x600?gym',
  },
  {
    id: 2,
    title: 'Advanced HIIT Program',
    description: 'High-intensity interval training for experienced athletes',
    duration: '6 weeks',
    difficulty: 'Advanced',
    image: 'https://source.unsplash.com/random/800x600?workout',
  },
];

const Home = () => {
  const { activeTab, setActiveTab } = useActiveTab();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [reFetchPost, setReFetchPost] = useState(false);
  const [posts, setPosts] = useState([]);
  const [sharedPosts, setSharedPosts] = useState([]);
  const [reFetchSharedPost, setReFetchSharedPost] = useState(false);
  const [stats, setStats] = useState({
    workouts: 0,
    calories: 0,
    steps: 0,
    activeMinutes: 0
  });

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const { data } = await axios.get("http://localhost:8080/posts");
        setPosts(data);
      } catch (error) {
        toast.error("Server error");
      }
    };
    fetchAllPosts();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const userData = localStorage.getItem("user");
        setUser(JSON.parse(userData));
        // Fetch user stats
        const statsResponse = await axios.get(`http://localhost:8080/users/${JSON.parse(userData).id}/stats`);
        setStats(statsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const updatePost = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  };

  const deletePost = (deletedPost) => {
    setPosts((prevPosts) =>
      prevPosts.filter((post) => post.id !== deletedPost.id)
    );
  };

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const { data } = await axios.get("http://localhost:8080/posts");
        setPosts(data);
      } catch (error) {
        toast.error("Server error");
      }
    };
    fetchAllPosts();
  }, [reFetchPost]);

  useEffect(() => {
    const fetchAllSharedPosts = async () => {
      try {
        const { data } = await axios.get("http://localhost:8080/share");
        setSharedPosts(data);
      } catch (error) {
        toast.error("Server error");
      }
    };
    fetchAllSharedPosts();
  }, [reFetchSharedPost]);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100">
        {/* Hero Section */}
        <div className="relative">
          <div className="h-96 w-full">
            <img
              className="w-full h-full object-cover"
              src="https://source.unsplash.com/random/1920x1080?gym"
              alt="Hero"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center text-center px-4">
            <div className="max-w-3xl">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-6xl font-bold text-white mb-4"
              >
                Transform Your Fitness Journey
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-white mb-8"
              >
                Join our community of fitness enthusiasts and achieve your goals together
              </motion.p>
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onClick={() => navigate('/workout-plan')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition duration-300"
              >
                Get Started
              </motion.button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="max-w-7xl mx-auto px-8 -mt-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-lg shadow-lg p-6 text-center"
            >
              <FaFire className="text-red-500 text-3xl mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-800">{stats.workouts}</div>
              <div className="text-gray-600">Workouts</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-lg shadow-lg p-6 text-center"
            >
              <FaHeartbeat className="text-green-500 text-3xl mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-800">{stats.calories}</div>
              <div className="text-gray-600">Calories Burned</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-lg shadow-lg p-6 text-center"
            >
              <FaRunning className="text-blue-500 text-3xl mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-800">{stats.steps}</div>
              <div className="text-gray-600">Steps</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-lg shadow-lg p-6 text-center"
            >
              <FaChartLine className="text-purple-500 text-3xl mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-800">{stats.activeMinutes}</div>
              <div className="text-gray-600">Active Minutes</div>
            </motion.div>
          </div>
        </div>

        {/* Featured Plans Section */}
        <div className="max-w-7xl mx-auto px-8 mt-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Featured Workout Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredPlans.map((plan) => (
              <motion.div
                key={plan.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <img
                  src={plan.image}
                  alt={plan.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{plan.title}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="flex gap-2 mb-4">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {plan.duration}
                    </span>
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                      {plan.difficulty}
                    </span>
                  </div>
                  <button
                    onClick={() => navigate(`/workout-plan/${plan.id}`)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                  >
                    View Plan
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className="max-w-7xl mx-auto px-8 mt-12">
          <TETabs fill className="bg-white rounded-lg shadow-sm">
            <TETabsItem
              onClick={() => setActiveTab('posts')}
              active={activeTab === 'posts'}
              color="primary"
              className="px-6 py-3 text-sm font-medium rounded-md transition-colors duration-200"
            >
              <FaUsers className="mr-2" />
              Community
            </TETabsItem>
            <TETabsItem
              onClick={() => setActiveTab('progress')}
              active={activeTab === 'progress'}
              color="primary"
              className="px-6 py-3 text-sm font-medium rounded-md transition-colors duration-200"
            >
              <FaChartLine className="mr-2" />
              Progress
            </TETabsItem>
            <TETabsItem
              onClick={() => setActiveTab('nutrition')}
              active={activeTab === 'nutrition'}
              color="primary"
              className="px-6 py-3 text-sm font-medium rounded-md transition-colors duration-200"
            >
              <FaUtensils className="mr-2" />
              Nutrition
            </TETabsItem>
          </TETabs>

          {/* Content Sections */}
          <div className="mt-6">
            {activeTab === 'posts' && (
              <div className="space-y-6">
                {posts?.map((post, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <PostsList
                      post={post}
                      user={user}
                      onUpdatePost={updatePost}
                      onDeletePost={deletePost}
                      reFetchPost={reFetchPost}
                      setReFetchPost={setReFetchPost}
                      setReFetchSharedPost={setReFetchSharedPost}
                      reFetchSharedPost={reFetchSharedPost}
                    />
                  </motion.div>
                ))}
                {sharedPosts?.map((sharePost, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <SharedPostlist
                      post={sharePost}
                      user={user}
                      reFetchSharedPost={reFetchSharedPost}
                      setReFetchSharedPost={setReFetchSharedPost}
                    />
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'progress' && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Progress</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="weight"
                        stroke="#8884d8"
                        name="Weight (kg)"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="bodyFat"
                        stroke="#82ca9d"
                        name="Body Fat (%)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {activeTab === 'nutrition' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Today's Intake</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Calories</span>
                      <span className="font-semibold">1,500 / 2,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Protein</span>
                      <span className="font-semibold">120g / 150g</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Carbs</span>
                      <span className="font-semibold">150g / 200g</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fat</span>
                      <span className="font-semibold">50g / 65g</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Meals</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">Breakfast</p>
                        <p className="text-sm text-gray-600">Oatmeal with fruits</p>
                      </div>
                      <span className="font-semibold">450 kcal</span>
                    </div>
                    <div className="border-t border-gray-200"></div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">Lunch</p>
                        <p className="text-sm text-gray-600">Grilled chicken salad</p>
                      </div>
                      <span className="font-semibold">550 kcal</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
