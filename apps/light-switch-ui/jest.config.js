module.exports = {
  name: 'light-switch-ui',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/light-switch-ui',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
