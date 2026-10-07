# How to Deploy This Site on GitHub Pages

This guide assumes you've already pushed the project to GitHub (see `HOW_TO_PUSH_TO_GITHUB.md`) and have never set up GitHub Pages before.

This project is already configured for the simplest possible deployment: no servers, no GitHub Actions, no build pipelines to maintain. You build the site once on your computer, commit the result, and GitHub serves it as static files.

---

## 1. Install the project's dependencies

First, open a terminal **in the project folder** (the one with `package.json` in it). The easiest way, since this project is already open in VS Code:

1. In VS Code, open the menu bar and click **Terminal → New Terminal** (or press `` Ctrl+` `` / `` Cmd+` ``).
2. A terminal panel opens at the bottom of VS Code, already starting in this project's folder — you don't need to type `cd` at all.

> **Not using VS Code?** On a Mac, open the **Terminal** app (search for it with Spotlight: `Cmd+Space`, type `Terminal`, press Enter), then navigate to the project folder with:
> ```bash
> cd path/to/TestMe
> ```
> replacing `path/to/TestMe` with the actual folder location (for example, `~/Documents/Development/WebMCP/TestMe`).

Once your terminal is open in the project folder, run:

```bash
npm install
```

This downloads all the packages the project needs (React, Vite, etc.) into a `node_modules` folder. It can take a minute or two the first time.

---

## 2. Build the site

```bash
npm run build
```

This compiles all the React/TypeScript source code (`src/`) into plain HTML, CSS, and JavaScript files that any browser can run — no build tools required to view them. Because of the project's `vite.config.ts` settings, the output is placed in a folder called **`docs/`** at the root of the project (not the usual `dist/`).

After this command finishes, you should see a `docs` folder containing files like `index.html` and an `assets` folder.

> Re-run this command any time you change the code in `src/` and want to update the live site.

---

## 3. Commit and push the `docs` folder

The `docs` folder is **not** ignored by Git (check `.gitignore` — only `dist` is ignored), so it will be included normally:

```bash
git add .
git commit -m "Build site for GitHub Pages"
git push
```

---

## 4. Turn on GitHub Pages for this repository

1. Go to your repository on GitHub.com (e.g. `https://github.com/<your-username>/<your-repo-name>`).
2. Click the **Settings** tab (top of the repository page — you need to be the repo owner or have admin access).
3. In the left sidebar, click **Pages**.
4. Under **Build and deployment**:
   - **Source**: choose **Deploy from a branch**.
   - **Branch**: choose **`main`**, and in the folder dropdown next to it, choose **`/docs`**.
5. Click **Save**.

---

## 5. Wait for it to go live

- GitHub takes anywhere from a few seconds to a couple of minutes to publish the site.
- Refresh the **Settings → Pages** screen — once it's ready, a banner will appear at the top saying something like:
  > Your site is live at `https://<your-username>.github.io/<your-repo-name>/`
- Click that link (or paste it into a browser) to see your deployed WebMCP test page.

---

## 6. Updating the live site later

Every time you make changes:

```bash
npm run build
git add .
git commit -m "Describe what changed"
git push
```

GitHub Pages automatically re-publishes the `docs` folder's contents within a minute or two of each push — no extra steps needed.

---

## Testing the WebMCP tool

This page uses the experimental **`document.modelContext`** WebMCP API, which is not yet available in every browser. To test it:

- Use a browser or AI agent environment that has implemented WebMCP (check the [WebMCP implementation status](https://github.com/webmachinelearning/webmcp/blob/main/implementation-status.md) for current support).
- If `document.modelContext` isn't available, the page will show **"❌ WebMCP is available"** as unavailable in the WebMCP status section — this is expected on unsupported browsers, not a bug in the deployment.
- Once loaded in a supported environment, an agent should be able to discover and call the `start_here` tool, which fills in the first/last name fields and clicks the submit button.

---

## Common problems

| Problem | Likely fix |
|---|---|
| 404 page when visiting the Pages URL | Double-check Settings → Pages shows branch `main` and folder `/docs`, and that the `docs` folder was actually committed and pushed (`git log --stat` to confirm). |
| Blank white page, console shows asset loading errors | Make sure you ran `npm run build` (not just `npm run dev`) and pushed the resulting `docs` folder — don't deploy the `src` folder directly. |
| Changes don't appear after pushing | Hard-refresh your browser (Cmd+Shift+R / Ctrl+Shift+R) — GitHub Pages and browsers both cache aggressively. Also confirm you ran `npm run build` again before committing. |
| "WebMCP is available" shows ❌ | Your current browser/agent doesn't implement `document.modelContext` yet — this is a browser limitation, not a site bug. |
