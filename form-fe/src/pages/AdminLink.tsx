import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AdminLink() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Admin Access</CardTitle>
            <CardDescription>
              Akses halaman admin dashboard untuk mengelola form dan melihat respons
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-4">
              <Link to="/admin-7x8k9m2q">
                <Button className="w-full" size="lg">
                  Go to Admin Dashboard
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="w-full">
                  Kembali ke Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

