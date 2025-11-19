
import { FormResponse, FormConfig } from '@/lib/storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ResponsesAnalyticsProps {
  responses: FormResponse[];
  config: FormConfig | null;
}

export default function ResponsesAnalytics({ responses, config }: ResponsesAnalyticsProps) {
  // Rating distribution
  const ratingData = responses.reduce((acc: any, r) => {
    const rating = r.data.rating || 'No Rating';
    const existing = acc.find((item: any) => item.name === rating);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ name: rating, count: 1 });
    }
    return acc;
  }, []);

  // Responses over time (daily)
  const timeSeriesData = responses.reduce((acc: any, r) => {
    const date = new Date(r.submittedAt).toLocaleDateString();
    const existing = acc.find((item: any) => item.date === date);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ date, count: 1 });
    }
    return acc;
  }, []);

  // Newsletter subscription
  const subscribeCount = responses.filter((r) => r.data.subscribe === true).length;
  const subscriptionData = [
    { name: 'Subscribed', value: subscribeCount },
    { name: 'Not Subscribed', value: responses.length - subscribeCount },
  ];

  const COLORS = ['hsl(var(--color-primary))', 'hsl(var(--color-muted))'];

  // Average rating
  const ratingNumbers = responses
    .map((r) => {
      const rating = r.data.rating?.split(' ')[0];
      return rating ? parseInt(rating) : 0;
    })
    .filter((r) => r > 0);
  const avgRating = ratingNumbers.length > 0 ? (ratingNumbers.reduce((a, b) => a + b) / ratingNumbers.length).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      {/* Average Rating */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary">{avgRating}</div>
            <p className="text-sm text-muted-foreground mt-2">Average Rating (out of 5)</p>
          </div>
        </CardContent>
      </Card>

      {/* Rating Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Rating Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          {ratingData.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No rating data</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ratingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
                <XAxis dataKey="name" stroke="hsl(var(--color-muted-foreground))" />
                <YAxis stroke="hsl(var(--color-muted-foreground))" />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--color-card))' }} />
                <Bar dataKey="count" fill="hsl(var(--color-primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Responses Over Time */}
      <Card>
        <CardHeader>
          <CardTitle>Responses Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          {timeSeriesData.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No time series data</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
                <XAxis dataKey="date" stroke="hsl(var(--color-muted-foreground))" />
                <YAxis stroke="hsl(var(--color-muted-foreground))" />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--color-card))' }} />
                <Line type="monotone" dataKey="count" stroke="hsl(var(--color-primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Newsletter Subscription */}
      <Card>
        <CardHeader>
          <CardTitle>Newsletter Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          {subscriptionData.every((d) => d.value === 0) ? (
            <p className="text-center text-muted-foreground py-8">No subscription data</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={subscriptionData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                  {subscriptionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--color-card))' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
