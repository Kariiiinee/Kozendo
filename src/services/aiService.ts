export interface ScanData {
    body: string;
    heart: string;
    environment: string;
    breathAction: string;
    reflection: string;
    vibe: string | null;
}

export interface AIInsight {
    mainInsight: string;
    microActions: { id: number; text: string; instruction: string; icon: string }[];
    upliftingQuote: string;
    debugError?: string; // For troubleshooting connection issues
    recommendedActivity?: {
        title: string;
        duration: string;
        image: string;
    };
}

export const generateAIInsights = async (data: ScanData): Promise<AIInsight> => {
    try {
        // Attempt to call the real AI API proxy
        const response = await fetch('/api/generate-insights', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            return await response.json();
        }

        const errorData = await response.json().catch(() => ({}));
        console.error('AI API Error Details:', {
            status: response.status,
            statusText: response.statusText,
            data: errorData
        });

        // If response is not ok (e.g., 404, 500), throw to trigger fallback
        throw new Error(`API error ${response.status}: ${errorData.details || response.statusText}`);
    } catch (error: any) {
        console.error('AI Service Connection Issue:', error);

        const isLocalhost = window.location.hostname === 'localhost';
        const debugMsg = isLocalhost
            ? "Running on localhost: Vite dev server does not support /api serverless functions. Use 'vercel dev'."
            : (error.message || "Unknown connection error");

        // LOCAL SIMULATION FALLBACK (Existing Logic)
        await new Promise(resolve => setTimeout(resolve, 2000));

        const bodyLower = data.body.toLowerCase();
        const heartLower = data.heart.toLowerCase();
        const envLower = data.environment.toLowerCase();

        let mainInsight = "It sounds like you're taking a meaningful moment for self-reflection. Your awareness is the first step toward balance.";
        let upliftingQuote = "Peace comes from within. Do not seek it without. — Buddha"; // ZEN Theme

        let microActions = [
            { id: 1, text: "Unclench Check (30 sec)", instruction: "Relax jaw · shoulders · hands · belly. Releases stored tension.", icon: "accessibility_new" },
            { id: 2, text: "Hydration Pause (1 min)", instruction: "Drink water slowly and fully. Dehydration mimics fatigue.", icon: "water_drop" },
            { id: 3, text: "Extended Exhale Breathing (1–2 min)", instruction: "Inhale 4 · Exhale 6–8. Signals safety to the nervous system.", icon: "air" }
        ];

        // Logic based on Vibe
        if (data.vibe === 'Stressed / Frustrated') {
            mainInsight = "I notice you're feeling a bit pressured. Remember that it's okay to slow down; your productivity isn't your worth.";
            upliftingQuote = "You have power over your mind — not outside events. — Marcus Aurelius"; // CALM Theme
            microActions = [
                { id: 1, text: "Physiological Sigh (1 min)", instruction: "Two short inhales · long exhale. Rapid calming effect.", icon: "air" },
                { id: 2, text: "Gentle Neck Roll (1 min)", instruction: "Slow, pain-free circles. Relieves stress accumulation.", icon: "accessibility_new" },
                { id: 3, text: "Lower the Pace (1 min)", instruction: "Intentionally slow your next movement. Your brain follows your body.", icon: "accessibility_new" }
            ];
        } else if (data.vibe === 'Sad / Low') {
            mainInsight = "It's completely valid to feel heavy right now. Be gentle with yourself—you don't have to 'fix' everything today.";
            upliftingQuote = "Every moment is a fresh beginning. — T.S. Eliot"; // ZEN Theme
            microActions = [
                { id: 1, text: "Label the Feeling (30 sec)", instruction: "“Right now, I feel ___, and I’m okay.” Reduces emotional intensity.", icon: "accessibility_new" },
                { id: 2, text: "Light Exposure Reset (2 min)", instruction: "Step outside or near a window. Signals wakefulness to the brain.", icon: "water_drop" },
                { id: 3, text: "Warm Sensation (2 min)", instruction: "Hold a warm mug or place hands on chest. Activates calming pathways.", icon: "accessibility_new" }
            ];
        } else if (data.vibe === 'Calm / Peaceful') {
            mainInsight = "It's wonderful that you're in a space of ease. Take a moment to anchor this feeling so you can return to it later.";
            upliftingQuote = "Silence is a source of great strength. — Lao Tzu"; // ZEN Theme
            microActions = [
                { id: 1, text: "Unclench Check (30 sec)", instruction: "Relax jaw · shoulders · hands · belly. Releases stored tension.", icon: "accessibility_new" },
                { id: 2, text: "Music Micro-Boost (2 min)", instruction: "Play one uplifting song. Elevates mood and momentum.", icon: "water_drop" },
                { id: 3, text: "Same Last Action Nightly (30 sec)", instruction: "Same song, scent, or phrase. Trains the brain for sleep.", icon: "air" }
            ];
        }

        // Keyword Matching - Motivation / Tired
        if (bodyLower.includes('tired') || bodyLower.includes('exhausted')) {
            upliftingQuote = "Believe you can and you’re halfway there. — Theodore Roosevelt"; // MOTIVATION Theme
            microActions[1] = { id: 2, text: "Cold Water Splash (30 sec)", instruction: "Face or wrists with cool water. Quick alertness boost.", icon: "water_drop" };
        }

        if (heartLower.includes('lazy') || heartLower.includes('stuck') || bodyLower.includes('lazy')) {
            upliftingQuote = "Act as if what you do makes a difference. It does. — William James"; // MOTIVATION Theme
            microActions[0] = { id: 1, text: "Define Tiny Step (30 sec)", instruction: "Make it almost too easy. Lowers resistance.", icon: "accessibility_new" };
            microActions[2] = { id: 3, text: "2-Minute Rule", instruction: "Start for just two minutes. Momentum often follows.", icon: "air" };
        }

        return {
            mainInsight,
            microActions: microActions.slice(0, 3),
            upliftingQuote,
            debugError: debugMsg
        };
    }
};
