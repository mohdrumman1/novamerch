type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = params.next === "/admin" || params.next?.startsWith("/admin/")
    ? params.next
    : "/admin/dashboard";

  return (
    <main
      className="min-h-screen flex items-center justify-center"
      style={{
        background: "var(--bg)",
        padding: 24,
      }}
    >
      <form
        action="/admin/api/auth/login"
        method="post"
        className="w-full"
        style={{
          maxWidth: 380,
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: 28,
          boxShadow: "0 18px 48px rgba(0,0,0,0.18)",
        }}
      >
        <input type="hidden" name="next" value={nextPath} />
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              color: "var(--text)",
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: 0,
              lineHeight: 1.2,
            }}
          >
            NovaMerch Admin
          </div>
          <div style={{ color: "var(--text-secondary)", marginTop: 6, fontSize: 14 }}>
            Sign in to continue.
          </div>
        </div>

        <label
          htmlFor="username"
          style={{ display: "block", color: "var(--text)", fontSize: 13, fontWeight: 600 }}
        >
          Username
        </label>
        <input
          id="username"
          name="username"
          autoComplete="username"
          required
          style={{
            width: "100%",
            height: 42,
            marginTop: 8,
            marginBottom: 16,
            borderRadius: 6,
            border: "1px solid var(--border)",
            background: "var(--bg)",
            color: "var(--text)",
            padding: "0 12px",
            fontSize: 15,
          }}
        />

        <label
          htmlFor="password"
          style={{ display: "block", color: "var(--text)", fontSize: 13, fontWeight: 600 }}
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          style={{
            width: "100%",
            height: 42,
            marginTop: 8,
            borderRadius: 6,
            border: "1px solid var(--border)",
            background: "var(--bg)",
            color: "var(--text)",
            padding: "0 12px",
            fontSize: 15,
          }}
        />

        {params.error ? (
          <div style={{ color: "var(--red)", fontSize: 13, marginTop: 12 }}>
            Username or password is incorrect.
          </div>
        ) : null}

        <button
          type="submit"
          style={{
            width: "100%",
            height: 42,
            marginTop: 20,
            border: 0,
            borderRadius: 6,
            background: "var(--accent)",
            color: "#0A0A0A",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Sign in
        </button>
      </form>
    </main>
  );
}
