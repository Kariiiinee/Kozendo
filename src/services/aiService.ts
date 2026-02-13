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
    microActions: { id: number; text: string; icon: string }[];
    upliftingQuote: string;
    recommendedActivity: {
        title: string;
        duration: string;
        image: string;
    };
}

export const generateAIInsights = async (data: ScanData): Promise<AIInsight> => {
    // Simulate network delay for "AI thinking" feel
    await new Promise(resolve => setTimeout(resolve, 2000));

    const bodyLower = data.body.toLowerCase();
    const heartLower = data.heart.toLowerCase();
    const envLower = data.environment.toLowerCase();

    let mainInsight = "It sounds like you're taking a meaningful moment for self-reflection. Your awareness is the first step toward balance.";
    let microActions = [
        { id: 1, text: "Take a 5-minute stretch", icon: "accessibility_new" },
        { id: 2, text: "Drink a glass of water", icon: "water_drop" },
        { id: 3, text: "Deep breathing (3 reps)", icon: "air" }
    ];

    // Logic based on Vibe
    if (data.vibe === 'Stressed / Frustrated') {
        mainInsight = "I notice you're feeling a bit pressured. Remember that it's okay to slow down; your productivity isn't your worth.";
        microActions[2] = { id: 3, text: "Box breathing (4-4-4-4)", icon: "air" };
    } else if (data.vibe === 'Sad / Low') {
        mainInsight = "It's completely valid to feel heavy right now. Be gentle with yourself—you don't have to 'fix' everything today.";
        microActions[0] = { id: 1, text: "Step outside for fresh air", icon: "accessibility_new" };
    } else if (data.vibe === 'Calm / Peaceful') {
        mainInsight = "It's wonderful that you're in a space of ease. Take a moment to anchor this feeling so you can return to it later.";
    }

    // Keyword Matching - Body
    if (bodyLower.includes('head') || bodyLower.includes('neck') || bodyLower.includes('tension')) {
        mainInsight += " Focusing on releasing the tension in your upper body could provide immediate relief.";
        microActions.push({ id: 4, text: "Gentle neck rolls", icon: "accessibility_new" });
    } else if (bodyLower.includes('tired') || bodyLower.includes('exhausted') || bodyLower.includes('sleepy')) {
        mainInsight += " Your body is signaling a need for rest. Honor that signal today.";
        microActions[1] = { id: 2, text: "Power nap (15 mins)", icon: "water_drop" };
    }

    // Keyword Matching - Heart
    if (heartLower.includes('grateful') || heartLower.includes('happy')) {
        mainInsight += " Sharing this positive energy with someone else could amplify your own joy.";
    } else if (heartLower.includes('anxious') || heartLower.includes('worry')) {
        mainInsight += " When thoughts race, try to focus on one thing you can touch, see, and hear right now.";
    }

    // Keyword Matching - Environment
    if (envLower.includes('clutter') || envLower.includes('messy')) {
        microActions.push({ id: 5, text: "Clear your desk", icon: "accessibility_new" });
    } else if (envLower.includes('noisy') || envLower.includes('loud')) {
        microActions.push({ id: 6, text: "Put on noise-cancelling headphones", icon: "headset" });
    }

    return {
        mainInsight,
        microActions: microActions.slice(0, 3), // Keep it to top 3
        upliftingQuote: data.vibe === 'Stressed / Frustrated'
            ? "Pause. Breathe. You are more than your to-do list."
            : "Small steps lead to great journeys. You're doing enough.",
        recommendedActivity: {
            title: data.vibe === 'Stressed / Frustrated' ? "Stress Release Yoga" : "Gentle Morning Flow",
            duration: "15 min",
            image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800"
        }
    };
};
