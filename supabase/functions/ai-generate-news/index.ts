import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { topic, category, language } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const lang = language === "hi" ? "Hindi" : "English";

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a professional news journalist. Generate a realistic, well-written news article in ${lang}. 
Respond with ONLY a JSON object with these fields:
{
  "title": "headline",
  "excerpt": "2-3 line summary",
  "content": "full article (300-500 words)",
  "author": "journalist name",
  "read_time": estimated_minutes_number
}`
          },
          {
            role: "user",
            content: `Write a ${category || "general"} news article about: ${topic || "latest trending news in India"}`
          }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error");
    }

    const aiData = await response.json();
    const aiText = aiData.choices?.[0]?.message?.content || "";

    let article;
    try {
      article = JSON.parse(aiText.replace(/```json\n?/g, "").replace(/```/g, "").trim());
    } catch {
      throw new Error("Failed to parse AI response");
    }

    // Save to database
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data, error } = await supabase
      .from("articles")
      .insert({
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        author: article.author || "AI Reporter",
        read_time: article.read_time || 3,
        category: category || "Technology",
        language: language || "en",
        is_published: true,
        is_approved: true,
        is_breaking: false,
        is_featured: false,
        submitted_by: "ai",
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify({ article: data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-generate-news error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
