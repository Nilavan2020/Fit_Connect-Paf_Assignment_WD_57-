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
import { FaFire, FaHeartbeat, FaChartLine, FaRunning } from "react-icons/fa";
import { motion } from "framer-motion";

const Home = () => {
  const { activeTab, setActiveTab } = useActiveTab();
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                Welcome to <span className="text-purple-600">FitConnect</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Your personal fitness journey starts here. Track, share, and achieve your fitness goals with our community.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FaFire className="h-6 w-6 text-red-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Calories Burned
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stats.calories}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FaRunning className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Workouts Completed
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stats.workouts}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FaHeartbeat className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Active Minutes
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stats.activeMinutes}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FaChartLine className="h-6 w-6 text-purple-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Steps Today
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stats.steps}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <TETabs fill className="bg-white rounded-lg shadow-sm">
              <TETabsItem
                onClick={() => setActiveTab("tab1")}
                active={activeTab === "tab1" || activeTab === "" ? true : false}
                color="primary"
                className="px-6 py-3 text-sm font-medium rounded-md transition-colors duration-200"
              >
                Daily Post
              </TETabsItem>
              <TETabsItem
                onClick={() => setActiveTab("tab2")}
                active={activeTab === "tab2" ? true : false}
                color="primary"
                className="px-6 py-3 text-sm font-medium rounded-md transition-colors duration-200"
              >
                Workout Status
              </TETabsItem>
              <TETabsItem
                onClick={() => setActiveTab("tab3")}
                active={activeTab === "tab3" ? true : false}
                color="primary"
                className="px-6 py-3 text-sm font-medium rounded-md transition-colors duration-200"
              >
                Workout Plan
              </TETabsItem>
              <TETabsItem
                onClick={() => setActiveTab("tab4")}
                active={activeTab === "tab4" ? true : false}
                color="primary"
                className="px-6 py-3 text-sm font-medium rounded-md transition-colors duration-200"
              >
                Meal Plan
              </TETabsItem>
            </TETabs>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {activeTab === "tab1" && (
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

            {activeTab === "tab2" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <WorkoutStatus user={user} />
              </motion.div>
            )}

            {activeTab === "tab3" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <WorkoutPlan user={user} />
              </motion.div>
            )}

            {activeTab === "tab4" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <MealPlan user={user} />
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
