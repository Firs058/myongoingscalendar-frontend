export const domain = {
  data: () => ({
    regex: RegExp('([a-z]{1,2}tps?):\\/\\/((?:(?!(?:\\/|#|\\?|&)).)+)(?:(\\/(?:(?:(?:(?!(?:#|\\?|&)).)+\\/))?))?(?:((?:(?!(?:\\.|$|\\?|#)).)+))?(?:(\\.(?:(?!(?:\\?|$|#)).)+))?(?:(\\?(?:(?!(?:$|#)).)+))?(?:(#.+))?', 'g')
  }),
  computed: {
    baseUrl() {
      return process.env.BASE_URL;
    },
    domain() {
      return this.regex.exec(this.baseUrl)[2];
    },
    adminEmail() {
      const domain = this.domain;
      return !!domain ? `admin@${domain}` : '';
    }
  }
};
