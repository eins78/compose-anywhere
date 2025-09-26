# Contributing to Compose Anywhere

Thank you for your interest in contributing to Compose Anywhere! This is a proof of concept project for visual component placement.

## Development Workflow

### 1. Feature Branch Workflow

We use a feature branch workflow. All changes should be made in feature branches and merged via pull requests.

```bash
# Create a new feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description

# Or for documentation
git checkout -b docs/update-description
```

### 2. Branch Naming Convention

- `feature/` - New features or enhancements
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions or updates

### 3. Making Changes

1. Create a feature branch from `main`
2. Make your changes
3. Test locally using `pnpm serve`
4. Commit with clear, descriptive messages
5. Push to your feature branch
6. Open a pull request

### 4. Commit Messages

Follow conventional commit format:

```
type: Brief description

Longer explanation if needed

Fixes #123
```

Types:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Test updates
- `chore:` Maintenance tasks

### 5. Pull Request Process

1. Update documentation if needed
2. Ensure all tests pass (if applicable)
3. Fill out the PR template
4. Request review if working with others
5. Merge only after approval (or self-merge for solo work)

## Local Development

```bash
# Install dependencies
pnpm install

# Start local server
pnpm serve

# Test the bookmarklet
# Open http://localhost:8080/demo.html
```

## Testing Checklist

Before submitting a PR, ensure:

- [ ] Bookmarklet loads without errors
- [ ] Container detection works correctly
- [ ] Component placement works in all positions
- [ ] Floating menu functions properly
- [ ] Export code generation works
- [ ] No console errors

## Code Style

- Use vanilla JavaScript (no build step currently)
- Follow existing code patterns
- Add JSDoc comments for functions
- Keep it simple - this is a POC

## Questions?

Feel free to open an issue for discussion!