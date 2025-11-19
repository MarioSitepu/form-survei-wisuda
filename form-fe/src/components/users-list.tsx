import { FormResponse } from '@/lib/storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UsersListProps {
  responses: FormResponse[];
  formId?: string;
}

export default function UsersList({ responses, formId }: UsersListProps) {
  // Filter responses by formId if provided
  const filteredResponses = formId 
    ? responses.filter(r => r.formId === formId)
    : responses;

  const users = Array.from(
    new Map(
      filteredResponses
        .filter((r) => r.email)
        .map((r) => [
          r.email,
          {
            email: r.email,
            name: r.data.name,
            firstSubmitted: r.submittedAt,
            totalSubmissions: 0,
          },
        ])
    ).values()
  );

  // Count submissions per user
  const userSubmissions = new Map<string, number>();
  filteredResponses.forEach((r) => {
    if (r.email) {
      userSubmissions.set(r.email, (userSubmissions.get(r.email) || 0) + 1);
    }
  });

  const enrichedUsers = users.map((user) => ({
    ...user,
    totalSubmissions: userSubmissions.get(user.email!) || 0,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
      </CardHeader>
      <CardContent>
        {enrichedUsers.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No users yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-foreground">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Submissions</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">First Submitted</th>
                </tr>
              </thead>
              <tbody>
                {enrichedUsers.map((user) => (
                  <tr key={user.email} className="border-b border-border hover:bg-muted">
                    <td className="py-3 px-4 text-foreground">{user.name || '-'}</td>
                    <td className="py-3 px-4 text-foreground">{user.email}</td>
                    <td className="py-3 px-4 text-foreground">{user.totalSubmissions}</td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {new Date(user.firstSubmitted).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
