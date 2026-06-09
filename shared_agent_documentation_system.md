# Shared Agent Documentation System (Git Submodule Approach)

## 🎯 Intent

### What problem are we solving?

As multiple teams build automation frameworks (e.g., Reqnroll, Playwright, Page Objects), inconsistencies quickly emerge:

- Different coding patterns across repos  
- Drift in architecture decisions  
- AI-generated code varying by project  
- Repeated effort reinventing the same solutions  

This system establishes:

✅ A **single source of truth** for engineering patterns  
✅ **Consistent AI behavior** across repositories  
✅ A **versioned, reviewable way** to adopt updates  
✅ Flexibility for teams when needed  

---

## 🧠 Core Concept

Shared documentation lives in a central repository and is consumed by each project via a **git submodule**.

Each team repo contains a snapshot of the shared docs and updates them **on demand or via automation**.

---

## 🏗️ Architecture Overview

central-repo (engineering-agents-docs)
│
├── /agents
│   ├── AGENTS.md
│   ├── playwright.agent.md
│   ├── reqnroll.agent.md
│   └── page-objects.agent.md
│
└── /docs (optional detailed references)

Each team repo:

team-project
│
├── /agents  (git submodule)
│
└── AGENTS.md (root file that references shared rules)

---

## 🚀 Using Shared Rules in a New Repo

### Step 1 — Add the submodule

```bash
git submodule add https://github.com/<org>/engineering-agents-docs.git agents
git submodule update --init --recursive
```

---

### Step 2 — Create a root `AGENTS.md`

This ensures AI tools load and prioritize shared rules.

```md
# Project Agent Instructions

## Core Rules
Follow all shared standards defined in:

- /agents/AGENTS.md

## Domain-Specific Guidance
- /agents/playwright.agent.md
- /agents/reqnroll.agent.md
- /agents/page-objects.agent.md
```

---

### Step 3 — Commit everything

```bash
git add .
git commit -m "Add shared agent documentation"
```

---

## 🛠️ Adding Shared Rules to an Existing Repository (VS Code)

This process assumes you are working in **VS Code** and already have a repository cloned locally.

### Step 1 — Open the repo in VS Code

- Open VS Code
- Select **File → Open Folder**
- Choose your existing project repository

---

### Step 2 — Add the submodule using the terminal

Open the integrated terminal in VS Code:

- **Terminal → New Terminal**

Run:

```bash
git submodule add https://github.com/<org>/engineering-agents-docs.git agents
git submodule update --init --recursive
```

👉 You should now see an `/agents` folder appear in the file explorer.

---

### Step 3 — Create or update root `AGENTS.md`

In the root of your repo:

- Create a new file: `AGENTS.md` (if it doesn’t exist)
- Or update the existing one

Recommended content:

```md
# Project Agent Instructions

## Core Rules
Follow all shared standards defined in:

- /agents/AGENTS.md

## Domain-Specific Guidance
- /agents/playwright.agent.md
- /agents/reqnroll.agent.md
- /agents/page-objects.agent.md
```

---

### Step 4 — Stage and commit changes

Using VS Code Source Control:

- Open the **Source Control** panel
- Stage:
  - `.gitmodules`
  - `/agents` (submodule reference)
  - `AGENTS.md`

Or via terminal:

```bash
git add .
git commit -m "Add shared agent documentation (submodule)"
```

---

### Step 5 — Verify submodule behavior

In VS Code:

- Expand `/agents`
- Confirm files like `AGENTS.md` and `*.agent.md` are visible

Optional verification:

```bash
git submodule status
```

---

### Step 6 — Pull submodules when updating repo

When pulling future changes, ensure submodules are updated:

```bash
git pull
git submodule update --init --recursive
```

👉 Without this step, your local docs may be outdated even if the repo is up to date.

---

## 🔄 Getting the Most Recent Docs

### Option 1 — Manual Update

```bash
git submodule update --remote
git add agents
git commit -m "Update shared agent docs"
```

---

### Option 2 — GitHub Action (recommended)

A workflow can:

- Pull latest docs
- Update the submodule reference
- Create a pull request

👉 This keeps repos up to date without manual effort.

---

## ⏱️ When Updates Take Effect

Updates follow this lifecycle:

Docs updated → Repo pulls update → PR created → PR merged → Rules active

Important:

- Changes are **not live** until merged
- AI tools use whatever is currently in the repo
- Local environments require `git pull` + submodule update

---

## 🔍 Understanding Pending Changes

When a submodule is updated, Git shows:

-Subproject commit abc123
+Subproject commit def456

This does NOT show what changed.

### How to review changes

1. Navigate to the central docs repo  
2. Compare commits:
   https://github.com/<org>/engineering-agents-docs/compare/abc123...def456
3. Review updated `.agent.md` or `AGENTS.md` files  

👉 Always review changes before merging if they affect patterns or architecture.

---

## ⚠️ Overriding Shared Docs (Use Sparingly)

Teams may occasionally need to deviate from shared standards.

### Preferred approach: Local override in root `AGENTS.md`

```md
## Overrides

For this project:

- We use a custom browser lifecycle due to legacy constraints
- Standard Playwright guidance is modified as follows:
  ...
```

---

### Alternative: Local `.agent.md` override

Create a file like:

/agents/playwright.override.agent.md

And reference it in root `AGENTS.md`.

---

### ⚠️ Warnings

Only override when:

- A technical constraint requires it  
- The shared pattern is not applicable  
- You have team alignment  

Avoid overriding for:

❌ Preference differences  
❌ Minor stylistic changes  
❌ Lack of familiarity with the standard  

👉 Overuse of overrides defeats the purpose of shared consistency.

---

## 🔒 Preventing Automatic Changes (Locking Docs)

Some teams may want stability over updates.

### Option 1 — Do nothing

Submodules are **already pinned to a commit**.

👉 Docs will NOT change unless explicitly updated.

---

### Option 2 — Disable update workflows

If using GitHub Actions:

- Disable scheduled updates  
- Only allow manual updates  

---

### Option 3 — Pin to a specific commit

```bash
git checkout <specific-commit>
```

Then commit the submodule reference.

👉 This ensures:

- No drift  
- Fully reproducible environments  

---

### Tradeoff

| Benefit | Cost |
|--------|------|
| Stability | Missed improvements |
| Predictability | Potential technical debt |
| Safety | Manual upgrade burden |

---

## 🧩 Best Practices

### ✅ Do

- Keep root `AGENTS.md` minimal and focused  
- Review updates before merging  
- Use scheduled updates (weekly recommended)  
- Treat shared docs as **authoritative by default**  

---

### ❌ Avoid

- Copying docs into repos (causes drift)  
- Editing files inside the submodule directly  
- Ignoring updates for long periods  
- Overriding without strong justification  

---

## 🧠 Key Takeaways

- Shared docs are **versioned, not live**
- Updates are **pulled into each repo**, not pushed globally
- Changes become active **only after merge**
- Submodules provide **control + consistency**
- Overrides should be **rare and intentional**

---

## 🚀 Summary

This system balances:

- **Centralized standards** (consistency across teams)  
- **Local control** (teams adopt changes safely)  
- **AI alignment** (better, more predictable code generation)  

When used correctly, it becomes a **scalable foundation** for multi-team engineering and AI-assisted development.

