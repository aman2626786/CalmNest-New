# Git Workflow Guide for CalmNest

## Daily Development Workflow

### 1. Start Working on a New Feature
```bash
# Create and switch to a new feature branch
git checkout -b feature/feature-name

# Example:
git checkout -b feature/user-authentication
git checkout -b feature/mood-tracking-improvements
git checkout -b bugfix/dashboard-loading-issue
```

### 2. During Development
```bash
# Check status frequently
git status

# Add specific files
git add filename.js
# Or add all changes
git add .

# Commit with descriptive message
git commit -m "Add user authentication with Supabase

- Implement login/logout functionality
- Add protected routes
- Update header with user profile"
```

### 3. Push Your Feature Branch
```bash
# Push feature branch to GitHub
git push origin feature/feature-name
```

### 4. Create Pull Request
- Go to GitHub repository
- Click "Compare & pull request"
- Add description of changes
- Request review if working in team

### 5. Merge and Cleanup
```bash
# Switch back to main branch
git checkout main

# Pull latest changes
git pull origin main

# Delete local feature branch (after merge)
git branch -d feature/feature-name

# Delete remote feature branch (optional)
git push origin --delete feature/feature-name
```

## Useful Git Commands

### Check Current Status
```bash
git status                    # See current changes
git log --oneline -10        # See last 10 commits
git branch                   # See all local branches
git branch -r                # See remote branches
```

### Undo Changes
```bash
git restore filename.js      # Undo changes to specific file
git restore .               # Undo all unstaged changes
git reset HEAD~1            # Undo last commit (keep changes)
git reset --hard HEAD~1     # Undo last commit (lose changes)
```

### Sync with Remote
```bash
git fetch origin            # Get latest info from remote
git pull origin main        # Pull latest changes from main
git push origin main        # Push local changes to main
```

## Branch Naming Conventions

- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `hotfix/description` - Urgent fixes
- `improvement/description` - Enhancements
- `docs/description` - Documentation updates

## Commit Message Format

```
Type: Brief description (50 chars max)

Detailed explanation of what and why (if needed)
- Bullet points for multiple changes
- Reference issue numbers if applicable
```

### Commit Types:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code formatting
- `refactor:` - Code restructuring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

## Example Workflow Session

```bash
# Start new feature
git checkout main
git pull origin main
git checkout -b feature/dashboard-improvements

# Make changes to files
# ... coding ...

# Stage and commit changes
git add .
git commit -m "feat: improve dashboard performance

- Add loading states for better UX
- Optimize API calls with caching
- Fix responsive layout issues"

# Push to GitHub
git push origin feature/dashboard-improvements

# Create PR on GitHub, get it reviewed and merged

# Cleanup
git checkout main
git pull origin main
git branch -d feature/dashboard-improvements
```

## Tips for Good Version Control

1. **Commit Often**: Small, focused commits are better than large ones
2. **Write Clear Messages**: Future you will thank you
3. **Use Branches**: Never work directly on main branch
4. **Pull Before Push**: Always sync with remote before pushing
5. **Review Before Commit**: Use `git status` and `git diff` to review changes
6. **Backup Important Work**: Push branches to remote regularly