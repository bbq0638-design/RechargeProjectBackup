module.exports = {
  root: true,
  extends: ['@react-native-community', 'airbnb', 'prettier'],
  rules: {
    'import/prefer-default-export': 'off',
    'import/extensions': ['off'],
    // React Native에서 .js 파일에도 JSX 문법 사용 허용 (필요시 사용)
    'react/jsx-filename-extension': ['error', {extensions: ['.js', '.jsx']}],
  },
};
