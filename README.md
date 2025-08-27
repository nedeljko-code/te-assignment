# Posts features (Next.js 13+ / React 18 / TypeScript)

Minimal implementation of sign-up/login, posts list, posts by user, and create post, with basic 401 handling and client-side search.

---

## Quick start (npm)

```bash
npm install
npm run dev   # http://localhost:3000

Environment

Set the same base URL for both auth and posts in .env.local (no trailing slash):

API_BASE=https://frontend-test-be.stage.thinkeasy.cz
NEXT_PUBLIC_API_BASE=https://frontend-test-be.stage.thinkeasy.cz

Implemented features

• Signup/Login — stores in localStorage: accessToken, refreshToken, userId
• Posts list — GET /posts
• Create post — POST /posts (payload: { title, content })
• Posts by user — GET /posts/user/:userId
• 401 handling — auto logout (clear storage) + redirect to /auth/login
• Search — client-side filter by title and content (case-insensitive)

 FE proxy routes (Next.js Route Handlers):

 FE route	                    Upstream (BE)	                                Method
/api/te/auth/signup	            ${API_BASE}/auth/signup	                        POST
/api/te/auth/login	            ${API_BASE}/auth/login	                        POST
/api/te/posts	                ${API_BASE}/posts	                            GET, POST
/api/te/posts/user/:userId	    ${API_BASE}/posts/user/:userId	                GET

The proxy forwards the Authorization header to the backend.

UI pages:

/auth/signup – registration

/auth/login – login

/posts – all posts list + create + local search

/posts/user/[userId] – posts for a specific user


Storage keys:

accessToken

refreshToken

userId


On 401: these keys are cleared and the app redirects to /auth/login.


How to test

Signup/Login → in DevTools › Application › Local Storage, verify accessToken, refreshToken, userId.

Open /posts → Network: GET /api/te/posts returns 200 and the list renders.

Create → send title + content → POST /api/te/posts returns 201 → the list reloads and shows the new post.

Posts by user → open /posts/{userId} (use userId from storage) → only your posts are shown.

401 test → remove accessToken from Local Storage → refresh → app redirects to /auth/login.


Scripts (npm)
npm run dev      # development
npm run build    # production build
npm start        # run the production build
npm run lint     # lint