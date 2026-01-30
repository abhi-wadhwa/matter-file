# ChatGPT Research Prompt for Matter File

Copy and paste this prompt into ChatGPT (with Research/Browse enabled) to generate debate-ready content.

---

## The Prompt

```
I'm building a debate matter file (like a research brief for competitive debate). Please research [TOPIC] and provide a comprehensive overview suitable for BP/WUDC-style debate.

Format your response EXACTLY like this markdown template:

## [Topic Name]

#### TL;DR
[2-3 sentence summary of the core debate. What's the key tension?]

### For [Position A]

- **[Argument 1 - bold claim].** [2-3 sentences of explanation with evidence]
  - [Sub-point or qualification]
  - [Specific example if relevant]

- **[Argument 2 - bold claim].** [Explanation with evidence]

- **[Argument 3 - bold claim].** [Explanation with evidence]

### Against [Position A] / For [Position B]

- **[Counter-argument 1 - bold claim].** [Explanation with evidence]
  - [Sub-point]

- **[Counter-argument 2 - bold claim].** [Explanation]

### Key Statistics

- [Stat 1 with year and source]
- [Stat 2 with year and source]
- [Stat 3 with year and source]

### Case Studies

- **[Example 1]:** [What happened, when, and why it matters]
- **[Example 2]:** [Brief description]

### Sources
- [Source 1]
- [Source 2]
- [Source 3]

---

IMPORTANT GUIDELINES:
1. Focus on ARGUMENTS, not just facts. Each bullet should be something a debater could say.
2. Include BOTH sides - I need to be able to argue either position.
3. Prioritize RECENT data (last 2-3 years) but include foundational/historical context.
4. Include specific NUMBERS and EXAMPLES - vague claims are useless in debate.
5. Keep each argument CONCISE - 2-3 sentences max per point.
6. Use the EXACT formatting above so I can copy-paste into my system.

The topic to research is: [PASTE YOUR TOPIC HERE]
```

---

## Example Topics to Research

Here are example prompts you can modify:

### Economic Topics
- "The 2024 Argentina peso crisis and Milei's dollarization proposal"
- "Central bank digital currencies (CBDCs) - benefits and risks"
- "The impact of US interest rate hikes on emerging markets in 2023-2024"

### International Relations
- "BRICS expansion in 2024 - implications for global governance"
- "The EU's Critical Raw Materials Act and supply chain reshoring"
- "India-China border tensions and their impact on the Quad"

### Social Policy
- "Universal Basic Income pilots - results from recent experiments"
- "The effectiveness of carbon taxes vs cap-and-trade"
- "Gig economy regulation - the California AB5 model"

---

## After ChatGPT Responds

1. **Copy the markdown output** from ChatGPT
2. **Save it** to a file like `research-output.md` in your matter file repo
3. **Tell Claude Code:**
   ```
   "Add the content from research-output.md to the [section-name] section. 
   Clean up any formatting issues and ensure it matches the style of existing topics."
   ```

---

## Tips for Better Results

1. **Be specific about the timeframe:**
   - "Research the 2023-2024 developments in..." gets better results than just asking about a topic

2. **Ask for regional perspectives:**
   - "Include perspectives from both developed and developing countries"

3. **Request debate framing:**
   - "Frame this as arguments that could be used in a motion like 'THW [policy]'"

4. **Follow up for depth:**
   - "Give me 3 more arguments for the opposition side"
   - "What are the strongest empirical rebuttals to the pro side?"

5. **Fact-check key claims:**
   - Ask ChatGPT to verify specific statistics
   - Cross-reference with Google Scholar for academic sources
