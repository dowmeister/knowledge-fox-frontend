const { configure } = require('quasar/wrappers');

module.exports = configure(() => {
  return {
    rules: {
      // Override Quasar's default rules
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
    },
  };
});
