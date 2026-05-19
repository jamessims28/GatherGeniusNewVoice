
import { getSupabaseAdmin } from "../supabaseAdmin";
import { getLivePricing } from "../pricing/livePricingEngine";

export async function getConversationMemorySource({ userKey = "anonymous_preview" } = {}) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { id: "memory", name: "Conversation Memory", available: false, items: [], note: "Supabase not connected." };
  }

  const { data, error } = await supabase
    .from("conversation_memory")
    .select("*")
    .eq("user_key", userKey)
    .order("created_at", { ascending: false })
    .limit(8);

  return {
    id: "memory",
    name: "Conversation Memory",
    available: !error,
    items: data || [],
    note: error?.message || "Recent conversation memory loaded."
  };
}

export async function getExperienceHistorySource({ userKey = "anonymous_preview" } = {}) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { id: "experience_history", name: "Experience History", available: false, items: [], note: "Supabase not connected." };
  }

  const { data, error } = await supabase
    .from("event_locks")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(8);

  return {
    id: "experience_history",
    name: "Experience History",
    available: !error,
    items: data || [],
    note: error?.message || "Recent experience locks loaded."
  };
}

export async function getPricingSource({ query = "" } = {}) {
  try {
    const result = await getLivePricing(query);
    return {
      id: "live_pricing",
      name: "Live Pricing",
      available: true,
      items: [result],
      note: result?.pricing?.note || "Pricing intelligence loaded."
    };
  } catch (error) {
    return {
      id: "live_pricing",
      name: "Live Pricing",
      available: false,
      items: [],
      note: error.message
    };
  }
}

export async function getProviderSource({ location = "Virginia" } = {}) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { id: "providers", name: "Provider Intelligence", available: false, items: [], note: "Supabase not connected." };
  }

  const { data, error } = await supabase
    .from("vendor_performance")
    .select("*")
    .order("placement_score", { ascending: false })
    .limit(10);

  return {
    id: "providers",
    name: "Provider Intelligence",
    available: !error,
    items: data || [],
    note: error?.message || "Provider performance loaded."
  };
}

export async function getWebSearchSource({ query = "" } = {}) {
  if (!process.env.BRAVE_SEARCH_API_KEY && !process.env.SERPAPI_API_KEY) {
    return {
      id: "web_search",
      name: "External Search",
      available: false,
      items: [],
      note: "No web search API key configured."
    };
  }

  try {
    if (process.env.BRAVE_SEARCH_API_KEY) {
      const url = new URL("https://api.search.brave.com/res/v1/web/search");
      url.searchParams.set("q", query);
      url.searchParams.set("count", "5");

      const response = await fetch(url.toString(), {
        headers: {
          "Accept": "application/json",
          "X-Subscription-Token": process.env.BRAVE_SEARCH_API_KEY
        }
      });

      const data = await response.json();
      return {
        id: "web_search",
        name: "External Search",
        available: response.ok,
        items: data?.web?.results || [],
        note: response.ok ? "Brave Search results loaded." : "Brave Search failed."
      };
    }

    const serpUrl = new URL("https://serpapi.com/search.json");
    serpUrl.searchParams.set("engine", "google");
    serpUrl.searchParams.set("q", query);
    serpUrl.searchParams.set("api_key", process.env.SERPAPI_API_KEY);

    const response = await fetch(serpUrl.toString());
    const data = await response.json();

    return {
      id: "web_search",
      name: "External Search",
      available: response.ok,
      items: data?.organic_results || [],
      note: response.ok ? "SerpAPI results loaded." : "SerpAPI failed."
    };
  } catch (error) {
    return {
      id: "web_search",
      name: "External Search",
      available: false,
      items: [],
      note: error.message
    };
  }
}
