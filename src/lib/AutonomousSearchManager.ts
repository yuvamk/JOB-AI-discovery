import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildScraperTasks, RawJob } from "./jobScraper";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface SearchStrategy {
  waveNumber: number;
  tasks: {
    platform: string;
    keywords: string;
    description: string;
  }[];
  reasoning: string;
}

export class AutonomousSearchManager {
  private role: string;
  private location: string;
  private onProgress?: (msg: string) => void;

  constructor(role: string, location: string, onProgress?: (msg: string) => void) {
    this.role = role;
    this.location = location;
    this.onProgress = onProgress;
  }

  /**
   * Plans a search strategy using Gemini
   */
  async planStrategy(wave: number, previousResultsSummary?: string): Promise<SearchStrategy> {
    this.onProgress?.(`Planning search strategy for Wave ${wave}...`);
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = `
      You are the ECC Loop Operator & Job Discovery Strategist. 
      Your mission is "Deep Discovery": Find company career pages and "hidden" roles, not just job board aggregators.

      ## Context
      Target Role: "${this.role}"
      Target Location: "${this.location}"
      Current Search Wave: ${wave}
      ${previousResultsSummary ? `Previous Outcomes Summary: ${previousResultsSummary}` : "This is the first wave. Start broad but targeted."}

      ## Planning Methodology (ECC Deep Research Pattern)
      1. **Analysis**: Briefly identify 3 unique "angles" for this role (e.g., specific tech stack pairings, niche industry domains, or company sizes).
      2. **Sub-Questions**: What are the 3-5 specific "where to look" questions you need to answer this wave?
      3. **Platform Selection**: Map these questions to the most effective platforms.

      ## Constraints & Rules
      - **GOOGLE SEARCH**: Do NOT use "site:linkedin.com" etc. Aim for company domains (e.g., "AI startups hiring [Role] in [Location]").
      - **VARIETY**: Use a mix of aggregator platforms (remotive, remoteok) and discovery-heavy platforms (google, hn, themuse).
      - **NO DUPLICATES**: Avoid repeating exact keyword/platform pairs from previous waves.

      ## Output Format
      Return ONLY a valid JSON object:
      {
        "waveNumber": ${wave},
        "tasks": [
          { "platform": "platform_id", "keywords": "precise discovery keywords", "description": "strategic reasoning for this task" }
        ],
        "reasoning": "Overall strategy for this wave based on your analysis."
      }
    `;

    try {
      const result = await model.generateContent(prompt);
      let text = result.response.text().trim();
      
      console.log("DEBUG: AI Strategy Response received. Parsing...");
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON object found");
      
      let cleanJson = jsonMatch[0]
        .replace(/,\s*([\]\}])/g, '$1') // Remove trailing commas before ] or }
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // Remove control characters
        .trim();

      return JSON.parse(cleanJson);
    } catch (err) {
      console.error("Strategy Planning Error:", err);
      // Fallback strategy if AI fails
      return {
        waveNumber: wave,
        tasks: [
          { platform: "google", keywords: `${this.role} ${this.location}`, description: "Basic search fallback" },
          { platform: "remoteok", keywords: this.role, description: "Niche fallback" }
        ],
        reasoning: "Fallback strategy due to AI planning error."
      };
    }
  }

  /**
   * Executes a wave of search tasks
   */
  async executeWave(strategy: SearchStrategy): Promise<RawJob[]> {
    this.onProgress?.(`🚀 Beginning Wave ${strategy.waveNumber}: ${strategy.reasoning}`);
    
    const allJobs: RawJob[] = [];
    
    for (const task of strategy.tasks) {
      this.onProgress?.(`📡 Task: [${task.platform}] searching for "${task.keywords}"...`);
      try {
        const scraperTasks = buildScraperTasks(task.keywords, this.location, [task.platform], (m) => this.onProgress?.(`  [${task.platform}] ${m}`));
        const results = await Promise.allSettled(scraperTasks.map(t => t.fn()));
        
        for (const res of results) {
          if (res.status === "fulfilled") {
            allJobs.push(...res.value);
          }
        }
      } catch (err) {
        this.onProgress?.(`⚠️ Task [${task.platform}] failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }
    
    return allJobs;
  }
}
