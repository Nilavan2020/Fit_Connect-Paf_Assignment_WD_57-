import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import PostsList from "../components/PostsList";
import { FaUserFriends, FaUserPlus, FaUserCheck, FaEllipsisH, FaDumbbell, FaUtensils, FaTrophy, FaChartLine, FaHeartbeat, FaEdit, FaTrash, FaCamera, FaUpload, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import { TETabs, TETabsItem } from "tw-elements-react";
import toast from "react-hot-toast";

// Demo data for workouts
const demoWorkouts = [
  {
    id: 1,
    name: "Full Body Workout",
    date: "2024-03-15",
    duration: "45 mins",
    exercises: ["Push-ups", "Squats", "Plank", "Lunges"],
    calories: 350,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 2,
    name: "Cardio Session",
    date: "2024-03-14",
    duration: "30 mins",
    exercises: ["Running", "Jump Rope", "Burpees"],
    calories: 400,
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 3,
    name: "Upper Body Strength",
    date: "2024-03-13",
    duration: "50 mins",
    exercises: ["Bench Press", "Pull-ups", "Shoulder Press"],
    calories: 450,
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  }
];

// Demo data for meals
const demoMeals = [
  {
    id: 1,
    name: "Protein Breakfast Bowl",
    date: "2024-03-15",
    calories: 450,
    protein: 30,
    carbs: 45,
    fat: 15,
    ingredients: ["Eggs", "Avocado", "Whole Grain Toast", "Greek Yogurt"],
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 2,
    name: "Quinoa Salad",
    date: "2024-03-14",
    calories: 380,
    protein: 20,
    carbs: 50,
    fat: 12,
    ingredients: ["Quinoa", "Mixed Vegetables", "Chicken Breast", "Olive Oil"],
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 3,
    name: "Post-Workout Smoothie",
    date: "2024-03-13",
    calories: 320,
    protein: 25,
    carbs: 40,
    fat: 8,
    ingredients: ["Banana", "Protein Powder", "Almond Milk", "Peanut Butter"],
    image: "https://images.unsplash.com/photo-1502741224143-90386d7f8c82?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  }
];

// Demo data for achievements
const demoAchievements = [
  {
    id: 1,
    title: "Consistency Master",
    description: "Completed 30 workouts in a month",
    date: "2024-03-01",
    icon: "🏆"
  },
  {
    id: 2,
    title: "Nutrition Expert",
    description: "Maintained healthy diet for 2 months",
    date: "2024-02-15",
    icon: "🥗"
  },
  {
    id: 3,
    title: "Fitness Streak",
    description: "Worked out for 7 days straight",
    date: "2024-03-10",
    icon: "🔥"
  }
];

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loginUser, setLoginUser] = useState(null);
  const { userId } = useParams();
  const [posts, setPosts] = useState([]);
  const [reFetchPost, setReFetchPost] = useState(false);
  const [reFetchUser, setReFetchUser] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    workouts: 0,
    meals: 0,
    posts: 0,
    achievements: 0
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    setLoading(true);
    setUser(null);
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/users/${userId}`);
        setUser(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, reFetchUser]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/posts/user/${userId}`);
        setPosts(res.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchUserPosts();
  }, [userId, reFetchPost]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const userData = localStorage.getItem("user");
        setLoginUser(JSON.parse(userData));
        
        // Fetch user stats
        const statsResponse = await axios.get(`http://localhost:8080/users/${userId}/stats`);
        setStats(statsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userId]);

  const handleFollowUser = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8080/users/follow?userId=${loginUser.id}&FollowedUserId=${user?.id}`
      );
      setReFetchUser(!reFetchUser);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditProfile = () => {
    setEditedUser({ ...user });
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/users/${userId}`, editedUser);
      if (response.status === 200) {
        setUser(response.data);
        setIsEditing(false);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleDeleteProfile = async () => {
    if (window.confirm("Are you sure you want to delete your profile? This action cannot be undone.")) {
      try {
        const response = await axios.delete(`http://localhost:8080/users/${userId}`);
        if (response.status === 200) {
          toast.success("Profile deleted successfully");
          localStorage.removeItem("user");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error deleting profile:", error);
        toast.error("Failed to delete profile");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match(/image\/(jpeg|png|jpg)/)) {
      setUploadError('Only JPG, JPEG, and PNG files are allowed');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size must be less than 10MB');
      return;
    }

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
      setShowUploadOptions(true);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!previewUrl) return;

    setUploading(true);
    setUploadError(null);

    try {
      // Convert preview URL back to file
      const response = await fetch(previewUrl);
      const blob = await response.blob();
      const file = new File([blob], "profile.jpg", { type: "image/jpeg" });

      const formData = new FormData();
      formData.append('image', file);

      const uploadResponse = await axios.post(
        `http://localhost:8080/api/users/${user._id}/upload-profile-image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (uploadResponse.data.success) {
        setUser(prev => ({
          ...prev,
          profileImage: uploadResponse.data.data.filePath
        }));
        toast.success('Profile image updated successfully');
        setShowUploadOptions(false);
        setPreviewUrl(null);
      } else {
        setUploadError(uploadResponse.data.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError(
        error.response?.data?.message || 
        'An error occurred while uploading the image'
      );
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setShowUploadOptions(false);
    setPreviewUrl(null);
    setUploadError(null);
  };

  // Workout Card Component
  const WorkoutCard = ({ workout }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <img
        src={workout.image}
        alt={workout.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800">{workout.name}</h3>
        <div className="flex items-center text-gray-600 mt-2">
          <FaDumbbell className="mr-2" />
          <span>{workout.duration}</span>
        </div>
        <div className="mt-2">
          <p className="text-sm text-gray-600">Exercises:</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {workout.exercises.map((exercise, index) => (
              <span
                key={index}
                className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full"
              >
                {exercise}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-red-500 font-semibold">{workout.calories} kcal</span>
          <span className="text-gray-500 text-sm">{workout.date}</span>
        </div>
      </div>
    </motion.div>
  );

  // Meal Card Component
  const MealCard = ({ meal }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <img
        src={meal.image}
        alt={meal.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800">{meal.name}</h3>
        <div className="mt-2">
          <p className="text-sm text-gray-600">Ingredients:</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {meal.ingredients.map((ingredient, index) => (
              <span
                key={index}
                className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
              >
                {ingredient}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="text-center">
            <p className="text-sm text-gray-600">Protein</p>
            <p className="font-semibold">{meal.protein}g</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Carbs</p>
            <p className="font-semibold">{meal.carbs}g</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Fat</p>
            <p className="font-semibold">{meal.fat}g</p>
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-red-500 font-semibold">{meal.calories} kcal</span>
          <span className="text-gray-500 text-sm">{meal.date}</span>
        </div>
      </div>
    </motion.div>
  );

  // Achievement Card Component
  const AchievementCard = ({ achievement }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg shadow-md p-4"
    >
      <div className="flex items-start space-x-4">
        <div className="text-4xl">{achievement.icon}</div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{achievement.title}</h3>
          <p className="text-gray-600 mt-1">{achievement.description}</p>
          <p className="text-sm text-gray-500 mt-2">{achievement.date}</p>
        </div>
      </div>
    </motion.div>
  );

  if (loading && !user) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100">
        {/* Cover Photo Section */}
        <div className="relative">
          <div className="h-96 w-full">
            <img
              className="w-full h-full object-cover"
              src="https://hometriangle.com/blogs/content/images/2022/02/Home-Gym-for-Small-Spaces-1.png"
              alt="Cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
          </div>

          {/* Profile Picture and Name */}
          <div className="absolute bottom-0 left-0 right-0 px-8 pb-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-end space-x-6">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative group"
                >
                  <div className="relative w-32 h-32">
                    <img
                      className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                      src={previewUrl || user?.profileImage || '/default-profile.png'}
                      alt="Profile"
                    />
                    
                    {/* Facebook-style hover overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/jpg"
                          className="hidden"
                          onChange={handleImageChange}
                          disabled={uploading}
                        />
                        <FaCamera className="text-white text-2xl" />
                      </label>
                    </div>
                  </div>
                  <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1 border-2 border-white">
                    <FaUserCheck className="text-white text-sm" />
                  </div>
                </motion.div>
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        name="name"
                        value={editedUser?.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Name"
                      />
                      <input
                        type="text"
                        name="email"
                        value={editedUser?.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Email"
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSaveProfile}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h1 className="text-3xl font-bold text-white">{user?.name}</h1>
                      <p className="text-gray-200 mt-1">{user?.email}</p>
                      {loginUser?.id === user?.id && (
                        <div className="flex space-x-4 mt-4">
                          <button
                            onClick={handleEditProfile}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <FaEdit />
                            <span>Edit Profile</span>
                          </button>
                          <button
                            onClick={handleDeleteProfile}
                            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <FaTrash />
                            <span>Delete Profile</span>
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
                {loginUser?.id !== user?.id && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleFollowUser}
                    className={`px-6 py-2 rounded-full font-semibold ${
                      user?.followingUsers?.includes(loginUser?.id)
                        ? "bg-gray-200 text-gray-800"
                        : "bg-blue-600 text-white"
                    }`}
                  >
                    {user?.followingUsers?.includes(loginUser?.id)
                      ? "Following"
                      : "Follow"}
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Upload Options Modal */}
        {showUploadOptions && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Update Profile Picture</h2>
                <button
                  onClick={handleCancel}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="mb-4">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  {uploading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <FaUpload />
                  )}
                  <span>Upload</span>
                </button>
              </div>

              {uploadError && (
                <div className="mt-2 text-red-500 text-sm">
                  {uploadError}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stats Section */}
        <div className="max-w-7xl mx-auto px-8 -mt-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="grid grid-cols-4 gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center p-4"
              >
                <div className="text-3xl font-bold text-purple-600">{stats.workouts}</div>
                <div className="text-gray-600">Workouts</div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center p-4"
              >
                <div className="text-3xl font-bold text-blue-600">{stats.meals}</div>
                <div className="text-gray-600">Meal Plans</div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center p-4"
              >
                <div className="text-3xl font-bold text-green-600">{stats.posts}</div>
                <div className="text-gray-600">Posts</div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center p-4"
              >
                <div className="text-3xl font-bold text-yellow-600">{stats.achievements}</div>
                <div className="text-gray-600">Achievements</div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="max-w-7xl mx-auto px-8 mt-8">
          <TETabs fill className="bg-white rounded-lg shadow-sm">
            <TETabsItem
              onClick={() => setActiveTab("posts")}
              active={activeTab === "posts"}
              color="primary"
              className="px-6 py-3 text-sm font-medium rounded-md transition-colors duration-200"
            >
              Posts
            </TETabsItem>
            <TETabsItem
              onClick={() => setActiveTab("workouts")}
              active={activeTab === "workouts"}
              color="primary"
              className="px-6 py-3 text-sm font-medium rounded-md transition-colors duration-200"
            >
              Workouts
            </TETabsItem>
            <TETabsItem
              onClick={() => setActiveTab("meals")}
              active={activeTab === "meals"}
              color="primary"
              className="px-6 py-3 text-sm font-medium rounded-md transition-colors duration-200"
            >
              Meals
            </TETabsItem>
            <TETabsItem
              onClick={() => setActiveTab("about")}
              active={activeTab === "about"}
              color="primary"
              className="px-6 py-3 text-sm font-medium rounded-md transition-colors duration-200"
            >
              About
            </TETabsItem>
          </TETabs>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-8 mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {activeTab === "posts" && (
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
                      user={loginUser}
                      reFetchPost={reFetchPost}
                      setReFetchPost={setReFetchPost}
                    />
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === "workouts" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {demoWorkouts.map((workout, index) => (
                  <motion.div
                    key={workout.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <WorkoutCard workout={workout} />
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === "meals" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {demoMeals.map((meal, index) => (
                  <motion.div
                    key={meal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <MealCard meal={meal} />
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === "about" && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">About Me</h2>
                  <p className="text-gray-600">
                    Fitness enthusiast with a passion for healthy living and personal development. 
                    I believe in the power of consistent exercise and proper nutrition to transform lives.
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Achievements</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {demoAchievements.map((achievement, index) => (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <AchievementCard achievement={achievement} />
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Fitness Goals</h2>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <FaChartLine className="text-purple-500 text-xl" />
                      <div>
                        <h3 className="font-semibold">Weight Loss</h3>
                        <p className="text-gray-600">Target: 10kg in 3 months</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <FaHeartbeat className="text-red-500 text-xl" />
                      <div>
                        <h3 className="font-semibold">Cardio Improvement</h3>
                        <p className="text-gray-600">Run 5km in under 25 minutes</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <FaDumbbell className="text-blue-500 text-xl" />
                      <div>
                        <h3 className="font-semibold">Strength Training</h3>
                        <p className="text-gray-600">Bench press 100kg</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
