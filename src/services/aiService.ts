export interface ScanData {
    body: string;
    heart: string;
    environment: string;
    breathAction: string;
    reflection: string;
    vibe: string | null;
    language: string;
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
        let retryCount = 0;
        const maxRetries = 2;
        let lastError: any = null;

        while (retryCount <= maxRetries) {
            try {
                const response = await fetch('/api/generate-insights', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });

                if (response.ok) {
                    return await response.json();
                }

                const errorData = await response.json().catch(() => ({}));
                const statusCode = response.status;

                // If it's a transient error (503, 429) and we have retries left
                if ((statusCode === 503 || statusCode === 429) && retryCount < maxRetries) {
                    retryCount++;
                    const delay = Math.pow(2, retryCount) * 1000;
                    console.warn(`AI Service Transient Error (${statusCode}). Retrying in ${delay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }

                throw new Error(`API error ${statusCode}: ${errorData.details || response.statusText}`);
            } catch (err: any) {
                lastError = err;
                if (retryCount >= maxRetries) throw err;
                retryCount++;
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        throw lastError;
    } catch (error: any) {
        console.error('AI Service Connection Issue:', error);

        const isLocalhost = window.location.hostname === 'localhost';
        const debugMsg = isLocalhost
            ? "Running on localhost: Vite dev server does not support /api serverless functions. Use 'vercel dev'."
            : (error.message || "Unknown connection error");

        const isFrench = data.language === 'fr';

        // LOCAL SIMULATION FALLBACK (Localize for EN and FR)
        await new Promise(resolve => setTimeout(resolve, 2000));

        const vibeMap: Record<string, { insight: { en: string; fr: string }; quote: { en: string; fr: string }; actions: { en: any[]; fr: any[] } }> = {
            'stressed': {
                insight: {
                    en: "I notice you're feeling a bit pressured. Remember that it's okay to slow down; your productivity isn't your worth.",
                    fr: "Je remarque que vous vous sentez un peu sous pression. Rappelez-vous qu'il est normal de ralentir ; votre productivité ne définit pas votre valeur."
                },
                quote: {
                    en: "You have power over your mind — not outside events. — Marcus Aurelius",
                    fr: "Vous avez un pouvoir sur votre esprit — pas sur les événements extérieurs. — Marc Aurèle"
                },
                actions: {
                    en: [
                        { id: 1, text: "Physiological Sigh (1 min)", instruction: "Two short inhales · long exhale. Rapid calming effect.", icon: "breath" },
                        { id: 2, text: "Gentle Neck Roll (1 min)", instruction: "Slow, pain-free circles. Relieves stress accumulation.", icon: "stretch" },
                        { id: 3, text: "Lower the Pace (1 min)", instruction: "Intentionally slow your next movement. Your brain follows your body.", icon: "stretch" }
                    ],
                    fr: [
                        { id: 1, text: "Soupir Physiologique (1 min)", instruction: "Deux inspirations courtes · une longue expiration. Effet calmant rapide.", icon: "breath" },
                        { id: 2, text: "Cercle de Nuque Doux (1 min)", instruction: "Cercles lents et sans douleur. Soulage l'accumulation de stress.", icon: "stretch" },
                        { id: 3, text: "Ralentir le Pas (1 min)", instruction: "Ralentissez intentionnellement votre prochain mouvement. Le cerveau suit le corps.", icon: "stretch" }
                    ]
                }
            },
            'sad': {
                insight: {
                    en: "It's completely valid to feel heavy right now. Be gentle with yourself—you don't have to 'fix' everything today.",
                    fr: "Il est tout à fait normal de se sentir lourd en ce moment. Soyez doux avec vous-même—vous n'avez pas à tout 'réparer' aujourd'hui."
                },
                quote: {
                    en: "Every moment is a fresh beginning. — T.S. Eliot",
                    fr: "Chaque moment est un nouveau départ. — T.S. Eliot"
                },
                actions: {
                    en: [
                        { id: 1, text: "Label the Feeling (30 sec)", instruction: "“Right now, I feel ___, and I’m okay.” Reduces emotional intensity.", icon: "pen" },
                        { id: 2, text: "Light Exposure Reset (2 min)", instruction: "Step outside or near a window. Signals wakefulness to the brain.", icon: "sun" },
                        { id: 3, text: "Warm Sensation (2 min)", instruction: "Hold a warm mug or place hands on chest. Activates calming pathways.", icon: "stretch" }
                    ],
                    fr: [
                        { id: 1, text: "Nommer le Sentiment (30 sec)", instruction: "« En ce moment, je me sens ___, et c'est okay. » Réduit l'intensité émotionnelle.", icon: "pen" },
                        { id: 2, text: "Réinitialisation par la Lumière (2 min)", instruction: "Sortez ou placez-vous près d'une fenêtre. Signale l'éveil au cerveau.", icon: "sun" },
                        { id: 3, text: "Sensation de Chaleur (2 min)", instruction: "Tenez une tasse chaude ou placez vos mains sur votre poitrine. Active les voies du calme.", icon: "stretch" }
                    ]
                }
            },
            'Default': {
                insight: {
                    en: "It sounds like you're taking a meaningful moment for self-reflection. Your awareness is the first step toward balance.",
                    fr: "On dirait que vous prenez un moment précieux pour l'autoréflexion. Votre conscience est le premier pas vers l'équilibre."
                },
                quote: {
                    en: "Peace comes from within. Do not seek it without. — Buddha",
                    fr: "La paix vient de l'intérieur. Ne la cherchez pas à l'extérieur. — Bouddha"
                },
                actions: {
                    en: [
                        { id: 1, text: "Unclench Check (30 sec)", instruction: "Relax jaw · shoulders · hands · belly. Releases stored tension.", icon: "stretch" },
                        { id: 2, text: "Hydration Pause (1 min)", instruction: "Drink water slowly and fully. Dehydration mimics fatigue.", icon: "water" },
                        { id: 3, text: "Extended Exhale Breathing (1–2 min)", instruction: "Inhale 4 · Exhale 6–8. Signals safety to the nervous system.", icon: "breath" }
                    ],
                    fr: [
                        { id: 1, text: "Vérification du Relâchement (30 sec)", instruction: "Détendez la mâchoire · les épaules · les mains · le ventre. Libère les tensions.", icon: "stretch" },
                        { id: 2, text: "Pause Hydratation (1 min)", instruction: "Buvez de l'eau lentement. La déshydratation imite la fatigue.", icon: "water" },
                        { id: 3, text: "Respiration Longue (1–2 min)", instruction: "Inspiration 4 · Expiration 6-8. Signale la sécurité au système nerveux.", icon: "breath" }
                    ]
                }
            }
        };

        const config = vibeMap[data.vibe as string] || vibeMap['Default'];
        const langKey = isFrench ? 'fr' : 'en';

        return {
            mainInsight: config.insight[langKey],
            microActions: config.actions[langKey].slice(0, 3),
            upliftingQuote: config.quote[langKey],
            debugError: debugMsg
        };
    }
};
