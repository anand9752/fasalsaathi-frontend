import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Languages, Leaf, MapPin, Smartphone, User } from "lucide-react";

import { authApi, cropApi, farmApi } from "../services/api";
import { Crop } from "../types/api";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface OnboardingProps {
  onComplete: () => void;
}

interface UserInfo {
  name: string;
  email: string;
  password: string;
  phone: string;
  location: string;
  farmSize: string;
  primaryCrop: string;
}

export function OnboardingFlow({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("hi");
  const [availableCrops, setAvailableCrops] = useState<Crop[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "",
    email: "",
    password: "",
    phone: "",
    location: "",
    farmSize: "",
    primaryCrop: "",
  });

  useEffect(() => {
    cropApi.getAllCrops().then(setAvailableCrops).catch(() => setAvailableCrops([]));
  }, []);

  const steps = [
    { id: 0, component: SplashScreen },
    { id: 1, component: LanguageSelection },
    { id: 2, component: Registration },
  ];

  const completeOnboarding = async () => {
    if (!userInfo.name || !userInfo.email || !userInfo.password || !userInfo.location) {
      setError("Please fill in name, email, password, and location.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      await authApi.register({
        email: userInfo.email,
        password: userInfo.password,
        phone: userInfo.phone || undefined,
        full_name: userInfo.name,
        language_preference: selectedLanguage,
      });

      const token = await authApi.login(userInfo.email, userInfo.password);
      localStorage.setItem("accessToken", token.access_token);

      const farmArea =
        userInfo.farmSize === "small" ? 5 : userInfo.farmSize === "medium" ? 12 : userInfo.farmSize === "large" ? 25 : 5;
      const selectedCrop = availableCrops.find((crop) => String(crop.id) === userInfo.primaryCrop);

      await farmApi.createFarm({
        name: `${userInfo.name.split(" ")[0] || "My"} Farm`,
        location: userInfo.location,
        area: farmArea,
        soil_type: "loamy",
        irrigation_type: "drip",
        initial_crop_id: selectedCrop?.id,
        initial_crop_season: selectedCrop?.season,
        initial_crop_year: new Date().getFullYear(),
      });

      onComplete();
    } catch (submitError: any) {
      setError(submitError?.response?.data?.detail || "Unable to complete onboarding right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((step) => step + 1);
      return;
    }
    await completeOnboarding();
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 flex items-center justify-center p-4">
      <CurrentStepComponent
        onNext={nextStep}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        userInfo={userInfo}
        setUserInfo={setUserInfo}
        crops={availableCrops}
        error={error}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

function SplashScreen({ onNext }: { onNext: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="text-center max-w-md"
    >
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-2xl">
        <CardContent className="p-8">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Leaf className="w-10 h-10 text-white" />
          </motion.div>

          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-3xl font-bold text-primary mb-2"
            style={{ fontFamily: "Poppins" }}
          >
            FasalSaathi
          </motion.h1>

          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-lg text-gray-600 mb-6"
          >
            Your AI farming companion
          </motion.p>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="text-gray-600 mb-8 leading-relaxed"
          >
            Create your account, set up your first farm, and start getting live weather, market, and crop guidance.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <Button onClick={onNext} className="w-full py-3" size="lg">
              Start
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function LanguageSelection({
  onNext,
  selectedLanguage,
  setSelectedLanguage,
}: {
  onNext: () => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
}) {
  const languages = [
    { code: "hi", name: "Hindi" },
    { code: "en", name: "English" },
    { code: "mr", name: "Marathi" },
  ];

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full"
    >
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-2xl">
        <CardHeader className="text-center pb-4">
          <Languages className="w-12 h-12 text-primary mx-auto mb-4" />
          <CardTitle className="text-2xl" style={{ fontFamily: "Poppins" }}>
            Choose your language
          </CardTitle>
          <p className="text-gray-600">You can change this later too.</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelectedLanguage(lang.code)}
              className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                selectedLanguage === lang.code
                  ? "border-primary bg-primary/10 shadow-md"
                  : "border-gray-200 hover:border-primary/50 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="font-medium">{lang.name}</p>
                {selectedLanguage === lang.code && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                )}
              </div>
            </button>
          ))}

          <Button onClick={onNext} className="w-full mt-6" size="lg">
            Continue
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function Registration({
  onNext,
  userInfo,
  setUserInfo,
  crops,
  error,
  isSubmitting,
}: {
  onNext: () => void;
  userInfo: UserInfo;
  setUserInfo: Dispatch<SetStateAction<UserInfo>>;
  crops: Crop[];
  error: string;
  isSubmitting: boolean;
}) {
  const handleInputChange = (field: keyof UserInfo, value: string) => {
    setUserInfo((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full"
    >
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-2xl">
        <CardHeader className="text-center pb-4">
          <User className="w-12 h-12 text-primary mx-auto mb-4" />
          <CardTitle className="text-2xl" style={{ fontFamily: "Poppins" }}>
            Create your farm account
          </CardTitle>
          <p className="text-gray-600">We’ll create your profile and first farm in one step.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          <div>
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              value={userInfo.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Ramesh Kumar"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={userInfo.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="farmer@example.com"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={userInfo.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder="At least 6 characters"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="phone">Mobile number</Label>
            <div className="relative mt-1">
              <Smartphone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                id="phone"
                value={userInfo.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+91 9876543210"
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <div className="relative mt-1">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                id="location"
                value={userInfo.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="Itarsi, Madhya Pradesh"
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="farmSize">Farm size</Label>
            <Select onValueChange={(value) => handleInputChange("farmSize", value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Choose a size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small (1-5 acre)</SelectItem>
                <SelectItem value="medium">Medium (5-20 acre)</SelectItem>
                <SelectItem value="large">Large (20+ acre)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="primaryCrop">Primary crop</Label>
            <Select onValueChange={(value) => handleInputChange("primaryCrop", value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Choose a crop" />
              </SelectTrigger>
              <SelectContent>
                {crops.map((crop) => (
                  <SelectItem key={crop.id} value={String(crop.id)}>
                    {crop.name_hindi} ({crop.name})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4">
            <Button onClick={onNext} className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Start FasalSaathi"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
