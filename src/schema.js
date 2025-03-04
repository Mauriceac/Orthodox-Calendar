import { SchemaType } from "@google/generative-ai";

const schema = {
  type: SchemaType.OBJECT,
  properties: {
      day: { type: SchemaType.NUMBER },
      month: { type: SchemaType.NUMBER },
      year: { type: SchemaType.NUMBER },
      weekday: { type: SchemaType.NUMBER },
      titles: {
        type: SchemaType.ARRAY,
        items: { type: SchemaType.STRING }
      },
      feasts: {
        type: SchemaType.ARRAY,
        items: { type: SchemaType.STRING }
      },
      fast_level_desc: { type: SchemaType.STRING },
      fast_exception_desc: { type: SchemaType.STRING },
      summary_title: { type: SchemaType.STRING },
      saints: {
        type: SchemaType.ARRAY,
        items: { type: SchemaType.STRING }
      },
      readings: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            source: { type: SchemaType.STRING },
            book: { type: SchemaType.STRING },
            description: { type: SchemaType.STRING },
            display: { type: SchemaType.STRING },
            short_display: { type: SchemaType.STRING },
            passage: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  book: { type: SchemaType.STRING },
                  chapter: { type: SchemaType.NUMBER },
                  verse: { type: SchemaType.NUMBER },
                  // content: { type: SchemaType.STRING },
                  paragraph_start: { type: SchemaType.BOOLEAN }
                },
                required: ["book", "chapter", "verse", "paragraph_start"]
              }
            }
          },
          required: ["source", "book", "description", "display", "short_display", "passage"]
        }
      },
      stories: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            title: { type: SchemaType.STRING },
            story: { type: SchemaType.STRING }
          },
          required: ["title", "story"]
        }
      }
    },
    required: ["day", "month", "year", "weekday", "titles", "fast_level_desc", "fast_exception_desc", "summary_title", "saints", "readings", "stories"]
  };

export default schema;