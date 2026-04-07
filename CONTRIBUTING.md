# Contributing to AI SOC Sentinel

First off, thank you for considering contributing to AI SOC Sentinel! It's people like you that make AI SOC Sentinel such a great tool for the cybersecurity community.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title** for the issue to identify the problem.
* **Describe the exact steps which reproduce the problem** in as many details as possible.
* **Provide specific examples to demonstrate the steps**. Include links to files or GitHub projects, or copy/pasteable snippets, which you use in those examples.
* **Describe the behavior you observed after following the steps** and point out what exactly is the problem with that behavior.
* **Explain which behavior you expected to see instead and why.**
* **Include screenshots and animated GIFs** which show you following the described steps and clearly demonstrate the problem.

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title** for the issue to identify the suggestion.
* **Provide a detailed description of the suggested enhancement** including any potential benefits and drawbacks.
* **Explain why this enhancement would be useful** to most AI SOC Sentinel users.
* **List some examples of how this enhancement would be used** in real-world scenarios.

### Pull Requests

* Fill in the required template
* Follow the JavaScript/JSX style guide
* Include comments in your code where necessary
* Update documentation as needed
* Test your changes thoroughly

## Development Setup

### Prerequisites

* Node.js 18+
* npm or yarn
* Git

### Setting Up Your Development Environment

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/ai-soc-sentinel.git
   cd ai-soc-sentinel
   ```

3. Add the upstream remote:
   ```bash
   git remote add upstream https://github.com/THAMARAISELVAM-A/ai-soc-sentinel.git
   ```

4. Create a branch for your work:
   ```bash
   git checkout -b feature/your-feature-name
   ```

5. Install dependencies:
   ```bash
   npm install
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

7. Make your changes and test them thoroughly
8. Commit your changes with a clear, descriptive commit message
9. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

10. Open a Pull Request on GitHub

## Style Guidelines

### JavaScript/JSX

* Use ES6+ features where appropriate
* Use functional components with hooks in React
* Prefer `const` and `let` over `var`
* Use template literals for string interpolation
* Use arrow functions for callbacks and anonymous functions
* Keep functions small and focused on a single task
* Use meaningful variable names that describe their purpose

### CSS

* Use CSS variables for colors, fonts, and spacing
* Follow BEM naming convention for CSS classes where appropriate
* Use flexbox and grid for layouts
* Ensure responsive design with mobile-first approach
* Use CSS transitions for smooth animations

### Comments

* Use comments to explain **why** you did something, not **what** you did
* Keep comments up-to-date with code changes
* Use JSDoc-style comments for functions and complex logic

### Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

## Project Structure

```
ai-soc-sentinel/
├── public/
│   └── assets/              # Static assets (fonts, images)
├── src/
│   ├── components/          # Reusable React components
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions
│   ├── styles/              # Global styles and CSS modules
│   ├── App.jsx             # Main application component
│   ├── App.css             # Application-specific styles
│   ├── index.css           # Global styles
│   └── main.jsx            # Application entry point
├── index.html              # HTML template
├── package.json            # Project dependencies and scripts
├── vite.config.js          # Vite configuration
├── .eslintrc.js            # ESLint configuration
├── .prettierrc              # Prettier configuration
└── README.md               # Project documentation
```

## Testing

Before submitting a pull request, please ensure:

* All existing tests pass
* You've added tests for new functionality
* The application builds without errors
* The application runs without console errors or warnings

Run tests with:
```bash
npm test
```

## Documentation

* Update the README.md if you change functionality
* Add JSDoc comments for new functions and components
* Update the inline documentation where necessary
* Keep the documentation clear and concise

## Common Tasks

### Adding a New Component

1. Create the component file in `src/components/`
2. Export the component from the component file
3. Import and use the component in the appropriate place
4. Add PropTypes or TypeScript types for validation
5. Write tests for the component
6. Update documentation if needed

### Adding New Styles

1. Use CSS variables from `src/index.css` when possible
2. Follow the existing naming conventions
3. Keep styles modular and reusable
4. Test styles across different screen sizes

### Integrating New Data Sources

1. Create a new service or utility function for the data source
2. Add appropriate error handling
3. Update the data models and types
4. Test with real data when possible
5. Update documentation

## Questions?

If you have questions or need help, please:

* Check the existing documentation
* Search through the issues
* Ask in the GitHub Discussions
* Contact the maintainers directly

## Recognition

Contributors will be recognized in the following ways:

* Listed in the CONTRIBUTORS.md file
* Mentioned in release notes when applicable
* GitHub contribution graph recognition

Thank you for contributing to AI SOC Sentinel! 🛡️