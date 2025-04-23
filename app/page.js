import Stream from "@/components/search/stream";
import DeepSearch from "@/components/search/deep-search";
import ChatInterface from "@/components/search/interface/ChatInterface";
import ProfilePage from "@/components/profile/profile-page";
import Artifact from "@/components/search/artifact";
import "@/components/search/styles/artifact.css";

export default function Home() {
    // return (
    //     <div className="page-container">
    //         <UserArtifact />
    //     </div>
    // );
    return <ChatInterface />;
}
