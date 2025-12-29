
import { GoogleGenAI, Type } from "@google/genai";
import { ProcessingResult, ExtractedElement } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are an expert in the Python library "DrissionPage" and HTML parsing.
Your task is to act as a DrissionPage selector engine.
The user will provide a block of HTML and a "Locator" string following DrissionPage syntax.

DrissionPage Locator Rules:
1. Property locator: '@name=value' (e.g., '@id=header', '@class=main-btn').
2. Tag name: 'tag:name' (e.g., 'tag:div', 'tag:p').
3. Text search: 'text:content' or just 'content'.
4. CSS Selector: 'css:.my-class'.
5. XPath: 'xpath://div'.
6. Property only: '@id' (finds any element with an id).
7. Combined: 'tag:div@class=container'.

You must parse the provided HTML and find ALL elements matching the locator.
Return the results in a strict JSON format matching the schema provided.
For 'attributes', provide an array of objects, each containing a 'name' and a 'value' key.
Include the tag name, outer HTML, inner text, and attributes for each found element.
`;

export const processSelector = async (html: string, selector: string): Promise<ProcessingResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `HTML Content:
${html}

Locator:
${selector}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            elements: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  tag: { type: Type.STRING },
                  text: { type: Type.STRING },
                  attributes: { 
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        value: { type: Type.STRING }
                      },
                      required: ["name", "value"]
                    }
                  },
                  html: { type: Type.STRING }
                },
                required: ["tag", "text", "attributes", "html"]
              }
            },
            count: { type: Type.NUMBER },
            selectorUsed: { type: Type.STRING }
          },
          required: ["elements", "count", "selectorUsed"]
        }
      }
    });

    const rawResult = JSON.parse(response.text || "{}");
    
    // Transform the array of attributes back into a Record for the application
    const elements: ExtractedElement[] = (rawResult.elements || []).map((el: any) => ({
      ...el,
      attributes: (el.attributes || []).reduce((acc: Record<string, string>, curr: { name: string, value: string }) => {
        acc[curr.name] = curr.value;
        return acc;
      }, {})
    }));

    return {
      elements,
      count: rawResult.count || elements.length,
      selectorUsed: rawResult.selectorUsed || selector
    };
  } catch (error) {
    console.error("Error processing selector:", error);
    return {
      elements: [],
      count: 0,
      selectorUsed: selector,
      error: "Failed to process the selector with AI engine."
    };
  }
};

export const fetchUrlSimulated = async (url: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a realistic HTML structure representing the webpage at: ${url}. 
      Make sure it has varied tags (div, a, span, p, h1, buttons), classes, and ids so I can test DrissionPage selectors. 
      Include a header, main content area, and a footer.`,
      config: {
        systemInstruction: "Return ONLY raw HTML. No markdown, no code blocks.",
      }
    });

    return response.text || "<html><body>No content generated.</body></html>";
  } catch (error) {
    return "<html><body>Error fetching page via AI simulation. Please paste HTML manually.</body></html>";
  }
};
