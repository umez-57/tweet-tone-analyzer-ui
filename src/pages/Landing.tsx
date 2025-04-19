import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sun, Moon, Brain, MessageSquare, Zap, Twitter } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { format } from "date-fns";

const features = [
  {
    icon: Brain,
    title: "Smart Analysis",
    description: "Advanced AI models for accurate sentiment detection"
  },
  {
    icon: MessageSquare,
    title: "Batch Processing",
    description: "Analyze multiple texts simultaneously"
  },
  {
    icon: Zap,
    title: "Real-time Results",
    description: "Instant feedback with detailed sentiment breakdown"
  }
];

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    initial={{ opacity: 0, filter: "blur(10px)" }}
    animate={{ opacity: 1, filter: "blur(0px)" }}
    transition={{ duration: 0.8 }}
    className="bg-white dark:bg-gray-800 rounded-xl p-6 text-left border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 h-full"
  >
    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
      <Icon className="h-6 w-6 text-primary" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400">{description}</p>
  </motion.div>
);

const Landing = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const currentTime = format(new Date(), "hh:mm a");

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="flex items-center gap-2 text-xl font-bold text-primary">
            <Twitter className="h-6 w-6" />
            TweetSense
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 dark:text-gray-300">{currentTime}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {theme === 'light' ? (
                <Sun className="h-[1.2rem] w-[1.2rem] text-gray-600" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem] text-gray-300" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
            Sentiment Analysis
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Analyze the sentiment of tweets and text messages using advanced machine learning models. Whether it's positive, neutral, or negative, our tool helps you understand the emotional tone.
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/analyze')}
            className="bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white px-8 py-6 text-lg rounded-full group transition-all duration-300"
          >
            Start Analyzing
            <ArrowRight className="w-6 h-6 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-16 mb-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="h-full"
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-16"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Sample Sentiment Analysis
          </h3>
          <div className="space-y-4">
            <SampleTweet
              avatar="H"
              name="HappyCustomer"
              username="@happy123"
              verified
              text="Just had the most amazing experience with their customer service team. They went above and beyond to solve my issue. Truly impressed! 👏"
              sentiment="positive"
              stats={{ replies: 24, retweets: 12, likes: 492 }}
            />
            <SampleTweet
              avatar="T"
              name="TechReviewer"
              username="@techreview"
              verified
              text="The new update includes several changes to the user interface. Some features have been moved while others have been redesigned for better usability."
              sentiment="neutral"
              stats={{ replies: 24, retweets: 12, likes: 492 }}
            />
            <SampleTweet
              avatar="D"
              name="Disappointed"
              username="@notpleased"
              text="Waited over an hour for customer support and still no resolution. This is unacceptable service quality and I'm considering switching providers."
              sentiment="negative"
              stats={{ replies: 24, retweets: 12, likes: 492 }}
            />
          </div>
        </motion.div>
      </main>

      <footer className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
        Made by <a href="#" className="text-primary hover:underline">Your Name</a>
      </footer>
    </div>
  );
};

const SampleTweet = ({ avatar, name, username, verified, text, sentiment, stats }) => {
  const sentimentStyles = {
    positive: {
      bg: "bg-[#E8F7F0]",
      text: "text-[#00BA7C]",
      icon: "💚"
    },
    neutral: {
      bg: "bg-[#FFF8E7]", 
      text: "text-[#FFD700]",
      icon: "🟡"
    },
    negative: {
      bg: "bg-[#FFE9EC]",
      text: "text-[#F4212E]",
      icon: "❤️"
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 text-left">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-semibold text-gray-600 dark:text-gray-300">
          {avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 flex-wrap">
            <span className="font-bold text-gray-900 dark:text-white">{name}</span>
            {verified && (
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-primary">
                <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
              </svg>
            )}
            <span className="text-gray-500">{username}</span>
            <span className="text-gray-500">·</span>
            <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${sentimentStyles[sentiment].bg} ${sentimentStyles[sentiment].text}`}>
              {sentimentStyles[sentiment].icon}
              <span className="capitalize">{sentiment}</span>
            </span>
          </div>
          <p className="mt-2 text-gray-900 dark:text-white">{text}</p>
          <div className="mt-3 flex gap-4 text-gray-500">
            <span>💬 {stats.replies}</span>
            <span>🔄 {stats.retweets}</span>
            <span>❤️ {stats.likes}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;