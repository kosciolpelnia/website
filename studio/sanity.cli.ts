import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: { projectId: 'nzupjjh7', dataset: 'production' },
  // Pinned versions (package.json), not the CDN runtime. Deployed panel: https://kosciolpelnia.sanity.studio
  studioHost: 'kosciolpelnia',
  deployment: { appId: 'p71hhm93su3ghnmg5hse7947', autoUpdates: false },
});
