
import BackgroundPaths from "../components/Home/BackgroudPath"
import StatsSection from "../components/Home/StatsSection/StatsSection"
import LLMShowcase from "../components/Home/LLMShowcase/LLMShowcase"
import Footer from "../components/Home/Footer/Footer"


export default function App() {
  return (
    <div
      style={{
        backgroundColor: "#121212",
        color: "#fff",
        minHeight: "100vh",
        transition: "all 0.3s ease",
      }}
    >
      <BackgroundPaths title="Sera AI" darkMode={true} />
      <StatsSection />
      <LLMShowcase />
      <Footer />
    </div>
  );
}
