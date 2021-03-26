export const image = {
  methods: {
    getImagePath({ paths, type }) {
      const noImage = paths.filter(e => e.mimeType === 'SVG');
      paths = !!noImage.length ? noImage : this.webpIsSupported ? paths.filter(e => e.mimeType === 'WEBP') : paths.filter(e => e.mimeType === 'JPG');
      return !!paths.length ? paths.find(i => i.imageType === type).path : '/images/noimage.svg';
    },
    getAvatarPath({ paths }) {
      paths = (!!paths && !!paths.length) ? this.webpIsSupported ? paths.filter(e => e.mimeType === 'WEBP') : paths.filter(e => e.mimeType !== 'WEBP') : null;
      return paths !== null ? paths[0].path : null;
    }
  },
  computed: {
    webpIsSupported: {
      get() {
        return this.$store.getters.webpIsSupported;
      }
    }
  }
};
