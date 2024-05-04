export default function setupAxios(axios: any, store: any) {
  axios.defaults.headers.Accept = 'application/json';
  axios.interceptors.request.use(
    (config: any) => {
      const {
        auth: {accessToken},
      } = store.getState();

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      config.headers.tenant = 'root';

      return config;
    },
    (err: any) => Promise.reject(err)
  );
}
