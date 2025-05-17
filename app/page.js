import Stream from "@/components/search/stream";
import DeepSearch from "@/components/search/deep-search";
import ChatInterface from "@/components/search/interface/ChatInterface";
import WelcomeScreen from "@/components/search/interface/WelcomeScreen";
import ProfilePage from "@/components/profile/profile-page";
import Artifact from "@/components/search/artifact";
import "@/components/search/styles/artifact.css";

export const metadata = {
    title: "circl",
    description: "Welcome Screen",
};

export default function Home() {
    // return (
    //     <div className="page-container">
    //         <UserArtifact />
    //     </div>
    // );
    return <WelcomeScreen />;
}
