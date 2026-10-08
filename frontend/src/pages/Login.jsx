import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../components/Auth";
import { ErrorBox, Field } from "../components/ui";

export default function Login() {
  const { user, login, register } = useAuth();
  const nav = useNavigate(), loc = useLocation();
  const [mode, setMode] = useState("login");
  const [f, setF] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState(""), [busy, setBusy] = useState(false);
  if (user) return <Navigate to={loc.state?.from || "/"} replace />;

  const submit = async (e) => {
    e.preventDefault(); setErr(""); setBusy(true);
    try {
      if (mode === "login") await login(f.email, f.password); else await register(f.name, f.email, f.password);
      nav(loc.state?.from || "/", { replace: true });
    } catch (ex) { setErr(ex.message); } finally { setBusy(false); }
  };
  const up = (k) => (e) => setF({ ...f, [k]: e.target.value });

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-brand text-2xl text-white" aria-hidden>⚡</div>
          <h1 className="text-2xl font-bold tracking-tight">EV Battery Guardian</h1>
          <p className="mt-1 text-sm text-ink-soft">Hybrid physics + ML battery health, life and risk.</p>
        </div>
        <form onSubmit={submit} className="card space-y-4">
          <div className="grid grid-cols-2 gap-1 rounded-lg bg-surface p-1 text-sm font-medium" role="tablist">
            {[["login", "Sign in"], ["register", "Create account"]].map(([m, l]) => (
              <button key={m} type="button" role="tab" aria-selected={mode === m} onClick={() => { setMode(m); setErr(""); }}
                className={`rounded-md py-1.5 ${mode === m ? "bg-surface-raised shadow-sm" : "text-ink-soft"}`}>{l}</button>
            ))}
          </div>
          <ErrorBox>{err}</ErrorBox>
          {mode === "register" && <Field label="Name"><input className="input" required maxLength={120} value={f.name} onChange={up("name")} autoComplete="name" /></Field>}
          <Field label="Email"><input className="input" type="email" required value={f.email} onChange={up("email")} autoComplete="email" /></Field>
          <Field label="Password" hint={mode === "register" ? "8–72 characters" : undefined}>
            <input className="input" type="password" required minLength={mode === "register" ? 8 : 1} maxLength={72} value={f.password} onChange={up("password")} autoComplete={mode === "login" ? "current-password" : "new-password"} />
          </Field>
          <button className="btn-primary w-full" disabled={busy}>{busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}</button>
        </form>
      </div>
    </div>
  );
}
