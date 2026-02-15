import { useAllArticles } from "@/hooks/useArticles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { FileText, Eye, TrendingUp, Languages, Loader2 } from "lucide-react";

const COLORS = ["hsl(224,76%,33%)", "hsl(0,84%,60%)", "hsl(142,76%,36%)", "hsl(38,92%,50%)", "hsl(280,65%,60%)", "hsl(190,80%,45%)", "hsl(30,90%,50%)"];

export function AdminAnalytics() {
  const { data: articles, isLoading } = useAllArticles();

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const all = articles || [];
  const totalViews = all.reduce((s, a) => s + a.views, 0);
  const totalLikes = all.reduce((s, a) => s + a.likes, 0);
  const enCount = all.filter((a) => a.language === "en").length;
  const hiCount = all.filter((a) => a.language === "hi").length;

  // Category data
  const catMap: Record<string, { views: number; count: number }> = {};
  all.forEach((a) => {
    if (!catMap[a.category]) catMap[a.category] = { views: 0, count: 0 };
    catMap[a.category].views += a.views;
    catMap[a.category].count += 1;
  });
  const categoryData = Object.entries(catMap).map(([name, { views, count }]) => ({ name, views, count }));
  const pieData = categoryData.map((c) => ({ name: c.name, value: c.count }));

  // Top articles by views
  const topArticles = [...all].sort((a, b) => b.views - a.views).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10"><FileText className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-2xl font-bold font-headline">{all.length}</p>
              <p className="text-xs text-muted-foreground">Total Articles</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10"><Eye className="h-5 w-5 text-accent" /></div>
            <div>
              <p className="text-2xl font-bold font-headline">{totalViews.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Views</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10"><TrendingUp className="h-5 w-5 text-success" /></div>
            <div>
              <p className="text-2xl font-bold font-headline">{totalLikes.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Likes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10"><Languages className="h-5 w-5 text-warning" /></div>
            <div>
              <p className="text-2xl font-bold font-headline">{enCount} / {hiCount}</p>
              <p className="text-xs text-muted-foreground">EN / HI Articles</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="font-headline text-lg">Views by Category</CardTitle></CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                  <YAxis tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                  <Tooltip />
                  <Bar dataKey="views" fill="hsl(224,76%,33%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground py-8">No data yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="font-headline text-lg">Articles by Category</CardTitle></CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, value }) => `${name} (${value})`}>
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground py-8">No data yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Articles Table */}
      {topArticles.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="font-headline text-lg">Top Articles by Views</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topArticles.map((a, i) => (
                <div key={a.id} className="flex items-center gap-3">
                  <span className="font-headline text-lg font-bold text-muted-foreground/40 w-6">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{a.title}</p>
                    <p className="text-xs text-muted-foreground">{a.category} · {a.author}</p>
                  </div>
                  <span className="text-sm font-medium flex items-center gap-1">
                    <Eye className="h-3 w-3" /> {a.views.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
