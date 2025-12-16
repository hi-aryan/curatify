import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import lukasImg from "@/assets/lukas.jpg";
import aryanImg from "@/assets/aryan.jpeg";
import rafaelImg from "@/assets/rafael.JPG";

export function AboutView(props) {
    function navigateToHomeHandlerACB() {
        props.onNavigateToHome();
    }

    return (
        <div className="min-h-screen p-8 flex flex-col items-center justify-center">
            <Card className="w-full max-w-2xl border-light/40 bg-dark/40 backdrop-blur-md">
                <CardHeader className="text-center border-b border-light/10 pb-6">
                    <CardTitle className="text-3xl font-bold text-light">
                        About This App
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6 text-light/80 leading-relaxed">
                    <p>
                        Welcome to our Spotify-integrated music companion! This application leverages the power of
                        Spotify's Web API and Google's Gemini LLM to provide you with a personalized music experience.
                    </p>

                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-light">Key Features:</h3>
                        <ul className="list-disc list-inside space-y-1 ml-4 opacity-90">
                            <li>Explore your top tracks and artists</li>
                            <li>Analyze your music taste with AI</li>
                            <li>Get personalized song recommendations</li>
                            <li>Visualize your playlists with Moodboards</li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-light">The Team:</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { name: "Lukas", role: "Developer", desc: "Short description here.", image: lukasImg },
                                { name: "Aryan", role: "Developer", desc: "Short description here.", image: aryanImg },
                                { name: "Rafael", role: "Developer", desc: "Short description here.", image: rafaelImg }
                            ].map((member, i) => (
                                <div key={i} className="flex flex-col items-center text-center space-y-2 p-4 bg-light/5 rounded-lg">
                                    <div className="w-20 h-20 rounded-full bg-light/20 flex items-center justify-center overflow-hidden relative">
                                        {member.image ? (
                                            <Image src={member.image} alt={member.name} fill className="object-cover" />
                                        ) : (
                                            <span className="text-2xl">👤</span>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-light">{member.name}</h4>
                                        <p className="text-xs text-green">{member.role}</p>
                                    </div>
                                    <p className="text-sm opacity-80">{member.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="text-sm opacity-60 pt-4 border-t border-light/10">
                        Developed for DH2642 Interaction Programming and the Dynamic Web.
                    </p>

                    <div className="flex justify-center pt-4">
                        <Button
                            onClick={navigateToHomeHandlerACB}
                            className="bg-green hover:bg-green/80 text-dark font-semibold px-8 transition-transform hover:scale-105"
                        >
                            Back to Home
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
