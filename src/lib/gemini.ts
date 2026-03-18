import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generatePersonalizedEmail(businessName: string, category: string, city: string) {
    if (!process.env.GEMINI_API_KEY) {
        return null;
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
            You are the ECC Outreach Agent.
            Mission: High-Impact, Low-Friction communication for Yuvam Kumar (Lead at Kinetic).

            ## Context
            - Business: "${businessName}" (${category}) in ${city}
            - Problem: No professional web presence.

            ## Instructions (ECC "Brevity & IMPACT" Pattern)
            1. **Extreme Brevity**: Keep it under 100 words.
            2. **Direct Value**: Lead with the fact that they are losing local ${category} customers in ${city} to online competitors.
            3. **The Ask**: Propose a quick "no-pressure" intro chat.
            4. **No Fluff**: No "I hope you are well". Start with the point.
            
            ## Branding
            - Sign-off: Yuvam Kumar | 8650825573 | yuvamk6@gmail.com
            
            Return ONLY the body text. No subject, no markdown formatting.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini Generation Error:", error);
        return null;
    }
}
