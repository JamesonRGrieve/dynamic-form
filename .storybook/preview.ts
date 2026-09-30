// SPDX-License-Identifier: AGPL-3.0-or-later
import './../src/app/globals.css';

const preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/ } },
    nextjs: {
      appDirectory: true,
    },
  },
};

export default preview;
