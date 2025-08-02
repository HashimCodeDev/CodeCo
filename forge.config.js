module.exports = {
  packagerConfig: {
    asar: true,
    name: 'CodeCo',
    executableName: 'codeco',
    appBundleId: 'com.codecoapp.codeco',
    appVersion: '1.0.0'
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-zip',
      platforms: ['linux', 'darwin', 'win32'],
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
  ],
};