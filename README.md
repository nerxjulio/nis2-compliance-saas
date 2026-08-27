# NIS2Ready

Micro-SaaS de mise en conformité NIS2/DORA pour PME et ETI européennes : diagnostic,
checklist priorisée, génération de documents de conformité, dossier d'audit exportable.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind v4 + shadcn/ui (Base UI)
- Supabase (Auth email/magic link + Postgres avec RLS + Storage)
- Stripe (à venir — checkout + webhooks)
- react-pdf (à venir — génération de documents)

## Mise en route

### 1. Installer les dépendances

```bash
npm install
```

### 2. Créer le projet Supabase

1. Va sur https://supabase.com/dashboard → **New project**.
2. Une fois créé, ouvre **Project Settings → API** et récupère `Project URL` et
   `anon public key`.
3. Ouvre **SQL Editor** dans le dashboard Supabase, colle le contenu de
   `supabase/migrations/0001_init.sql`, et exécute-le. Ça crée toutes les tables,
   les enums, les fonctions et les policies RLS.
4. Dans **Authentication → Providers**, l'authentification par email (magic link)
   est activée par défaut — rien à faire de plus pour le MVP.
5. Dans **Authentication → URL Configuration**, ajoute `http://localhost:3000/auth/callback`
   à la liste des Redirect URLs (et l'URL de prod plus tard).

### 3. Configurer les variables d'environnement

```bash
cp .env.example .env.local
```

Remplis `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` avec les valeurs
récupérées à l'étape précédente.

### 4. Lancer le serveur de développement

```bash
npm run dev
```

Ouvre http://localhost:3000. Le flux complet : landing → `/login` (magic link) → email
reçu → clic sur le lien → `/auth/callback` → `/onboarding` (création de l'organisation,
une seule fois) → `/dashboard`.

## Structure du projet

```
src/
├── app/
│   ├── page.tsx                 # landing page + pricing
│   ├── (auth)/
│   │   ├── login/page.tsx       # formulaire magic link
│   │   └── actions.ts           # signInWithMagicLink, signOut
│   ├── auth/callback/route.ts   # échange le code du lien contre une session
│   ├── onboarding/               # création de l'organisation (hors layout dashboard)
│   └── (dashboard)/
│       ├── layout.tsx           # garde d'authentification + org active
│       └── dashboard/page.tsx   # tableau de bord
├── lib/supabase/
│   ├── client.ts                 # client navigateur
│   ├── server.ts                 # client Server Components/Actions
│   └── middleware.ts             # rafraîchissement de session (utilisé par proxy.ts)
└── proxy.ts                      # équivalent middleware.ts sous Next.js 16
supabase/migrations/0001_init.sql # schéma complet + RLS
```

## Prochaines étapes (hors scope de ce commit)

- Questionnaire de diagnostic NIS2/DORA + calcul de classification
- Checklist priorisée + suivi de progression
- Génération de documents (react-pdf) : politique de sécurité, registre des risques,
  plan de gestion d'incidents
- Intégration Stripe (Checkout + webhooks + Customer Portal)
- Plan de go-to-market
