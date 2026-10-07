# How to Push This Project to GitHub

This guide assumes you have never used Git or GitHub before. Follow every step in order.

---

## 1. Check that Git is installed

First, open a terminal. The easiest way, since this project is already open in VS Code:

1. In VS Code, open the menu bar and click **Terminal → New Terminal** (or press `` Ctrl+` `` / `` Cmd+` ``).
2. A terminal panel opens at the bottom of VS Code, already starting in this project's folder.

> **Not using VS Code?** On a Mac, open the **Terminal** app (search for it with Spotlight: `Cmd+Space`, type `Terminal`, press Enter).

Then run:

```bash
git --version
```

- If you see something like `git version 2.43.0`, Git is installed — skip to step 2.
- If you see an error like `command not found: git`, install Git first:
  - **Mac**: run `xcode-select --install` and follow the prompts, or install from [git-scm.com](https://git-scm.com/downloads).
  - **Windows**: download and install from [git-scm.com](https://git-scm.com/downloads).

---

## 2. Tell Git who you are (one-time setup)

Git needs a name and email to attach to your commits. Run these, replacing the values with your own:

```bash
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

You only need to do this once per computer.

---

## 3. Create a new, empty repository on GitHub.com

1. Go to [github.com](https://github.com) and sign in.
2. Click the **+** icon in the top-right corner, then click **New repository**.
3. Fill in the form:
   - **Repository name**: pick something like `webmcp-test-page` (lowercase, no spaces — use hyphens instead).
   - **Visibility**: choose **Public** (required for free GitHub Pages hosting) or **Private** if you have a paid plan that supports Pages on private repos.
   - **Do NOT check** "Add a README file", "Add .gitignore", or "Choose a license". This project already has its own files — we don't want GitHub to create conflicting ones.
4. Click **Create repository**.
5. GitHub will show you a page with setup instructions and a repository URL. Keep this page open — you'll need the URL in step 5. It looks like:
   - `https://github.com/<your-username>/<your-repo-name>.git`

---

## 4. Open a terminal in the project folder

Navigate to the project folder (the one containing `package.json`, `src/`, etc.):

```bash
cd path/to/TestMe
```

(Replace `path/to/TestMe` with the actual folder location on your machine.)

---

## 5. Turn this folder into a Git repository and make your first commit

Run these commands **one at a time**, in order:

```bash
git init
```
This creates a hidden `.git` folder that tells Git to start tracking this project.

```bash
git add .
```
This stages every file in the project (tells Git "I want to include all of this in my next commit"). The `.gitignore` file already makes sure `node_modules` and other unnecessary files are excluded automatically.

```bash
git commit -m "Initial commit: WebMCP test page"
```
This saves a snapshot of everything you staged, with a message describing what it is.

```bash
git branch -M main
```
This makes sure your primary branch is named `main` (GitHub's default name).

---

## 6. Connect your local project to the GitHub repository

Using the URL from step 3, run:

```bash
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
```

Replace `<your-username>` and `<your-repo-name>` with your actual GitHub username and the repository name you chose.

---

## 7. Push your code to GitHub

```bash
git push -u origin main
```

### If you're asked to log in

GitHub no longer accepts your account password for this. You'll need a **Personal Access Token (PAT)** instead:

1. Go to [github.com/settings/tokens](https://github.com/settings/tokens).
2. Click **Generate new token** → **Generate new token (classic)**.
3. Give it a name (e.g. `my-laptop`), set an expiration (e.g. 90 days), and check the box next to **repo**.
4. Click **Generate token** at the bottom.
5. **Copy the token immediately** — GitHub only shows it once. Save it somewhere safe (like a password manager).
6. When the terminal asks for a username, enter your GitHub username.
7. When it asks for a password, **paste the token** (not your actual GitHub password).

After this, your code is on GitHub! Refresh the repository page in your browser to see all your files.

---

## 8. Making future changes

Whenever you edit files and want to save a new version to GitHub, repeat this pattern:

```bash
git add .
git commit -m "Describe what you changed"
git push
```

You only need to do `git init`, `git remote add origin`, and the token setup **once** per project.

---

## Common problems

| Problem | Likely fix |
|---|---|
| `fatal: remote origin already exists` | You already ran `git remote add origin` before. Run `git remote -v` to check the existing URL, or `git remote remove origin` and try again. |
| `Updates were rejected because the remote contains work that you do not have locally` | Someone (or GitHub itself) added commits you don't have. Run `git pull origin main --rebase` then `git push` again. |
| `Permission denied` or `Authentication failed` | Your Personal Access Token may be missing, expired, or doesn't have the `repo` scope. Generate a new one (step 7). |
| `git: command not found` | Git isn't installed — see step 1. |

Once this is done, continue to **HOW_TO_DEPLOY_TO_GITHUB_PAGES.md** to put the site online.
