import * as Sentry from '@sentry/react';
import { Integrations} from "@sentry/tracing";

const logger = Sentry.init({ // don't really need -> essentially logs errors to an account on sentry
    dsn: "https://a1824ac790c14c4fb56c4394906a9bde@o483582.ingest.sentry.io/5535592",
    integrations: [
      new Integrations.BrowserTracing(),
    ],
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1,
  });

  export default logger

  