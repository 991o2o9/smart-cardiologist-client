# 🩺 Smart Cardiologist Client

An intelligent cardiological platform for heart disease risk analysis using AI and WebRTC technologies.

## ✨ Key Features

- 📊 **Risk Analysis** - Heart attack possibility assessment based on user data
- 🤖 **AI Cardiologist** - Smart assistant with personalized recommendations
- 💓 **Pulse Detector** - Heart rate detection via WebRTC and camera
- 📋 **Medical Surveys** - Interactive forms for medical history collection
- 📈 **Data Visualization** - Health status charts and diagrams

## 🔬 WebRTC Pulse Detection

Unique pulse detection technology through web camera:

- **Photoplethysmography (PPG)** - Analysis of skin color changes during blood flow
- **FFT Processing** - Fast Fourier Transform for heart rhythm extraction
- **Data Smoothing** - Moving-average algorithms for accurate results
- **Real-time Monitoring** - Live pulse monitoring without additional devices

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** SCSS Modules, Responsive Design
- **State Management:** Zustand, React Hook Form
- **Data Fetching:** TanStack Query, Axios
- **Routing:** React Router DOM
- **Charts:** Chart.js, React Chart.js 2
- **Signal Processing:** FFT.js, Moving Average
- **UI Components:** Lucide React Icons
- **Form Validation:** Zod + Hookform Resolvers

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Yarn package manager

### Installation

```bash
# Clone repository
git clone https://github.com/your-username/smart-cardiologist-client.git

# Navigate to project
cd smart-cardiologist-client

# Install dependencies
yarn install

# Start development server
yarn dev
```

### Available Scripts

```bash
yarn dev        # Start development server
yarn build      # Build for production
yarn preview    # Preview production build
yarn lint       # Run ESLint
```

## 🏗️ Project Structure

```
src/
├── app/          # Application configuration
├── entities/     # Business entities & API
├── features/     # Feature components
├── pages/        # Page components
├── shared/       # Shared utilities & UI
└── widgets/      # Complex UI widgets
```

## 🔐 Features Overview

### Authentication System
- User registration with email verification
- Secure login with form validation
- Protected routes and guest guards

### Health Assessment
- Interactive medical questionnaires
- Risk calculation algorithms
- Progress tracking and navigation

### Pulse Detection
- Camera-based heart rate monitoring
- Real-time signal processing
- WebRTC integration for accurate measurements

### AI Consultation
- Virtual cardiologist chat interface
- Personalized health recommendations
- Medical advice based on user data

## 📱 Responsive Design

Fully responsive interface optimized for:
- Desktop computers
- Tablets
- Mobile devices

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🚨 Disclaimer

This application is for educational and informational purposes only. It is not intended to replace professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
