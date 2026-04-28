import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// Public pages
import { LandingPage } from "./pages/LandingPage";
import { FeaturesPage } from "./pages/FeaturesPage";
import { PricingPage } from "./pages/PricingPage";
import { ContactPage } from "./pages/ContactPage";
import { GuidelinesPage } from "./pages/GuidelinesPage";
import { TermsPage } from "./pages/TermsPage";
import { PrivacyPage } from "./pages/PrivacyPage";

// App internals (existing)
import { WeatherHeader } from "./components/navigation";
import { OnboardingFlow } from "./components/onboarding";
import { LoginPage } from "./components/LoginPage"; // <-- IMPORTED LOGIN PAGE
import { CalendarPage } from "./components/calendar-page";
import { MarketPage } from "./components/market-page";
import { PlantAnalysisPage } from "./components/plant-analysis";
import { MyFarmPage } from "./components/my-farm-page";
import { BalancedDashboard } from "./components/balanced-dashboard";
import { PreciseYieldPrediction } from "./components/precise-yield-prediction";
import { CropRecommendationsPage } from "./components/crop-recommendations-page";
import { InventoryPage } from "./components/inventory-page";
import { AIChatAssistant } from "./components/ai-chat";
import { AskSathiChat } from "./components/AskSathiChat";
import { BreedAnalysisPage } from "./components/breed-analysis";
import { YieldPredictionTool } from "./components/yield-prediction-tool";
import { LanguageProvider, useLanguage } from "./components/language-context";
import { NotificationProvider } from "./context/NotificationContext";
import { NotificationBell } from "./components/NotificationBell";
import { Toaster } from "sonner";
import { authApi } from "./services/api";
import { User as ApiUser } from "./types/api";
import {
  DashboardVariation2,
  DashboardVariation3,
} from "./components/dashboard-variants";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./components/ui/avatar";
import {
  LayoutDashboard,
  MapPin,
  Calendar,
  TrendingUp,
  User,
  Languages,
  Leaf,
  MessageCircle,
  Package,
  Target,
} from "lucide-react";

// Added "login" to the Page type
type Page =
  | "login"
  | "onboarding"
  | "dashboard"
  | "calendar"
  | "market"
  | "plant-analysis"
  | "my-farm"
  | "yield-prediction"
  | "crop-recommendations"
  | "inventory"
  | "breed-analysis";
type Language = "hi" | "en" | "mr" | "pa";

// ─────────────────────────────────────────────────────────────────────────────
// Root — sets up routes (BrowserRouter is provided by main.tsx)
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <Routes>
      {/* Public static pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/guidelines" element={<GuidelinesPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/breed-analysis" element={<BreedAnalysisPage />} />
   
      {/* Authenticated app — lives at /app */}
      <Route path="/app" element={<AuthenticatedApp />} />
      <Route path="/app/*" element={<AuthenticatedApp />} />

      {/* Catch-all → redirect to landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AuthenticatedApp — the existing entire app, now at /app
// ─────────────────────────────────────────────────────────────────────────────
function AuthenticatedApp() {
  const location = useLocation();

  const [currentPage, setCurrentPage] = useState<Page>(() => {
    // If logged in, go straight to dashboard
    if (localStorage.getItem("accessToken")) return "dashboard";
    
    // If not logged in, check the URL to see if they clicked Login or Register
    const params = new URLSearchParams(location.search);
    return params.get("mode") === "login" ? "login" : "onboarding";
  });

  // Watch for URL changes in case they use the navbar to switch between Login and Register
  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      const params = new URLSearchParams(location.search);
      setCurrentPage(params.get("mode") === "login" ? "login" : "onboarding");
    }
  }, [location.search]);

  const [activeVariation, setActiveVariation] = useState(1);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAskSathiOpen, setIsAskSathiOpen] = useState(false);
  const handleNavigation = (page: Page) => {
    setCurrentPage(page);
  };

  // Route to the correct unauthenticated screen
  if (currentPage === "onboarding") {
    return <OnboardingFlow onComplete={() => handleNavigation("dashboard")} />;
  }

  if (currentPage === "login") {
    return (
      <LoginPage 
        onLogin={() => handleNavigation("dashboard")} 
        onNavigateToRegister={() => handleNavigation("onboarding")} 
      />
    );
  }

  return (
    <LanguageProvider>
      <NotificationProvider>
        <AppContent
          currentPage={currentPage}
          activeVariation={activeVariation}
          setActiveVariation={setActiveVariation}
          isChatOpen={isChatOpen}
          setIsChatOpen={setIsChatOpen}
          isAskSathiOpen={isAskSathiOpen}
          setIsAskSathiOpen={setIsAskSathiOpen}
          handleNavigation={handleNavigation}
        />
        <Toaster position="bottom-right" richColors />
      </NotificationProvider>
    </LanguageProvider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AppContent — unchanged inner shell
// ─────────────────────────────────────────────────────────────────────────────
function AppContent({
  currentPage,
  activeVariation,
  setActiveVariation,
  isChatOpen,
  setIsChatOpen,
  isAskSathiOpen,
  setIsAskSathiOpen,
  handleNavigation,
}: {
  currentPage: Page;
  activeVariation: number;
  setActiveVariation: (variation: number) => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  isAskSathiOpen: boolean;
  setIsAskSathiOpen: (open: boolean) => void;
  handleNavigation: (page: Page) => void;
}) {
  const { t } = useLanguage();
  const [currentUser, setCurrentUser] = useState<ApiUser | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setCurrentUser(null);
      handleNavigation("login"); // Redirect to login if token is missing
      return;
    }

    authApi
      .getCurrentUser()
      .then(setCurrentUser)
      .catch(() => {
        localStorage.removeItem("accessToken");
        setCurrentUser(null);
        handleNavigation("login"); // Redirect to login on token failure
      });
  }, [currentPage, handleNavigation]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setCurrentUser(null);
    handleNavigation("login"); // Take them back to login when they log out
  };

  const variations = [
    { id: 1, name: "Balanced Grid", component: BalancedDashboard },
    { id: 2, name: "Feed Style", component: DashboardVariation2 },
    { id: 3, name: "Data-Centric", component: DashboardVariation3 },
  ];

  const ActiveComponent =
    variations.find((v) => v.id === activeVariation)?.component ||
    BalancedDashboard;

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "calendar":
        return <CalendarPage />;
      case "market":
        return <MarketPage />;
      case "plant-analysis":
        return <PlantAnalysisPage />;
      case "my-farm":
        return <MyFarmPage />;
      case "yield-prediction":
        return (
          <YieldPredictionTool onBack={() => handleNavigation("dashboard")} />
        );
      case "crop-recommendations":
        return <CropRecommendationsPage />;
      case "inventory":
        return <InventoryPage />;
      case "breed-analysis":
        return <BreedAnalysisPage />;

      case "dashboard":
      default:
        return (
          <>
            {/* Variation Selector */}
            <div className="bg-white border-b border-gray-200 px-4 py-3">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between">
                  <div>
                    <h2
                      className="text-lg font-semibold text-gray-800"
                      style={{ fontFamily: "Poppins" }}
                    >
                      {t("dashboard-layout-variations")}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {t("choose-preferred-layout")}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    {variations.map((variation) => (
                      <Button
                        key={variation.id}
                        variant={
                          activeVariation === variation.id
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => setActiveVariation(variation.id)}
                        className="relative"
                      >
                        {t(
                          variation.id === 1
                            ? "balanced-grid"
                            : variation.id === 2
                            ? "feed-style"
                            : "data-centric"
                        )}
                        {activeVariation === variation.id && (
                          <Badge className="ml-2 text-xs bg-accent text-accent-foreground">
                            {t("active")}
                          </Badge>
                        )}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <ActiveComponent onNavigate={handleNavigation} />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNavigationWithRouter
        currentPage={currentPage}
        onNavigate={handleNavigation}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAskSathi={() => setIsAskSathiOpen(true)}
        isChatOpen={isChatOpen}
        setIsChatOpen={setIsChatOpen}
      />
      <WeatherHeader />

      <main className="min-h-screen">{renderCurrentPage()}</main>

      <AIChatAssistant
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
      />

      <AskSathiChat
        isOpen={isAskSathiOpen}
        onClose={() => setIsAskSathiOpen(false)}
      />

      <NotificationBell />

      <footer className="bg-white border-t border-gray-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-600">{t("copyright-text")}</p>
          <p className="text-sm text-gray-500 mt-2">{t("tagline")}</p>
        </div>
      </footer>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Top navigation
// ─────────────────────────────────────────────────────────────────────────────
function TopNavigationWithRouter({
  currentPage,
  onNavigate,
  currentUser,
  onLogout,
  onOpenAskSathi,
  isChatOpen,
  setIsChatOpen,
}: {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  currentUser?: ApiUser | null;
  onLogout: () => void;
  onOpenAskSathi: () => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
}) {
  const { language, setLanguage, t } = useLanguage();

  const getLanguageDisplay = (lang: Language) => {
    switch (lang) {
      case "hi":
        return "हिंदी (Hindi)";
      case "en":
        return "English";
      case "mr":
        return "मराठी (Marathi)";
      case "pa":
        return "ਪੰਜਾਬੀ (Punjabi)";
      default:
        return "हिंदी (Hindi)";
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => onNavigate("dashboard")}
        >
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white font-bold">फ</span>
          </div>
          <span
            className="text-xl font-semibold text-primary"
            style={{ fontFamily: "Poppins" }}
          >
            FasalSaathi
          </span>
        </div>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className={
              currentPage === "dashboard" ? "text-primary bg-primary/10" : ""
            }
            onClick={() => onNavigate("dashboard")}
          >
            <LayoutDashboard className="w-4 h-4 mr-2" />
            {t("dashboard")}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={
              currentPage === "my-farm" ? "text-primary bg-primary/10" : ""
            }
            onClick={() => onNavigate("my-farm")}
          >
            <MapPin className="w-4 h-4 mr-2" />
            {t("my-farm")}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={
              currentPage === "calendar" ? "text-primary bg-primary/10" : ""
            }
            onClick={() => onNavigate("calendar")}
          >
            <Calendar className="w-4 h-4 mr-2" />
            {t("calendar")}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                {t("more")}
                <TrendingUp className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onNavigate("market")}>
                <TrendingUp className="w-4 h-4 mr-2" />
                {t("market-prices")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onNavigate("crop-recommendations")}
              >
                <Leaf className="w-4 h-4 mr-2" />
                {t("crop-recommendations")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNavigate("inventory")}>
                <Package className="w-4 h-4 mr-2" />
                {t("inventory")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNavigate("plant-analysis")}>
                <Target className="w-4 h-4 mr-2" />
                {t("plant-analysis")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNavigate("yield-prediction")}>
                <Target className="w-4 h-4 mr-2" />
                {t("yield-prediction")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNavigate("breed-analysis")}>
                <Target className="w-4 h-4 mr-2" />
                {t("breed-analysis")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="sm"
            className="bg-accent/20 hover:bg-accent/30 text-primary font-medium"
            onClick={onOpenAskSathi}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            {t("ask-saathi")}
          </Button>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Languages className="w-4 h-4 mr-2" />
                {getLanguageDisplay(language)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setLanguage("hi")}>
                🇮🇳 हिंदी (Hindi)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("en")}>
                🇺🇸 English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("mr")}>
                🇮🇳 मराठी (Marathi)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("pa")}>
                🇮🇳 ਪੰਜਾਬੀ (Punjabi)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="w-8 h-8 cursor-pointer">
                <AvatarFallback className="bg-primary text-white">
                  {currentUser?.full_name?.[0]?.toUpperCase() || "R"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2" />
                {currentUser?.full_name || t("profile")}
              </DropdownMenuItem>
              <DropdownMenuItem>{t("settings")}</DropdownMenuItem>
              <DropdownMenuItem onClick={onLogout}>
                {t("logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}