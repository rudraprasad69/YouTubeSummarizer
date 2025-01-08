import { NhostClient } from '@nhost/react';

// Validate environment variables
if (!process.env.REACT_APP_NHOST_SUBDOMAIN || !process.env.REACT_APP_NHOST_REGION) {
  console.error(
    'Missing required environment variables: REACT_APP_NHOST_SUBDOMAIN or REACT_APP_NHOST_REGION. Please check your .env file.'
  );
}

const nhost = new NhostClient({
  subdomain: process.env.REACT_APP_NHOST_SUBDOMAIN || '', // Provide default empty string to avoid crashes
  region: process.env.REACT_APP_NHOST_REGION || '', // Provide default empty string to avoid crashes
});

export default nhost;
