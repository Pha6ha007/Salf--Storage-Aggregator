"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Send, Loader2, Package, ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/api";

interface BoxRecommendation {
  recommended_size: string;
  reasoning: string;
  dimensions?: string;
  price_range?: string;
  tips?: string[];
}

const EXAMPLE_QUERIES = [
  "I need to store a sofa, 2 armchairs, a dining table with 4 chairs, and about 20 boxes",
  "Moving abroad for 6 months, need to store my bedroom furniture and personal items",
  "Just need to store some seasonal clothing, sports equipment and a bicycle",
];

const SIZE_INFO: Record<string, { label: string; sqm: string; example: string }> = {
  XS: { label: "Extra Small", sqm: "1–2 m²", example: "A few boxes, suitcases" },
  S: { label: "Small", sqm: "2–4 m²", example: "Studio apartment contents" },
  M: { label: "Medium", sqm: "5–10 m²", example: "1–2 bedroom apartment" },
  L: { label: "Large", sqm: "10–20 m²", example: "3+ bedroom apartment" },
  XL: { label: "Extra Large", sqm: "20+ m²", example: "Villa or commercial use" },
};

export default function BoxFinderPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<BoxRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await api.post<BoxRecommendation>("/ai/box-recommendation", {
        description: query,
      });
      setResult(response.data);
    } catch {
      setError("Unable to get AI recommendation. Please try again or contact support.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-amber-500 to-orange-600 text-white py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Powered by AI</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">AI Box Finder</h1>
            <p className="text-xl text-amber-100">
              Tell us what you need to store and we&apos;ll recommend the perfect storage size
            </p>
          </div>
        </section>

        {/* Tool */}
        <section className="py-16 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Describe what you need to store
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Be as specific as possible — include furniture, boxes, appliances, etc.
              </p>

              <Textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. I need to store a queen bed, wardrobe, sofa, TV unit, and about 30 boxes of personal items..."
                className="min-h-[120px] mb-4 resize-none"
              />

              {/* Example queries */}
              <div className="mb-6">
                <p className="text-xs text-gray-400 mb-2">Try an example:</p>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLE_QUERIES.map((eq) => (
                    <button
                      key={eq}
                      onClick={() => setQuery(eq)}
                      className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-full transition-colors text-left"
                    >
                      {eq.slice(0, 50)}…
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={loading || !query.trim()}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Get Recommendation
                  </>
                )}
              </Button>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Result */}
            {result && (
              <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Recommended Size</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {result.recommended_size
                        ? SIZE_INFO[result.recommended_size]?.label || result.recommended_size
                        : "Medium"}
                    </p>
                  </div>
                </div>

                {result.recommended_size && SIZE_INFO[result.recommended_size] && (
                  <div className="bg-white/60 rounded-xl p-4 mb-4 text-sm text-gray-600">
                    <p><span className="font-medium">Size:</span> {SIZE_INFO[result.recommended_size].sqm}</p>
                    <p><span className="font-medium">Typical use:</span> {SIZE_INFO[result.recommended_size].example}</p>
                    {result.price_range && (
                      <p><span className="font-medium">Price range:</span> {result.price_range}</p>
                    )}
                  </div>
                )}

                <p className="text-gray-700 leading-relaxed mb-4">{result.reasoning}</p>

                {result.tips && result.tips.length > 0 && (
                  <div className="mt-4">
                    <p className="font-medium text-gray-800 mb-2 text-sm">Storage Tips:</p>
                    <ul className="space-y-1">
                      {result.tips.map((tip, i) => (
                        <li key={i} className="text-sm text-gray-600 flex gap-2">
                          <span className="text-amber-500">•</span> {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-blue-200">
                  <Link
                    href={`/catalog?size=${result.recommended_size || "M"}`}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Find Storage Units
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* How it works */}
        <section className="bg-gray-50 py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-10">How It Works</h2>
            <div className="grid sm:grid-cols-3 gap-8">
              {[
                { step: "1", title: "Describe your items", desc: "Tell us what furniture, boxes, and belongings you need to store" },
                { step: "2", title: "AI analyzes", desc: "Our AI calculates the total volume and recommends the ideal unit size" },
                { step: "3", title: "Find & book", desc: "Browse storage facilities in UAE with your recommended size" },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-12 h-12 bg-amber-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
