'use client';
import { Resend } from 'resend';
import React, { useState, useEffect, useRef } from 'react';
import { Heart, Sparkles, Clock, CheckCircle } from 'lucide-react';

const ApologyWebsite = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState('');
  const [showHearts, setShowHearts] = useState(false);
  const [collectedHearts, setCollectedHearts] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [backgroundElements, setBackgroundElements] = useState([]);
  const [collectedHeartIds, setCollectedHeartIds] = useState(new Set());
  const forgiveButtonRef = useRef(null);
  const [isHoveringForgive, setIsHoveringForgive] = useState(false);
  

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (currentStep !== 5 || !forgiveButtonRef.current) return;
  
      const rect = forgiveButtonRef.current.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      const distance = Math.sqrt(dx * dx + dy * dy);
  
      if (distance < 50) {
        // Move to a new random position
        const newTop = Math.random() * 80 + 10; // % range between 10% and 90%
        const newLeft = Math.random() * 80 + 10;
        setButtonPosition({ top: `${newTop}%`, left: `${newLeft}%` });
      }
    };
  
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [currentStep]);
  // Initialize background elements on client side
  useEffect(() => {
    // Background sparkles
    const bgElements = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      animationDelay: Math.random() * 5,
      animationDuration: 3 + Math.random() * 4
    }));
    setBackgroundElements(bgElements);
  }, []);

  // Show hearts when we reach step 4
  useEffect(() => {
    if (currentStep === 4) {
      setShowHearts(true);
    }
  }, [currentStep]);

  // Calculate time since argument (adjust this date)
  const argumentDate = new Date('2025-07-18T00:00:00');
  
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = now - argumentDate;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeElapsed(`${days} days, ${hours} hours, ${minutes} minutes`);
    }, 1000);

    return () => clearInterval(timer);
  }, [argumentDate]);

  useEffect(() => {
    setProgress((currentStep / 6) * 100);
  }, [currentStep]);

  const apologyWords = ['I', 'AM', 'TRULY', 'SORRY', 'AYUSHI'];

  
  useEffect(() => {
    if (currentStep === 3 && wordIndex < apologyWords.length) {
      const timer = setTimeout(() => {
        setWordIndex(wordIndex + 1);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [currentStep, wordIndex, apologyWords.length]);

  const confettiPieces = Array.from({ length: 50 }, (_, i) => i);
  const heartPieces = Array.from({ length: 8 }, (_, i) => i);

  const handleHeartClick = (heartId) => {
    if (!collectedHeartIds.has(heartId)) {
      setCollectedHeartIds(prev => new Set([...prev, heartId]));
      setCollectedHearts(prev => prev + 1);
    }
  };

  const resetGame = () => {
    setCollectedHearts(0);
    setCollectedHeartIds(new Set());
    setShowHearts(false);
    // Show hearts again after a brief delay
    setTimeout(() => setShowHearts(true), 200);
  };

  // Custom Button Component
  const Button = ({ children, onClick, className = "", size = "default", variant = "default" }) => {
    const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    const sizeClasses = {
      default: "h-10 py-2 px-4",
      lg: "h-11 px-8 py-3"
    };
    const variantClasses = {
      default: "bg-blue-500 text-white hover:bg-blue-600",
      outline: "border border-gray-300 bg-white hover:bg-gray-50"
    };
    
    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      >
        {children}
      </button>
    );
  };

  // Custom Card Components
  const Card = ({ children, className = "" }) => (
    <div className={`rounded-lg border bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );

  const CardHeader = ({ children, className = "" }) => (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
      {children}
    </div>
  );

  const CardTitle = ({ children, className = "" }) => (
    <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>
      {children}
    </h3>
  );

  const CardDescription = ({ children, className = "" }) => (
    <p className={`text-sm text-gray-600 ${className}`}>
      {children}
    </p>
  );

  const CardContent = ({ children, className = "" }) => (
    <div className={`p-6 pt-0 ${className}`}>
      {children}
    </div>
  );

  // Custom Badge Component
  const Badge = ({ children, variant = "default", className = "" }) => {
    const variantClasses = {
      default: "bg-blue-500 text-white",
      outline: "border border-gray-300 bg-white text-gray-900",
      secondary: "bg-gray-100 text-gray-900",
      destructive: "bg-red-500 text-white"
    };
    
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className}`}>
        {children}
      </span>
    );
  };

  // Custom Progress Component
  const Progress = ({ value, className = "" }) => (
    <div className={`relative h-4 w-full overflow-hidden rounded-full bg-gray-200 ${className}`}>
      <div
        className="h-full bg-blue-500 transition-all duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  );

  // Custom Alert Component
  const Alert = ({ children, className = "" }) => (
    <div className={`relative w-full rounded-lg border p-4 ${className}`}>
      {children}
    </div>
  );

  const AlertDescription = ({ children, className = "" }) => (
    <div className={`text-sm ${className}`}>
      {children}
    </div>
  );

  const steps = [
    // Step 0: Welcome
    {
      title: "Hi Ayushi",
      content: (
        <div className="text-center space-y-6">
          <div className="text-8xl animate-pulse mb-4">👋</div>
          <CardContent className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              I have something important to tell you...
            </h2>
            
            <Alert className="bg-red-50 border-red-200">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  <div className="text-center">
                    <p className="font-medium text-red-800">Time since our argument:</p>
                    <Badge variant="destructive" className="text-lg mt-2">
                      {timeElapsed}
                    </Badge>
                  </div>
                </AlertDescription>
              </div>
            </Alert>

            <Button 
              onClick={() => setCurrentStep(1)}
              className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 text-lg font-medium transition-all transform hover:scale-105"
              size="lg"
            >
              Click to continue... 💕
            </Button>
          </CardContent>
        </div>
      )
    },
    // Step 1: Realization
    {
      title: "I've been thinking...",
      content: (
        <div className="text-center space-y-6">
          <div className="text-6xl mb-6">💭</div>
          <div className="space-y-4">
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 animate-fade-in">
              <CardContent className="p-6">
                <p className="text-lg text-gray-700">
                  I realize I hurt you by what I said about your photo
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 animate-fade-in animation-delay-500">
              <CardContent className="p-6">
                <p className="text-lg text-gray-700">
                  You mean the world to me
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-pink-50 to-red-50 animate-fade-in animation-delay-1000">
              <CardContent className="p-6">
                <p className="text-lg text-gray-700">
                  I shouldn't have criticized you like that
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Button 
            onClick={() => setCurrentStep(2)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg font-medium transition-all transform hover:scale-105"
            size="lg"
          >
            I understand now... 🌟
          </Button>
        </div>
      )
    },
    // Step 2: Taking Responsibility
    {
      title: "I take full responsibility",
      content: (
        <div className="text-center space-y-6">
          <div className="text-6xl mb-6">🙏</div>
          
          <Card className="bg-gradient-to-br from-orange-50 to-red-50">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">My Promise to You</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    I hurt your feelings by criticizing your photo. That was wrong of me.
                  </AlertDescription>
                </div>
              </Alert>
              
              <Alert>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    I'm not making excuses. I messed up, and I own that completely.
                  </AlertDescription>
                </div>
              </Alert>
              
              <Alert className="bg-green-50 border-green-200">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800 font-medium">
                    I promise to think before I speak from now on.
                  </AlertDescription>
                </div>
              </Alert>
            </CardContent>
          </Card>
          
          <Button 
            onClick={() => setCurrentStep(3)}
            className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 text-lg font-medium transition-all transform hover:scale-105"
            size="lg"
          >
            I want to say... 💜
          </Button>
        </div>
      )
    },
    // Step 3: Animated Apology
    {
      title: "My sincere apology",
      content: (
        <div className="text-center space-y-8">
          <div className="flex justify-center items-center space-x-4 h-20">
            {apologyWords.map((word, index) => (
              <Badge
                key={index}
                variant={index < wordIndex ? "default" : "outline"}
                className={`text-2xl p-4 transition-all duration-500 ${
                  index < wordIndex 
                    ? 'bg-red-500 text-white transform scale-100 animate-pulse' 
                    : 'opacity-30 transform scale-75'
                }`}
              >
                {word}
              </Badge>
            ))}
          </div>
          
          {wordIndex >= apologyWords.length && (
            <Card className="bg-gradient-to-r from-red-50 to-pink-50 animate-fade-in">
              <CardContent className="p-8">
                <div className="text-6xl mb-4">💔➡️❤️</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  I'm truly sorry for what I said about your photo, Ayushi.
                </h3>
                <p className="text-lg text-gray-600 mb-6">
                  My words were hurtful and I deeply regret them.
                </p>
                <Button
                  onClick={() => setCurrentStep(4)}
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 text-lg font-medium transition-all transform hover:scale-105"
                  size="lg"
                >
                  Continue... ❤️
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )
    },
    // Step 4: Heart Collection Game
    {
      title: "Collect my hearts of apology",
      content: (
        <div className="text-center space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Heart className="text-red-500" fill="currentColor" />
                Heart Collection Game
              </CardTitle>
              <CardDescription>
                Click the hearts to collect them as my apology
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center gap-4">
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  Hearts collected: {collectedHearts}/8
                </Badge>
                <Progress value={(collectedHearts / 8) * 100} className="w-32" />
              </div>
              
              <div className="relative h-64 bg-gradient-to-br from-pink-100 to-red-100 rounded-lg overflow-hidden border-2 border-pink-200">
                {showHearts && heartPieces.map((heart) => (
                  <div
                    key={heart}
                    id={`heart-${heart}`}
                    className={`absolute cursor-pointer transition-transform ${
                      collectedHeartIds.has(heart) 
                        ? 'scale-0 opacity-0' 
                        : 'animate-float hover:scale-125'
                    }`}
                    style={{
                      left: `${Math.random() * 80 + 10}%`,
                      top: `${Math.random() * 60 + 10}%`,
                      animationDelay: `${Math.random() * 2}s`
                    }}
                    onClick={() => handleHeartClick(heart)}
                  >
                    <Heart className="text-red-500 w-8 h-8" fill="currentColor" />
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center gap-4">
                <Button
                  onClick={resetGame}
                  variant="outline"
                  className="border-gray-300"
                >
                  Reset Game 🔄
                </Button>
                {collectedHearts >= 8 && (
                  <Button
                    onClick={() => setCurrentStep(5)}
                    className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg font-medium transition-all transform hover:scale-105 animate-pulse"
                    size="lg"
                  >
                    All hearts collected! ✨
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    // Step 5: Forgiveness Question
    {
      title: "Will you forgive me?",
      content: (
        <div className="text-center space-y-6">
          <div className="text-6xl mb-6">🥺</div>
          
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                I promise to never comment on your photos like that again.
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Do you believe me?
              </p>
              
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => {
                    setShowConfetti(true);
                    setCurrentStep(6);
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg font-medium transition-all transform hover:scale-105"
                  size="lg"
                >
                  Yes, I forgive you ❤️
                </Button>
                <div
  onMouseEnter={() => setIsHoveringForgive(true)}
  onMouseLeave={() => setIsHoveringForgive(false)}
  className="inline-block"
>
  <Button
    onClick={() => setCurrentStep(7)}
    variant="outline"
    className={`border-gray-300 px-8 py-3 text-lg font-medium transition-all transform hover:scale-105 ${
      isHoveringForgive ? 'opacity-0 pointer-events-none' : 'opacity-100'
    }`}
    size="lg"
  >
    I need more time ⏰
  </Button>
</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    // Step 6: Forgiveness Accepted
    {
      title: "Thank you!",
      content: (
        <div className="text-center space-y-6">
          <div className="text-8xl animate-bounce mb-6">🎉</div>
          
          <Card className="bg-gradient-to-r from-green-50 to-blue-50">
            <CardHeader>
              <CardTitle className="text-3xl text-green-600">
                Thank you for forgiving me!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="bg-green-50 border-green-200">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    I appreciate your trust and kindness.
                  </AlertDescription>
                </div>
              </Alert>
              
              <Alert className="bg-blue-50 border-blue-200">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    I promise to be more thoughtful with my words.
                  </AlertDescription>
                </div>
              </Alert>
              
              <div className="text-6xl mt-6">❤️💖💕</div>
            </CardContent>
          </Card>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {backgroundElements.map((element) => (
          <div
            key={element.id}
            className="absolute animate-float"
            style={{
              left: `${element.left}%`,
              top: `${element.top}%`,
              animationDelay: `${element.animationDelay}s`,
              animationDuration: `${element.animationDuration}s`
            }}
          >
            <Sparkles className="text-white/40 w-6 h-6" />
          </div>
        ))}
      </div>

      {/* Confetti */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {confettiPieces.map((piece) => (
            <div
              key={piece}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b'][Math.floor(Math.random() * 5)],
                animationDelay: `${Math.random() * 3}s`
              }}
            >
              <div className="w-3 h-3 rounded"></div>
            </div>
          ))}
        </div>
      )}

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Progress</span>
            <span className="text-sm font-medium text-gray-600">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 pt-20">
        <Card className="max-w-4xl w-full shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold text-gray-800 mb-2">
              {steps[currentStep].title}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="min-h-[500px] flex items-center justify-center">
            {steps[currentStep].content}
          </CardContent>
        </Card>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes confetti {
          0% { transform: translateY(-100vh) rotate(0deg); }
          100% { transform: translateY(100vh) rotate(360deg); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-confetti {
          animation: confetti 3s linear infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default ApologyWebsite;