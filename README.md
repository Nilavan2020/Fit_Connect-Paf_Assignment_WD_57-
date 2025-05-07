# FitConnect: Your Personal Fitness & Wellness Companion

A comprehensive fitness and wellness platform that connects users with personalized workout plans, meal tracking, and a supportive community to achieve their health goals.

## ✨ Features

### 🏋️‍♂️ Workout Management
- **Personalized Workout Plans** - Customized exercise routines based on your fitness goals
- **Workout Status Tracking** - Log and monitor your daily workout progress
- **Exercise Library** - Access to a wide range of exercises with detailed instructions
- **Progress Analytics** - Track your fitness journey with detailed statistics

### 🥗 Nutrition & Meal Planning
- **Smart Meal Planning** - Create and manage personalized meal plans
- **Recipe Database** - Access to healthy recipes with nutritional information
- **Dietary Preferences** - Support for various dietary requirements and restrictions
- **Nutritional Tracking** - Monitor your daily calorie and nutrient intake

### 👥 Community Features
- **Social Feed** - Share your fitness journey and connect with others
- **Progress Sharing** - Post your achievements and milestones
- **Community Support** - Engage with like-minded fitness enthusiasts
- **Expert Guidance** - Access to professional trainers and nutritionists

### 🎯 Personalization
- **Goal Setting** - Set and track your fitness and wellness objectives
- **Progress Tracking** - Monitor your achievements with detailed analytics
- **Customizable Profiles** - Personalize your fitness journey
- **Smart Recommendations** - AI-powered suggestions based on your preferences

## 🛠️ Technologies Used

### Frontend
- React.js
- Tailwind CSS
- React Router
- Axios
- React Icons
- React Hook Form
- Yup Validation

### Backend
- Spring Boot
- Java
- MySQL
- JWT Authentication
- Firebase Storage

### Additional Tools
- Firebase (Image Storage)
- React Hot Toast (Notifications)
- React Icons (UI Icons)

## 🚀 Quick Start

1. Clone the repository:
```bash
git clone https://github.com/yourusername/FitConnect.git
cd FitConnect
```

2. Install dependencies:
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
mvn install
```

3. Configure environment variables:
```bash
# Frontend (.env)
REACT_APP_API_URL=http://localhost:8080
REACT_APP_FIREBASE_CONFIG=your_firebase_config

# Backend (application.properties)
spring.datasource.url=jdbc:mysql://localhost:3306/fitconnect
spring.datasource.username=your_username
spring.datasource.password=your_password
```

4. Start the application:
```bash
# Start backend server
cd backend
mvn spring-boot:run

# Start frontend development server
cd frontend
npm start
```

5. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080

## 📱 Features in Detail

### Workout Management
- Create and customize workout plans
- Track daily workout status
- View exercise history and progress
- Get exercise recommendations

### Meal Planning
- Create personalized meal plans
- Access recipe database
- Track nutritional intake
- Set dietary preferences

### Community Features
- Share workout achievements
- Connect with other users
- Post updates and progress
- Engage in community discussions

### User Profile
- Customize profile settings
- Track fitness goals
- View activity history
- Manage notifications

## 🤝 Contributing

We welcome contributions to FitConnect! Please feel free to submit issues and pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- [Your Name] - Lead Developer
- [Team Member 2] - Backend Developer
- [Team Member 3] - Frontend Developer
- [Team Member 4] - UI/UX Designer

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape FitConnect
- Special thanks to the open-source community for their invaluable tools and libraries
- Inspired by the need for a comprehensive fitness and wellness platform
