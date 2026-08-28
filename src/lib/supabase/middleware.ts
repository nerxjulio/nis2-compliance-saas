import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";

const PUBLIC_PATHS = new Set(["/", "/login"]);

// `response` vient du middleware next-intl (rewrite/redirect pour la locale, ou next()) —
// on ne le remplace jamais par un NextResponse.next() vierge, seulement des cookies dessus,
// sinon on perdrait la résolution de locale déjà effectuée.
export async function updateSession(request: NextRequest, response: NextResponse) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT : getUser() (pas getSession()) pour valider le token auprès de Supabase
  // à chaque requête plutôt que de faire confiance à un cookie potentiellement expiré.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const segments = request.nextUrl.pathname.split("/").filter(Boolean);
  const maybeLocale = segments[0];
  const isLocalePrefixed = (routing.locales as readonly string[]).includes(maybeLocale);
  const pathWithoutLocale = isLocalePrefixed ? "/" + segments.slice(1).join("/") : request.nextUrl.pathname;
  const normalizedPath = pathWithoutLocale === "" ? "/" : pathWithoutLocale;

  if (!PUBLIC_PATHS.has(normalizedPath) && !user) {
    const locale = isLocalePrefixed ? maybeLocale : routing.defaultLocale;
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `/${locale}/login`;
    redirectUrl.searchParams.set("redirect", normalizedPath);
    const redirectResponse = NextResponse.redirect(redirectUrl);
    response.cookies.getAll().forEach((c) => redirectResponse.cookies.set(c));
    return redirectResponse;
  }

  return response;
}
