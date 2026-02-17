import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { articleId } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Fetch the article
    const { data: article, error: fetchErr } = await supabase
      .from("articles")
      .select("*")
      .eq("id", articleId)
      .single();
    if (fetchErr || !article) throw new Error("Article not found");

    // Ask AI to moderate
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
            content: `You are a news content moderator. Analyze the article and decide if it should be approved for publication. 
Approve if: it's a legitimate news article, well-written, not spam, not hateful/violent content.
Reject if: it's spam, gibberish, hate speech, explicit content, or not a real news article.
Respond with ONLY a JSON object: {"approved": true/false, "reason": "brief reason"}`
          },
          {
            role: "user",
            content: `Title: ${article.title}\nExcerpt: ${article.excerpt}\nContent: ${article.content}`
          }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded, try again later" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error");
    }

    const aiData = await response.json();
    const aiText = aiData.choices?.[0]?.message?.content || "";
    
    let approved = false;
    let reason = "Could not determine";
    try {
      const parsed = JSON.parse(aiText.replace(/```json\n?/g, "").replace(/```/g, "").trim());
      approved = parsed.approved === true;
      reason = parsed.reason || reason;
    } catch {
      // If AI response isn't valid JSON, default to approved for legitimate-looking content
      approved = article.title.length > 5 && article.content.length > 20;
      reason = "Auto-approved based on content length";
    }

    // Update article approval status
    const { error: updateErr } = await supabase
      .from("articles")
      .update({ is_approved: approved, is_published: approved })
      .eq("id", articleId);
    if (updateErr) throw updateErr;

    return new Response(JSON.stringify({ approved, reason }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-moderate error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
