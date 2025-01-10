module.exports = {
  ignores: [(commit) => commit.includes('init')],
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-leading-blank': [2, 'always'],
    'footer-leading-blank': [1, 'always'],
    'header-max-length': [2, 'always', 108],
    'subject-empty': [2, 'never'],
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature
        'fix', // Fix bug or issue
        'perf', // Performance improvement
        'style', // Code style
        'docs', // Documentation or Comments
        'test', // Add or update tests
        'refactor', // Code refactor
        'build', // Build system or external dependencies
        'ci', // CI related changes
        'chore', // Other changes
        'revert', // Revert changes
      ],
    ],
  },
};
