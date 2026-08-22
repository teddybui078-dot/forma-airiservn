## Workflow Orchestration

### 1. Plan Mode Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy
- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution

### 3. SKILL.md Strategy
- Write a SKILL.md file for any reusable workflow, pattern, or domain knowledge that recurs across tasks
- Each skill is a single focused capability -- one trigger, one purpose, no kitchen sinks
- Frontmatter must include `name` and a precise `description` (when to invoke, not what it is)
- Keep skills under ~150 lines; link to references for deep detail rather than inlining everything
- Invoke existing skills before improvising -- if a skill applies even at 1% odds, use it
- After repeated corrections on the same topic, promote the lesson into a skill so it self-applies next time
- Store project-specific skills in `.claude/skills/`; review and prune stale ones at session start

### 4. Self-Improvement Loop
- After ANY correction from the user: update tasks/lessons.md with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### 5. Verification Before Done
- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### 6. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes -- don't over-engineer
- Challenge your own work before presenting it

### 7. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests -- then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

# Task Management

1. **Plan First**: Write plan to tasks/todo.md with checkable items
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: High-level summary at each step
5. **Document Results**: Add review section to tasks/todo.md
6. **Capture Lessons**: Update tasks/lessons.md after corrections
7. **Work Verifcation**: Ask for specific questions (when asking questions, always give interactive options, interactive Q and A's)
8. **Step by Step**: Break down the problem into smaller steps and solve each step one by one
9. **Be Collaborative**: Collaborate with users to achieve their goals
10. **Be Adaptable**: Adapt to changing requirements and priorities

### 8. Ending Notes
- Always deploy subagents and skills
- Create USEFUL subagents and skills, not just random ones
- Create Agent Teams if you ever need Subagents to communicate with each other
- (IMPORTANT) When inquiring the user about ANYTHING to gather information to help build something better, always use interactive questions.

### 9. Git Commits
- Write commit messages naturally — NO conventional-commit prefixes (`feat:`, `chore:`, `docs:`, `fix:`, `fulfill:`, etc.)
- The subject line reads like a sentence a human would write about the change, e.g. "Add the gallery page with video playback" or "Render the signal sting demo end-to-end" — not "feat: gallery page"
- Keep the rest as is: granular commits (one meaningful change each), push after each, author = repo owner from `.env`, Claude co-author trailer at the end

### 10. Parallel Work & Git Worktrees
- Never point multiple Claude Code instances at the same working directory — concurrent edits and commits will race and conflict, including with auto-checkpoint commits
- Use `git worktree add <path> <branch>` to give each instance its own isolated directory + branch, sharing the same `.git` history (no full re-clone needed)
- Before splitting dependent work across parallel instances, lock the interface first (API shape, types, schema) via a plan doc — then build against that agreed contract simultaneously instead of blocking
- Clean up worktrees after merging: `git worktree remove <path>`

### 11. Skill Suite Routing (gstack + superpowers)
- Both suites auto-invoke based on context — no need to type `/commands` or skill names manually; describe the task and the matching skill fires on its own
- Superpowers' `using-superpowers` skill mandates invoking any skill with even a 1% chance of applying, checked before any response, including clarifying questions
- gstack auto-invokes when `proactive: true` (global `~/.gstack/config.yaml`, on by default) and either its router or the current project's CLAUDE.md `## Skill routing` section match the request
- The two suites overlap on two triggers with no defined winner: a new idea / "let's build X" (superpowers `brainstorming` vs. gstack `/office-hours`), and "fix this bug" (superpowers `systematic-debugging` vs. gstack `/investigate`)
- Default tiebreak: prefer gstack's skill when the current project already has gstack's CLAUDE.md routing section installed (it produces chained artifacts — design docs, specs — that downstream gstack skills expect); otherwise use superpowers' general-purpose skill
- Naming a skill explicitly (e.g. "run /office-hours" or "use systematic-debugging") always overrides the auto-pick, regardless of which suite it's from

Do not skip skills, ignore gstack errors, or work around missing gstack.

Using gstack skills: skills like /qa, /ship, /review, /investigate, and /browse
are available. Use /browse for all web browsing. Use ~/.claude/skills/gstack/...
for gstack file paths (the global path).

When the user's request matches an available skill, invoke it via the Skill tool. When in doubt, invoke the skill.

Key routing rules:
- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /plan-eng-review
- Design system/plan review → invoke /design-consultation or /plan-design-review
- Full review pipeline → invoke /autoplan
- Bugs/errors → invoke /investigate
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Ship/deploy/PR → invoke /ship or /land-and-deploy
- Save progress → invoke /context-save
- Resume context → invoke /context-restore
- Author a backlog-ready spec/issue → invoke /spec