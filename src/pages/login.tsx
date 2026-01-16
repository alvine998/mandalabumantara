import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import PageLayout from "@/components/PageLayout";
import Section from "@/components/Section";
import Button from "@/components/Button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, loading: authLoading, signIn, resetPassword } = useAuth();
  const { showToast } = useToast();

  // Redirect if already signed in
  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/main/dashboard");
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn(email, password);
      showToast("Successfully signed in!", "success");
      router.push("/main/dashboard"); // Redirect after successful login
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/invalid-credential") {
        showToast("Invalid email or password", "error");
      } else if (err.code === "auth/user-not-found") {
        showToast("No account found with this email", "error");
      } else if (err.code === "auth/wrong-password") {
        showToast("Incorrect password", "error");
      } else if (err.code === "auth/too-many-requests") {
        showToast("Too many failed attempts. Please try again later.", "error");
      } else {
        showToast("Failed to sign in. Please try again.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      showToast("Please enter your email address first", "warning");
      return;
    }

    try {
      await resetPassword(email);
      showToast("Password reset email sent! Check your inbox.", "success");
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        showToast("No account found with this email", "error");
      } else {
        showToast("Failed to send reset email. Please try again.", "error");
      }
    }
  };

  // Show loading while checking auth state
  if (authLoading || user) {
    return (
      <PageLayout>
        <Section padding="large" className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-slate-500">Loading...</p>
          </div>
        </Section>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Section padding="large" className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md p-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/50">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Admin Login
            </h1>
            <p className="text-slate-500 mt-2">Sign in to manage your dashboard</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white/50"
                placeholder="admin@example.com"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white/50"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full justify-center" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </div>
      </Section>
    </PageLayout>
  );
}
